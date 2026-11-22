
"use client";

import { useState } from "react";
import type { ReactNode } from "react";

import {
  Check,
  Copy,
  ExternalLink,
  X,
} from "lucide-react";

import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

import {
  Prism as SyntaxHighlighter,
} from "react-syntax-highlighter";

import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

type MessageProps = {
  role: string;
  content: string;
  images: string[];
};

function MessageBubble({
  role,
  content,
  images,
}: MessageProps) {
  const isUser = role === "user";

  const [lightBox, setLightBox] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState("");

  const copyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);

      window.setTimeout(() => {
        setCopiedCode((current) =>
          current === code ? "" : current
        );
      }, 2000);
    } catch (error) {
      console.error("Failed to copy code:", error);
    }
  };

  return (
    <>
      <div
        className={`flex w-full ${
          isUser ? "justify-end" : "justify-start"
        }`}
      >
        <div
          className={`min-w-0 max-w-[95%] overflow-hidden sm:max-w-[90%] ${
            isUser
              ? "rounded-2xl rounded-br-sm border border-indigo-400/20 bg-indigo-500/15 px-4 py-3 text-zinc-100 sm:px-5"
              : "w-full px-1 py-2 text-zinc-300 sm:px-2"
          }`}
        >
          {/* Images */}
          {images.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-3">
              {images.map((img, index) => (
                <button
                  type="button"
                  key={`${img}-${index}`}
                  onClick={() => setLightBox(img)}
                  className="overflow-hidden rounded-xl border border-white/10 transition hover:border-indigo-400/50"
                >
                  <img
                    src={img}
                    alt={`Message attachment ${index + 1}`}
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                    className="h-32 w-36 object-cover sm:h-40 sm:w-48"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Markdown */}
          <div className="markdown-content text-[13px] sm:text-sm">
            <Markdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ children }) => (
                  <h1>{children}</h1>
                ),

                h2: ({ children }) => (
                  <h2>{children}</h2>
                ),

                h3: ({ children }) => (
                  <h3>{children}</h3>
                ),

                p: ({ children }) => (
                  <p className="whitespace-pre-wrap">
                    {children}
                  </p>
                ),

                ul: ({ children }) => (
                  <ul>{children}</ul>
                ),

                ol: ({ children }) => (
                  <ol>{children}</ol>
                ),

                a: ({ href, children }) => (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1"
                  >
                    {children}
                    <ExternalLink size={13} />
                  </a>
                ),

                table: ({ children }) => (
                  <div className="my-4 overflow-x-auto rounded-lg border border-white/10">
                    <table>{children}</table>
                  </div>
                ),

                th: ({ children }) => (
                  <th>{children}</th>
                ),

                td: ({ children }) => (
                  <td>{children}</td>
                ),

                blockquote: ({ children }) => (
                  <blockquote>{children}</blockquote>
                ),

                code: ({ className, children }) => {
                  const code = String(children).replace(/\n$/, "");

                  const language = className?.replace(
                    "language-",
                    ""
                  );

                  const isBlock = Boolean(language) || code.includes("\n");

                  if (!isBlock) {
                    return <code>{children}</code>;
                  }

                  return (
                    <div className="my-5 overflow-hidden rounded-xl border border-white/10 bg-[#0d0e12]">
                      <div className="flex items-center justify-between border-b border-white/[0.08] px-4 py-2.5">
                        <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
                          {language || "Code"}
                        </span>

                        <button
                          type="button"
                          onClick={() => copyCode(code)}
                          className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-zinc-400 transition hover:bg-white/10 hover:text-white"
                        >
                          {copiedCode === code ? (
                            <>
                              <Check size={14} />
                              Copied
                            </>
                          ) : (
                            <>
                              <Copy size={14} />
                              Copy
                            </>
                          )}
                        </button>
                      </div>

                      <SyntaxHighlighter
                        language={language || "text"}
                        style={oneDark}
                        wrapLongLines
                        showLineNumbers
                        customStyle={{
                          margin: 0,
                          padding: "16px",
                          background: "#0d0e12",
                          fontSize: "12px",
                          lineHeight: "1.7",
                          overflowX: "auto",
                        }}
                      >
                        {code}
                      </SyntaxHighlighter>
                    </div>
                  );
                },

                pre: ({ children }) => (
                  <>{children as ReactNode}</>
                ),
              }}
            >
              {content}
            </Markdown>
          </div>
        </div>
      </div>

      {/* Image lightbox */}
      {lightBox && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm sm:p-8"
          onClick={() => setLightBox(null)}
        >
          <button
            type="button"
            aria-label="Close image preview"
            onClick={() => setLightBox(null)}
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20"
          >
            <X size={22} />
          </button>

          <img
            src={lightBox}
            alt="Full size attachment"
            onClick={(e) => e.stopPropagation()}
            className="max-h-[85vh] max-w-[95vw] rounded-xl object-contain"
          />
        </div>
      )}
    </>
  );
}

export default MessageBubble;
