

import type { GeneratedArtifact } from "@/types/chat";
import api from "@/utils/axios";

interface SendMessagePayload {
  prompt: string;
  conversationId: string;
  agent: string;
}

interface SendMessageResponse {
  answer: string;
  images?: string[];
  artifacts?: GeneratedArtifact[];
}

export default async function sendMessage(
  payload: SendMessagePayload
): Promise<SendMessageResponse> {
  const { data } = await api.post<SendMessageResponse>(
    "/api/agent/chat",
    payload
  );

  return data;
}