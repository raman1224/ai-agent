
"use client";

import { useEffect } from "react";

import Nav from "./Nav";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";

import getMessages from "@/features/getMessages";
import { setArtifacts, setMessages } from "@/redux/messageSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

function ChatArea() {
  const dispatch = useAppDispatch();

  const selectedConversation = useAppSelector(
    (state) => state.conversation.selectedConversation
  );

  useEffect(() => {
    const conversationId = selectedConversation?._id;

    if (!conversationId) {
      dispatch(setMessages([]));
      dispatch(setArtifacts([]));

      return;
    }

    // if (selectedConversation.title === "New Chat") {
    //   dispatch(setMessages([]));
    //   dispatch(setArtifacts([]));

    //   return;
    // }

    let cancelled = false;

    const fetchMessages = async () => {
      try {
        const data = await getMessages(conversationId);

        if (!cancelled) {
          dispatch(setMessages(data));
          const latestArtifactMessage = [...data]
            .reverse()
            .find((message) => message.artifacts?.length);
          dispatch(setArtifacts(latestArtifactMessage?.artifacts ?? []));
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Failed to fetch messages:", error);
          dispatch(setMessages([]));
          dispatch(setArtifacts([]));
        }
      }
    };

    fetchMessages();

    return () => {
      cancelled = true;
    };
  }, [selectedConversation?._id, selectedConversation?.title, dispatch]);

  return (
    <section className="flex min-w-0 flex-1 flex-col overflow-hidden bg-[#101114]">
      <Nav />
      <MessageList />
      <ChatInput />
    </section>
  );
}

export default ChatArea;
