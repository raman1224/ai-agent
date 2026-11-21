// import type { Request, Response } from "express";
// import { Conversation } from "../models/conversation.model.js";
// import { Message } from "../models/message.model.js";

// export const createConversation = async (
//   req: Request,
//   res: Response,
// ): Promise<void> => {
//   try {
//     const userId = req.headers["x-user-id"];

//     if (!userId || Array.isArray(userId)) {
//       res.status(401).json({
//         message: "User ID is missing or invalid",
//       });
//       return;
//     }

//     const conversation = await Conversation.create({
//       userId: userId,
//     });

//     res.status(201).json(conversation);
//   } catch (error: unknown) {
//     console.error("Create conversation error:", error);

//     res.status(500).json({
//       message: "Failed to create conversation",
//     });
//   }
// };

// export const getConversation = async (
//   req: Request,
//   res: Response,
// ): Promise<void> => {
//   try {
//     const userId = req.headers["x-user-id"];

//     if (!userId || Array.isArray(userId)) {
//       res.status(401).json({
//         message: "User ID is missing or invalid",
//       });
//       return;
//     }

//     const conversation = await Conversation.find({
//       userId: userId,
//     }).sort({ updatedAt: -1 });

//     res.status(201).json(conversation);
//   } catch (error: unknown) {
//     console.error("get conversation error:", error);

//     res.status(500).json({
//       message: "Failed to get conversation",
//     });
//   }
// };

// export const updateConversation = async (
//   req: Request,
//   res: Response,
// ): Promise<void> => {
//   try {
//     const { id, title } = req.body;

//     const conversation = await Conversation.findByIdAndUpdate(
//       id,
//       { title },
//       { new: true },
//     );

//     if (!conversation) {
//       res.status(404).json({
//         message: "Conversation not found",
//       });
//       return;
//     }

//     res.status(200).json(conversation);
//   } catch (error: unknown) {
//     console.error("Update conversation error:", error);

//     res.status(500).json({
//       message: "Failed to update conversation",
//     });
//   }
// };

// export const saveMessage = async (
//   req: Request,
//   res: Response,
// ): Promise<void> => {
//   try {
//     const { conversationId, role, content, images, artifacts } = req.body;
//     const message = await Message.create({
//       conversationId,
//       content,
//       role,
//       images,
//       artifacts
//     });

//     res.status(200).json(message);
//   } catch (error: unknown) {
//     res.status(500).json({
//       message: "save msg error",
//     });
//   }
// };

// export const getMessages = async (
//   req: Request,
//   res: Response,
// ): Promise<void> => {
//   try {
//     const messages = await Message.find({
//       conversationId: req.params.conversationId 
//     });

//     res.status(200).json(messages);
//   } catch (error: unknown) {
//     res.status(500).json({
//       message: "get msg error",
//     });
//   }
// };


import type { Request, Response } from "express";
import mongoose from "mongoose";

import { Conversation } from "../models/conversation.model.js";
import { Message } from "../models/message.model.js";

const getOwnerId = (req: Request): string | null => {
  const userId = req.headers["x-user-id"];

  if (typeof userId === "string" && userId.trim()) {
    return `user:${userId}`;
  }

  const guestId = req.headers["x-guest-id"];

  if (typeof guestId === "string" && guestId.trim()) {
    return `guest:${guestId}`;
  }

  return null;
};

export const createConversation = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const ownerId = getOwnerId(req);

    if (!ownerId) {
      res.status(401).json({ message: "Missing conversation owner" });
      return;
    }

    const conversation = await Conversation.create({
      userId: ownerId,
    });

    res.status(201).json(conversation);
  } catch (error) {
    console.error("Create conversation error:", error);
    res.status(500).json({ message: "Failed to create conversation" });
  }
};

export const getConversation = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const ownerId = getOwnerId(req);

    if (!ownerId) {
      res.status(401).json({ message: "Missing conversation owner" });
      return;
    }

    const conversations = await Conversation.find({
      userId: ownerId,
    }).sort({ updatedAt: -1 });

    res.status(200).json(conversations);
  } catch (error) {
    console.error("Get conversations error:", error);
    res.status(500).json({ message: "Failed to get conversations" });
  }
};

export const updateConversation = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const ownerId = getOwnerId(req);

    if (!ownerId) {
      res.status(401).json({ message: "Missing conversation owner" });
      return;
    }

    const { id, title } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      res.status(400).json({ message: "Invalid conversation ID" });
      return;
    }

    const conversation = await Conversation.findOneAndUpdate(
      { _id: id, userId: ownerId },
      { title },
      { new: true, runValidators: true }
    );

    if (!conversation) {
      res.status(404).json({ message: "Conversation not found" });
      return;
    }

    res.status(200).json(conversation);
  } catch (error) {
    console.error("Update conversation error:", error);
    res.status(500).json({ message: "Failed to update conversation" });
  }
};

export const saveMessage = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const ownerId = getOwnerId(req);

    if (!ownerId) {
      res.status(401).json({ message: "Missing conversation owner" });
      return;
    }

    const { conversationId, role, content, images, artifacts } = req.body;

    if (!mongoose.isValidObjectId(conversationId)) {
      res.status(400).json({ message: "Invalid conversation ID" });
      return;
    }

    const conversation = await Conversation.findOne({
      _id: conversationId,
      userId: ownerId,
    });

    if (!conversation) {
      res.status(404).json({ message: "Conversation not found" });
      return;
    }

    if (!["user", "assistant", "system"].includes(role)) {
      res.status(400).json({ message: "Invalid message role" });
      return;
    }

    const message = await Message.create({
      conversationId,
      role,
      content,
      images: images ?? [],
      artifacts: artifacts ?? [],
    });

    await Conversation.updateOne(
      { _id: conversationId, userId: ownerId },
      { $set: { updatedAt: new Date() } }
    );

    res.status(201).json(message);
  } catch (error) {
    console.error("Save message error:", error);
    res.status(500).json({ message: "Failed to save message" });
  }
};

export const getMessages = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const ownerId = getOwnerId(req);
    const { conversationId } = req.params;

    if (!ownerId) {
      res.status(401).json({ message: "Missing conversation owner" });
      return;
    }

    if (!mongoose.isValidObjectId(conversationId)) {
      res.status(400).json({ message: "Invalid conversation ID" });
      return;
    }

    const conversation = await Conversation.findOne({
      _id: conversationId,
      userId: ownerId,
    });

    if (!conversation) {
      res.status(404).json({ message: "Conversation not found" });
      return;
    }

    const messages = await Message.find({
      conversationId,
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.error("Get messages error:", error);
    res.status(500).json({ message: "Failed to get messages" });
  }
};
