import api from "@/utils/axios";
import type { Conversation } from "@/types/chat";

export const createConversation = async (): Promise<Conversation> => {
  const { data } = await api.post<Conversation>(
    "/api/chat/create-conversation"
  );

  return data;
};