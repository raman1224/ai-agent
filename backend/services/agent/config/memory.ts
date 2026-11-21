


import redis from "../redis/redis";
import { getMessages } from "../utils/getMessages";

const getMemoryKey = (conversationId: string, isGuest: boolean) => {
  return isGuest
    ? `guest:messages-${conversationId}`
    : `messages-${conversationId}`;
};

export const getMemory = async (
  conversationId: string,
  userId: string
) => {
  const isGuest = userId.startsWith("guest:");
  const key = getMemoryKey(conversationId, isGuest);

  const cached = await redis.get(key);

  if (cached) {
    const messages: unknown = JSON.parse(cached);

    if (Array.isArray(messages)) {
      return messages;
    }
  }

  // A guest must never load messages from MongoDB.
  if (isGuest) {
    return [];
  }

  // Logged-in users can load their saved messages.
  const messages = await getMessages(conversationId, userId);

  await redis.set(
    key,
    JSON.stringify(messages),
    "EX",
    24 * 60 * 60
  );

  return messages;
};

export const addMessage = async ({
  conversationId,
  role,
  content,
  isGuest = false,
}: {
  conversationId: string;
  role: string;
  content: string;
  isGuest?: boolean;
}) => {
  const key = getMemoryKey(conversationId, isGuest);

  const rawMessages = await redis.get(key);

  const messages = rawMessages
    ? JSON.parse(rawMessages)
    : [];

  messages.push({ role, content });

  if (messages.length > 20) {
    messages.shift();
  }

  if (isGuest) {
    // Guest context is temporary and expires automatically.
    await redis.set(
      key,
      JSON.stringify(messages),
      "EX",
      24 * 60 * 60
    );
  } else {
    await redis.set(key, JSON.stringify(messages));
  }
};
