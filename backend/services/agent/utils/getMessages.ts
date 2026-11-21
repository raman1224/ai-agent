import axios from "axios";

export interface ChatMessage {
    role: string;
    content: string;
}

export const getMessages = async (
    conversationId: string,
    userId: string
): Promise<ChatMessage[]> => {
    const chatService = process.env.CHAT_SERVICE;
    if (!chatService) {
        throw new Error("CHAT_SERVICE is not configured");
    }

    const { data } = await axios.get<ChatMessage[]>(
        `${chatService}/get-messages/${encodeURIComponent(conversationId)}`,
        { headers: { "x-user-id": userId } }
    );
    return data;
};