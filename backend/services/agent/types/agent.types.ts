import type { BaseMessage } from "@langchain/core/messages";

export interface AgentState {
  prompt: string;
  aiResponse?: BaseMessage["content"];
  conversationId: string;
  userId: string;
  searchResults?: any;
  images?: string[];
}