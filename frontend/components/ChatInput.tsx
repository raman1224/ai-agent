

"use client";

import { useEffect, useRef, useState } from "react";

import {
  Code2,
  FileText,
  Globe,
  ImageIcon,
  MessageSquare,
  Mic,
  MicOff,
  Paperclip,
  Presentation,
  Send,
  Zap,
  Loader2,
} from "lucide-react";

import sendMessage from "@/features/sendMessage";
import { addMessages, setArtifacts } from "@/redux/messageSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

import { createConversation } from "@/features/createConversation";
import {
  addConversation,
  setConvTitle,
  setSelectedConversation,
} from "@/redux/conversationSlice";

import { updateConversation } from "@/features/uploadConversation";

const agents = [
  { id: "auto", label: "Auto", icon: Zap },
  { id: "chat", label: "Chat", icon: MessageSquare },
  { id: "coding", label: "Coding", icon: Code2 },
  // { id: "pdf", label: "PDF", icon: FileText },
  // { id: "ppt", label: "PPT", icon: Presentation },
   { id: "image", label: "Image", icon: ImageIcon },
  { id: "search", label: "Search", icon: Globe },
];

type SpeechRecognitionResult = {
  transcript: string;
};

type SpeechRecognitionEvent = {
  resultIndex: number;
  results: ArrayLike<ArrayLike<SpeechRecognitionResult>>;
};

type SpeechRecognitionInstance = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  start: () => void;
  stop: () => void;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance;

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

