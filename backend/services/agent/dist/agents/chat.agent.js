"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatAgent = void 0;
const llmModels_js_1 = require("../config/llmModels.js");
const memory_js_1 = require("../config/memory.js");
const messages_1 = require("@langchain/core/messages");
const chatAgent = async (state) => {
    const llm = await (0, llmModels_js_1.getModel)("chat");
    const history = await (0, memory_js_1.getMemory)(state.conversationId, state.userId);
    const searchContext = state.searchResults ? `
Web Search Results:
${JSON.stringify(state.searchResults)}
Answer the user using only the above search results.
` : "";
    const systemPrompt = `
    You are DANGOL AI, an intelligent AI assistant.
  ${searchContext}

  if searchContext exists:
  - use search results to ansewr . 
  - do not mention internal tools.
  
    Rules:
    - Provide accurate and concise information.
    - For simple questions, greetings and short queries, respond in a friendly and conversational manner.
    - For technical, educational, coding or detailed topics, use clean Markdown formatting.

    Formatting:
    - Use Markdown formatting.
    - Leave a blank line after headings and before lists.
    - Use bullet points for lists.
    - Use numbered lists for steps.
    - Use fenced code blocks with language tags for code snippets.
    - Keep paragraphs short and concise.
    - Never write headings and content on the same line.
    - Avoid large walls of text.
  `;
    const messages = [
        new messages_1.SystemMessage(systemPrompt)
    ];
    history.forEach((msg) => {
        if (msg.role == "user") {
            messages.push(new messages_1.HumanMessage(msg.content));
        }
        else {
            messages.push(new messages_1.AIMessage(msg.content));
        }
    });
    messages.push(new messages_1.HumanMessage(state.prompt));
    const response = await llm.invoke(messages);
    //   [
    //   {
    //     role: "system",
    //     content: systemPrompt,
    //   },
    //   {
    //     role: "human",
    //     content: state.prompt,
    //   },
    // ];
    return {
        ...state,
        aiResponse: response.content,
    };
};
exports.chatAgent = chatAgent;
