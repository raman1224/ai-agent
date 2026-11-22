

"use client";

import { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";

import {
  Coins,
  Loader2,
  LogOut,
  MessageSquare,
  PanelLeft,
  PanelRight,
  Plus,
  Sparkles,
  User,
} from "lucide-react";

import { getConversations } from "@/features/getConversation";
import logout from "@/features/logout";

import {
  setConversations,
  setSelectedConversation,
} from "@/redux/conversationSlice";

import { setMessages } from "@/redux/messageSlice";
import { setUserdata } from "@/redux/userSlice";

import {
  useAppDispatch,
  useAppSelector,
} from "@/redux/hooks";

interface SidebarProps {
  onGoogleLogin: () => void;
  isSigningIn: boolean;
  errorMessage: string;
}

function Sidebar({
  onGoogleLogin,
  isSigningIn,
  errorMessage,
}: SidebarProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [imageError, setImageError] = useState(false);

  const dispatch = useAppDispatch();

  const { conversations, selectedConversation } = useAppSelector(
    (state) => state.conversation
  );

  const { userData } = useAppSelector(
    (state) => state.user
  );

  useEffect(() => {
    if (!userData?._id) {
      dispatch(setConversations([]));
      return;
    }

    let cancelled = false;

    const fetchConversations = async () => {
      try {
        const data = await getConversations();

        if (!cancelled) {
          dispatch(setConversations(data));

          if (data.length > 0) {
            dispatch(setSelectedConversation(data[0]));
          } else {
            dispatch(setSelectedConversation(null));
            dispatch(setMessages([]));
          }
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Failed to fetch conversations:", error);
        }
      }
    };

    fetchConversations();

    return () => {
      cancelled = true;
    };
  }, [userData?._id, dispatch]);
const handleNewChat = () => {
  dispatch(setSelectedConversation(null));
  dispatch(setMessages([]));

  window.dispatchEvent(new Event("new-chat"));
};
  // const handleNewChat = () => {
  //   dispatch(setSelectedConversation(null));
  //   dispatch(setMessages([]));
  // };

  const handleLogout = async () => {
    try {
      await logout();

      dispatch(setUserdata(null));
      dispatch(setConversations([]));
      dispatch(setSelectedConversation(null));
      dispatch(setMessages([]));
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <aside
      className={`relative flex h-full shrink-0 flex-col border-r border-white/[0.07] bg-[#15161b] transition-[width] duration-200 ${
        isOpen ? "w-[260px]" : "w-[64px]"
      }`}
    >
      {/* Header */}
      <div className="flex h-[60px] shrink-0 items-center justify-between border-b border-white/[0.06] px-3">
        {isOpen && (
          <div className="flex min-w-0 items-center ">
            <div className="flex h-18 w-18 shrink-0 items-center justify-center rounded-lg  text-indigo-400">
              <img src="/ai.webp" alt="logo" className=" h-17 w-17" />
            </div>

            <span className="truncate text-sm font-semibold tracking-tight text-zinc-100">
              DANGOL AI
            </span>
          </div>
        )}

        <button
          type="button"
          onClick={() => setIsOpen((current) => !current)}
          aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
          title={isOpen ? "Collapse sidebar" : "Expand sidebar"}
          className="rounded-lg p-2 text-zinc-500 transition hover:bg-white/[0.06] hover:text-white"
        >
          {isOpen ? (
            <PanelLeft size={18} />
          ) : (
            <PanelRight size={18} />
          )}
        </button>
      </div>

      {/* New chat */}
      <div className="shrink-0 p-3">
        <button
          type="button"
          onClick={handleNewChat}
          title={!isOpen ? "New Chat" : undefined}
          className={`flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-indigo-500 px-3 text-sm font-medium text-white transition hover:bg-indigo-400 ${
            isOpen ? "" : "px-0"
          }`}
        >
          <Plus size={18} />
          {isOpen && "New Chat"}
        </button>
      </div>

      {/* Conversation list */}
      <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-3">
        {isOpen && (
          <p className="mb-3 px-2 pt-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-600">
            Recent conversations
          </p>
        )}

        {conversations.length === 0 && isOpen && (
          <p className="px-3 py-5 text-xs leading-5 text-zinc-600">
            Your conversations will appear here.
          </p>
        )}

        <div className="space-y-1">
          {conversations.map((conv) => {
            const isActive =
              selectedConversation?._id === conv._id;

            return (
              <button
                key={conv._id}
                type="button"
                onClick={() => {
                  dispatch(setSelectedConversation(conv));
                }}
                title={!isOpen ? conv.title || "New Chat" : undefined}
                aria-current={isActive ? "page" : undefined}
                className={`flex min-h-10 w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition ${
                  isActive
                    ? "bg-indigo-500/10 text-indigo-300"
                    : "text-zinc-500 hover:bg-white/[0.045] hover:text-zinc-200"
                }`}
              >
                <MessageSquare size={16} className="shrink-0" />

                {isOpen && (
                  <span className="min-w-0 flex-1 truncate text-xs">
                    {conv.title || "New Chat"}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Account section */}
      <div className="shrink-0 border-t border-white/[0.07] p-3">
        {userData ? (
          <div className="flex min-w-0 items-center gap-2">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-[#25262d] text-zinc-400">
              {userData.avatar && !imageError ? (
                <img
                  src={userData.avatar}
                  alt={userData.name || "User avatar"}
                  className="h-full w-full object-cover"
                  onError={() => setImageError(true)}
                />
              ) : (
                <User size={17} />
              )}
            </div>

            {isOpen && (
              <>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium text-zinc-200">
                    {userData.name || "User"}
                  </p>

                  <p className="mt-0.5 text-[10px] text-zinc-600">
                    Free plan
                  </p>
                </div>

                <button
                  type="button"
                  title="Credits"
                  className="rounded-lg p-2 text-zinc-500 transition hover:bg-white/[0.06] hover:text-white"
                >
                  <Coins size={16} />
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  title="Logout"
                  className="rounded-lg p-2 text-zinc-500 transition hover:bg-red-500/10 hover:text-red-400"
                >
                  <LogOut size={16} />
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            <button
              type="button"
              onClick={onGoogleLogin}
              disabled={isSigningIn}
              title={!isOpen ? "Continue with Google" : undefined}
              className="flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-2 text-sm font-medium text-zinc-200 transition hover:bg-white/[0.1] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSigningIn ? (
                <Loader2 size={17} className="animate-spin" />
              ) : (
                <FcGoogle size={19} />
              )}

              {isOpen && (
                <span>
                  {isSigningIn ? "Signing in..." : "Sign in with Google"}
                </span>
              )}
            </button>

            {isOpen && errorMessage && (
              <p
                role="alert"
                className="break-words rounded-lg border border-red-500/20 bg-red-500/10 p-2 text-xs text-red-400"
              >
                {errorMessage}
              </p>
            )}

            {isOpen && (
              <p className="px-1 text-center text-[10px] text-zinc-600">
                You can use the chatbot without signing in.
              </p>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}

export default Sidebar;