function ChatInput() {
  const [value, setValue] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState("Auto");
  const [listening, setListening] = useState(false);

  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  const dispatch = useAppDispatch();

  const selectedConversation = useAppSelector(
    (state) => state.conversation.selectedConversation
  );


  const userData = useAppSelector((state) => state.user.userData);

const guestConversationIdRef = useRef<string | null>(null);

useEffect(() => {
  const handleNewChat = () => {
    guestConversationIdRef.current = null;
  };

  window.addEventListener("new-chat", handleNewChat);

  return () => {
    window.removeEventListener("new-chat", handleNewChat);
  };
}, []);


  // Speech recognition setup
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.continuous = true;

    recognition.onresult = (event) => {
      let transcript = "";

      for (
        let index = event.resultIndex;
        index < event.results.length;
        index++
      ) {
        transcript += event.results[index][0].transcript;
      }

      setValue((previous) => {
        const finalTranscript = transcript.trim();

        return previous
          ? `${previous.replace(/\s+$/, "")} ${finalTranscript}`
          : finalTranscript;
      });
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.onerror = () => {
      setListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
      recognitionRef.current = null;
    };
  }, []);

  const toggleMic = () => {
    const recognition = recognitionRef.current;

    if (!recognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    if (listening) {
      recognition.stop();
      setListening(false);
    } else {
      try {
        recognition.start();
        setListening(true);
      } catch (error) {
        console.error("Speech recognition failed:", error);
      }
    }
  };
  const handleSendMessage = async () => {
  const prompt = value.trim();

  if (!prompt || isSending) return;

  if (listening) {
    recognitionRef.current?.stop();
    setListening(false);
  }

  setIsSending(true);
  setValue("");

  try {
    let conversationId: string;

    if (userData) {
      // LOGGED-IN USER
      let conversation = selectedConversation;

      if (!conversation) {
        conversation = await createConversation();

        dispatch(setSelectedConversation(conversation));
        dispatch(addConversation(conversation));
      }

      if (conversation.title === "New Chat") {
        const title = prompt.slice(0, 40);

        await updateConversation({
          id: conversation._id,
          title,
        });

        dispatch(
          setConvTitle({
            conversationId: conversation._id,
            title,
          })
        );
      }

      conversationId = conversation._id;
    } else {
      // GUEST USER
      // Reuse the same ID for messages in this guest conversation.
      if (!guestConversationIdRef.current) {
        guestConversationIdRef.current = crypto.randomUUID();
      }

      conversationId = guestConversationIdRef.current;
    }

    // Display the user message immediately in Redux.
    dispatch(
      addMessages({
        role: "user",
        content: prompt,
        images: [],
        artifacts: [],
      })
    );

    const payload = {
      prompt,
      conversationId,
      agent: selectedAgent.toLowerCase(),
    };

    const data = await sendMessage(payload);

    dispatch(setArtifacts(data.artifacts || []));

    dispatch(
      addMessages({
        role: "assistant",
        content: data.answer,
        images: data.images ?? [],
        artifacts: data.artifacts ?? [],
      })
    );
  } catch (error) {
    console.error("Failed to send message:", error);
    setValue(prompt);
  } finally {
    setIsSending(false);
  }
};

  // const handleSendMessage = async () => {
  //   const prompt = value.trim();

  //   if (!prompt || isSending) return;

  //   if (listening) {
  //     recognitionRef.current?.stop();
  //     setListening(false);
  //   }

  //   setIsSending(true);
  //   setValue("");

  //   try {
  //     let conversation = selectedConversation;

  //     if (!conversation) {
  //       conversation = await createConversation();

  //       dispatch(setSelectedConversation(conversation));
  //       dispatch(addConversation(conversation));
  //     }

  //     if (conversation.title === "New Chat") {
  //       const title = prompt.slice(0, 40);

  //       await updateConversation({
  //         id: conversation._id,
  //         title,
  //       });

  //       dispatch(
  //         setConvTitle({
  //           conversationId: conversation._id,
  //           title,
  //         })
  //       );
  //     }

  //     dispatch(
  //       addMessages({
  //         role: "user",
  //         content: prompt,
  //         images: [],
  //         artifacts: [],
  //       })
  //     );

  //     const payload = {
  //       prompt,
  //       conversationId: conversation._id,
  //       agent: selectedAgent.toLowerCase(),
  //     };

  //     const data = await sendMessage(payload);

  //     dispatch(setArtifacts(data.artifacts || []));

  //     dispatch(
  //       addMessages({
  //         role: "assistant",
  //         content: data.answer,
  //         images: data.images ?? [],
  //         artifacts: data.artifacts ?? [],
  //       })
  //     );
  //   } catch (error) {
  //     console.error("Failed to send message:", error);
  //     setValue(prompt);
  //   } finally {
  //     setIsSending(false);
  //   }
  // };

  return (
    <div className="shrink-0 px-3 pb-3 pt-2 sm:px-5 sm:pb-5">
      <div className="mx-auto w-full max-w-3xl">

        {/* Agent selector */}
        <div className="mb-3 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="mr-1 shrink-0 text-xs text-zinc-500">
            Mode
          </span>

          {agents.map((agent) => {
            const isActive = selectedAgent === agent.label;
            const Icon = agent.icon;

            return (
              <button
                key={agent.id}
                type="button"
                onClick={() => setSelectedAgent(agent.label)}
                disabled={isSending}
                aria-pressed={isActive}
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                  isActive
                    ? "border-indigo-400/30 bg-indigo-500/15 text-indigo-300"
                    : "border-white/[0.07] bg-[#191a20] text-zinc-400 hover:border-white/15 hover:bg-[#22232a] hover:text-white"
                } disabled:cursor-not-allowed disabled:opacity-50`}
              >
                <Icon size={14} />
                {agent.label}
              </button>
            );
          })}
        </div>

        {/* Input box */}
        <div className="overflow-hidden rounded-2xl border border-white/[0.10] bg-[#191a20] shadow-lg transition-colors focus-within:border-indigo-400/40">

          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Message DANGOL AI..."
            rows={3}
            disabled={isSending}
            aria-label="Message DANGOL AI"
            className="max-h-48 min-h-[85px] w-full resize-y bg-transparent px-4 py-4 text-sm leading-6 text-zinc-100 outline-none placeholder:text-zinc-500 disabled:opacity-60 sm:px-5"
          />

          <div className="flex items-center justify-between border-t border-white/[0.06] px-3 py-3 sm:px-4">

            <div className="flex items-center gap-1">

              <button
                type="button"
                disabled
                title="Attachments coming soon"
                aria-label="Attachments coming soon"
                className="cursor-not-allowed rounded-lg p-2 text-zinc-600"
              >
                <Paperclip size={17} />
              </button>

              <button
                type="button"
                onClick={toggleMic}
                disabled={isSending}
                title={listening ? "Stop recording" : "Start voice input"}
                aria-label={listening ? "Stop recording" : "Start voice input"}
                aria-pressed={listening}
                className={`rounded-lg p-2 transition-colors ${
                  listening
                    ? "bg-red-500/15 text-red-400 hover:bg-red-500/25"
                    : "text-zinc-500 hover:bg-white/[0.06] hover:text-zinc-200"
                } disabled:cursor-not-allowed disabled:opacity-40`}
              >
                {listening ? (
                  <Mic size={17} />
                ) : (
                  <MicOff size={17} />
                )}
              </button>

              {listening && (
                <span className="ml-1 flex items-center gap-1.5 text-[10px] text-red-400">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-400" />
                  Listening
                </span>
              )}

              <span className="ml-2 hidden text-[11px] text-zinc-600 sm:block">
                Shift + Enter for a new line
              </span>
            </div>

            <button
              type="button"
              onClick={handleSendMessage}
              disabled={!value.trim() || isSending}
              aria-label="Send message"
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500 text-white transition-colors hover:bg-indigo-400 disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-500"
            >
              {isSending ? (
                <Loader2 size={17} className="animate-spin" />
              ) : (
                <Send size={17} />
              )}
            </button>
          </div>
        </div>

        <p className="mt-3 text-center text-[10px] text-zinc-600 sm:text-[11px]">
          DANGOL AI can make mistakes. Check important information.
        </p>
      </div>
    </div>
  );
}

export default ChatInput;
