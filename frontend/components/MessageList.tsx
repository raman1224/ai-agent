"use client";

import MessageBubble from "./MessageBubble";

import { useAppSelector } from "@/redux/hooks";

import {
  Code2,
  Globe,
  Lightbulb,
  MessageSquare,
} from "lucide-react";

function MessageList() {
  const selectedConversation = useAppSelector(
    (state) => state.conversation.selectedConversation
  );

  const messages = useAppSelector(
    (state) => state.message.messages
  );

  const suggestions = [
    {
      icon: Code2,
      title: "Write some code",
      description: "Build something or fix a coding problem.",
    },
    {
      icon: Lightbulb,
      title: "Explain something",
      description: "Understand a difficult topic simply.",
    },
    // {
    //   icon: Globe,
    //   title: "Explore an idea",
    //   description: "Research a topic and discover more.",
    // },
    // {
    //   icon: MessageSquare,
    //   title: "Start a conversation",
    //   description: "Ask a question or share your thoughts.",
    // },
  ];

  const isEmpty = messages.length === 0;

  return (
    <div className="flex-1 overflow-y-auto scroll-smooth px-3 sm:px-5">
      {isEmpty ? (
        <div className="mx-auto flex min-h-full w-full max-w-2xl flex-col items-center justify-center text-center">
          <div className="flex h-18 w-18 shrink-0 items-center justify-center rounded-lg text-indigo-400">
            <img src="/ai.webp" alt="logo" className="h-17 w-17" />
          </div>

          <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-indigo-400">
            Your AI workspace
          </p>

          <h1 className="text-2xl font-semibold tracking-tight text-zinc-100 sm:text-3xl">
            What can I help you with?
          </h1>

          <p className="mt-3 max-w-md text-sm leading-6 text-zinc-500">
            Ask a question, work on an idea, write some code
            or explore something new. Let's get started.
          </p>

          <div className="mt-8 grid w-full grid-cols-1 gap-2.5 sm:grid-cols-2">
            {suggestions.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="group rounded-xl border border-white/[0.07] bg-[#17181e] p-3.5 text-left transition hover:border-indigo-400/30 hover:bg-[#1c1d25]"
                >
                  <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.05] text-zinc-400 transition group-hover:bg-indigo-500/10 group-hover:text-indigo-300">
                    <Icon size={18} />
                  </div>

                  <h3 className="text-sm font-medium text-zinc-200">
                    {item.title}
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-zinc-500">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>

          <p className="mt-8 text-[11px] text-zinc-600">
            Built to help you think, create and build.
          </p>
        </div>
      ) : (
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-5 py-6 sm:gap-7 sm:py-8">
          {messages.map((message, index) => (
            <div
              key={message._id ?? `${message.role}-${index}`}
              className="w-full"
            >
              <MessageBubble
                role={message.role}
                content={message.content}
                images={message.images || []}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MessageList;