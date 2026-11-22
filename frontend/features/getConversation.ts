
import api from "@/utils/axios";
import type { Conversation } from "@/types/chat";

const getConversations = async (): Promise<Conversation[]> => {
  const { data } = await api.get<Conversation[]>(
    "/api/chat/get-conversations"
  );

  return data;
};

export { getConversations };
