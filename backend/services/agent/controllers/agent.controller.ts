


import type { Request, Response } from "express";
import axios from "axios";

import { graph } from "../graph/graph";
import { addMessage } from "../config/memory";

export const agent = async (req: Request, res: Response) => {
  try {
    const { prompt, conversationId, agent: selectedAgent } = req.body;

    // The gateway adds this header only for authenticated users.
    const authenticatedUserId = req.headers["x-user-id"];

    const isLoggedIn =
      typeof authenticatedUserId === "string" &&
      authenticatedUserId.trim().length > 0;

    if (
      typeof prompt !== "string" ||
      !prompt.trim() ||
      typeof conversationId !== "string" ||
      !conversationId.trim()
    ) {
      return res.status(400).json({
        message: "Prompt and conversationId are required",
      });
    }

    // Guests receive a temporary identity for LangGraph memory.
    const userId = isLoggedIn
      ? authenticatedUserId
      : `guest:${conversationId}`;

    // Only logged-in users save messages to the Chat service / MongoDB.
    if (isLoggedIn) {
      await axios.post(
        `${process.env.CHAT_SERVICE}/save-message`,
        {
          conversationId,
          role: "user",
          content: prompt,
        },
        {
          headers: {
            "x-user-id": userId,
          },
        }
      );
    }

    // Add the current prompt to temporary/normal Redis memory
    // before invoking the graph, so agents can use it as context.
    await addMessage({
      conversationId,
      role: "user",
      content: prompt,
      isGuest: !isLoggedIn,
    });

    const result = await graph.invoke({
      prompt,
      conversationId,
      agent: selectedAgent,
      userId,
    });

    if (typeof result.aiResponse !== "string") {
      throw new Error("Agent did not return a text response");
    }

    // Save the AI response in Redis memory.
    await addMessage({
      conversationId,
      role: "assistant",
      content: result.aiResponse,
      isGuest: !isLoggedIn,
    });

    // Only logged-in users save the AI response to MongoDB.
    if (isLoggedIn) {
      await axios.post(
        `${process.env.CHAT_SERVICE}/save-message`,
        {
          conversationId,
          role: "assistant",
          content: result.aiResponse,
          images: result.images,
          artifacts: result.artifacts,
        },
        {
          headers: {
            "x-user-id": userId,
          },
        }
      );
    }

    return res.status(200).json({
      answer: result.aiResponse,
      images: result.images,
      artifacts: result.artifacts,
    });
  } catch (error) {
    console.error("Agent request failed:", error);

    if (axios.isAxiosError(error)) {
      console.error("Chat service error:", error.response?.data);
    }

    return res.status(500).json({
      message: "Agent request failed",
    });
  }
};
