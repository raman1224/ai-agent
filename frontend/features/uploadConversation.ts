import api from "@/utils/axios";
import type { Conversation } from "@/types/chat";

interface UpdateConversationPayload {
  id: string;
  title: string;
}

export const updateConversation = async (
  payload: UpdateConversationPayload
): Promise<Conversation> => {
  const { data } = await api.post<Conversation>(
    "/api/chat/update-conversation",
    payload
  );

  return data;
};