
"use client";

import {
  MessageSquare,
  Sparkles,
} from "lucide-react";

import { useAppSelector } from "@/redux/hooks";

function Nav() {
  const selectedConversation = useAppSelector(
    (state) => state.conversation.selectedConversation
  );

  const messages = useAppSelector(
    (state) => state.message.messages
  );

  return (
    <header className="flex h-[60px] shrink-0 items-center justify-between border-b border-white/[0.07] px-4 sm:px-6">
      <div className="flex min-w-0 items-center">
        <div className="flex h-18 w-18 shrink-0 items-center justify-center rounded-lg  text-indigo-400">
          {selectedConversation ? (
            <MessageSquare size={16} />
          ) : (
              <img src="/ai.webp" alt="logo" className=" h-17 w-17" />
          )}
        </div>

        <div className="min-w-0">
          <h2 className="truncate text-sm font-medium text-zinc-200">
            {selectedConversation?.title || "New conversation"}
          </h2>

          <p className="text-[10px] text-zinc-500">
            DANGOL AI
          </p>
        </div>
      </div>

      <span className="shrink-0 rounded-full border border-white/[0.07] bg-white/[0.03] px-2.5 py-1 text-[10px] text-zinc-500 sm:text-xs">
        {messages.length} {messages.length === 1 ? "message" : "messages"}
      </span>
    </header>
  );
}

export default Nav;
