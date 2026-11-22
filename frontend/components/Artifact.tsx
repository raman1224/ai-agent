
"use client";

import { useState } from "react";

import {
  Check,
  Code2,
  Copy,
  Eye,
  FileCode2,
  FileJson,
  FileText,
  PanelRightClose,
  PanelRightOpen,
  RefreshCw,
  X,
} from "lucide-react";

import { motion } from "motion/react";
import { Editor } from "@monaco-editor/react";

import { useAppSelector } from "@/redux/hooks";
import type {
  ArtifactFile,
  GeneratedArtifact,
} from "@/types/chat";

function Artifact() {
  const [collapsed, setCollapsed] = useState(false);
  const [tab, setTab] = useState<"code" | "preview">("code");
  const [activeFile, setActiveFile] = useState(0);
  const [copied, setCopied] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Generated artifacts from Redux
  const artifacts = useAppSelector(
    (state) => state.message.artifacts
  ) as unknown as GeneratedArtifact[];

  const artifact = artifacts?.[0];

  // Local editor changes
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [previousArtifact, setPreviousArtifact] = useState(artifact);

  if (previousArtifact !== artifact) {
    setPreviousArtifact(artifact);
    setActiveFile(0);
    setTab("code");
    setDrafts({});
    setCopied(false);
  }

  const files: ArtifactFile[] = Array.isArray(artifact?.files)
    ? artifact.files
    : [];

  const safeActiveFile = Math.min(
    activeFile,
    Math.max(files.length - 1, 0)
  );

  const file = files[safeActiveFile];

  if (previousArtifact === artifact && activeFile >= files.length && files.length > 0) {
    setActiveFile(0);
  }

  if (!artifact) return null;

  const getContent = (target?: ArtifactFile) => {
    if (!target) return "";

    return drafts[target.name] ?? target.content ?? "";
  };

  const fileContent = getContent(file);

  const htmlFile = files.find(
    (f) => f.name.toLowerCase() === "index.html"
  );

  const cssFile = files.find(
    (f) => f.name.toLowerCase() === "style.css"
  );

  const jsFile = files.find(
    (f) => f.name.toLowerCase() === "script.js"
  );

  const canPreview = Boolean(htmlFile);

  // Build the preview using the generated HTML, CSS and JS.
  const previewDoc = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    ${getContent(cssFile)}
  </style>
</head>
<body>
  ${getContent(htmlFile)}
  <script>
    ${getContent(jsFile)}
  </script>
</body>
</html>
`;

  const detectLanguage = (fileName = "") => {
    const name = fileName.toLowerCase();

    if (name.endsWith(".html")) return "html";
    if (name.endsWith(".css")) return "css";
    if (name.endsWith(".js")) return "javascript";
    if (name.endsWith(".ts")) return "typescript";
    if (name.endsWith(".jsx")) return "javascript";
    if (name.endsWith(".tsx")) return "typescript";
    if (name.endsWith(".json")) return "json";
    if (name.endsWith(".py")) return "python";
    if (name.endsWith(".java")) return "java";
    if (name.endsWith(".cpp")) return "cpp";
    if (name.endsWith(".c")) return "c";

    return "plaintext";
  };

  const getFileIcon = (fileName: string) => {
    const name = fileName.toLowerCase();

    if (name.endsWith(".html")) {
      return <Code2 size={15} className="text-orange-400" />;
    }

    if (name.endsWith(".css")) {
      return <FileCode2 size={15} className="text-blue-400" />;
    }

    if (
      name.endsWith(".js") ||
      name.endsWith(".jsx") ||
      name.endsWith(".ts") ||
      name.endsWith(".tsx")
    ) {
      return <FileCode2 size={15} className="text-yellow-400" />;
    }

    if (name.endsWith(".json")) {
      return <FileJson size={15} className="text-amber-400" />;
    }

    return <FileText size={15} className="text-zinc-500" />;
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fileContent);
      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Unable to copy file:", error);
    }
  };

  const handleEditorChange = (value: string | undefined) => {
    if (!file) return;

    setDrafts((previous) => ({
      ...previous,
      [file.name]: value ?? "",
    }));
  };

  const handleRefreshPreview = () => {
    setRefreshKey((previous) => previous + 1);
  };

  return (
    <motion.aside
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className={`fixed inset-y-0 right-0 z-40 flex h-[100dvh] flex-col overflow-hidden border-l border-white/[0.08] bg-[#15161b] shadow-2xl transition-[width] duration-200 md:relative md:inset-auto md:z-auto md:h-full md:shadow-none ${
        collapsed
          ? "w-12"
          : "w-full md:w-[420px] md:shrink-0"
      }`}
    >
      {collapsed ? (
        <div className="flex h-full flex-col items-center gap-5 py-4">
          <button
            type="button"
            onClick={() => setCollapsed(false)}
            title="Expand workspace"
            aria-label="Expand workspace"
            className="rounded-lg p-2 text-zinc-400 transition hover:bg-white/10 hover:text-white"
          >
            <PanelRightOpen size={19} />
          </button>

          <Code2 size={19} className="text-indigo-400" />

          <div
            className="max-h-[55%] overflow-hidden text-[10px] font-medium uppercase tracking-widest text-zinc-500"
            style={{
              writingMode: "vertical-rl",
              transform: "rotate(180deg)",
            }}
          >
            {artifact.title}
          </div>
        </div>
      ) : (
        <>
          {/* Workspace header */}
          <header className="flex h-[60px] shrink-0 items-center justify-between border-b border-white/[0.07] px-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
                <Code2 size={17} />
              </div>

              <div className="min-w-0">
                <h2 className="truncate text-sm font-medium text-zinc-200">
                  {artifact.title || "Untitled project"}
                </h2>

                <p className="text-[10px] text-zinc-500">
                  {files.length} {files.length === 1 ? "file" : "files"}
                </p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-1">
              <button
                type="button"
                onClick={handleCopy}
                disabled={!file}
                title="Copy current file"
                aria-label="Copy current file"
                className="rounded-lg p-2 text-zinc-500 transition hover:bg-white/[0.07] hover:text-white disabled:opacity-40"
              >
                {copied ? (
                  <Check size={17} className="text-green-400" />
                ) : (
                  <Copy size={16} />
                )}
              </button>

              <button
                type="button"
                onClick={() => setCollapsed(true)}
                title="Collapse workspace"
                aria-label="Collapse workspace"
                className="hidden rounded-lg p-2 text-zinc-500 transition hover:bg-white/[0.07] hover:text-white md:block"
              >
                <PanelRightClose size={17} />
              </button>

              <button
                type="button"
                onClick={() => setCollapsed(true)}
                title="Close workspace"
                aria-label="Close workspace"
                className="rounded-lg p-2 text-zinc-500 transition hover:bg-white/[0.07] hover:text-white md:hidden"
              >
                <X size={17} />
              </button>
            </div>
          </header>

          {/* Code / Preview tabs */}
          <div className="flex h-12 shrink-0 items-center justify-between border-b border-white/[0.07] px-3">
            <div className="flex h-full items-center gap-1">
              <button
                type="button"
                onClick={() => setTab("code")}
                className={`relative flex h-full items-center gap-2 px-3 text-xs font-medium transition ${
                  tab === "code"
                    ? "text-indigo-300"
                    : "text-zinc-500 hover:text-zinc-200"
                }`}
              >
                <Code2 size={15} />
                Code

                {tab === "code" && (
                  <span className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full bg-indigo-400" />
                )}
              </button>

              {canPreview && (
                <button
                  type="button"
                  onClick={() => setTab("preview")}
                  className={`relative flex h-full items-center gap-2 px-3 text-xs font-medium transition ${
                    tab === "preview"
                      ? "text-indigo-300"
                      : "text-zinc-500 hover:text-zinc-200"
                  }`}
                >
                  <Eye size={15} />
                  Preview

                  {tab === "preview" && (
                    <span className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full bg-indigo-400" />
                  )}
                </button>
              )}
            </div>

            {tab === "preview" && (
              <button
                type="button"
                onClick={handleRefreshPreview}
                title="Refresh preview"
                aria-label="Refresh preview"
                className="rounded-lg p-2 text-zinc-500 transition hover:bg-white/[0.07] hover:text-white"
              >
                <RefreshCw size={14} />
              </button>
            )}
          </div>

          {/* CODE WORKSPACE */}
          {tab === "code" ? (
            <div className="flex min-h-0 flex-1 flex-col">
              {/* File tabs */}
              {files.length > 0 && (
                <div className="flex h-11 shrink-0 items-center overflow-x-auto border-b border-white/[0.07] bg-[#111216]">
                  {files.map((f, index) => (
                    <button
                      key={`${f.name}-${index}`}
                      type="button"
                      onClick={() => {
                        setActiveFile(index);
                        setCopied(false);
                      }}
                      className={`relative flex h-full shrink-0 items-center gap-2 border-r border-white/[0.06] px-3 text-xs transition ${
                        safeActiveFile === index
                          ? "bg-[#1c1d23] text-zinc-200"
                          : "text-zinc-500 hover:bg-white/[0.03] hover:text-zinc-300"
                      }`}
                    >
                      {getFileIcon(f.name)}

                      <span>{f.name}</span>

                      {safeActiveFile === index && (
                        <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-indigo-400" />
                      )}
                    </button>
                  ))}
                </div>
              )}

              {/* Editor */}
              <div className="min-h-0 flex-1 bg-[#101114]">
                {file ? (
                  <Editor
                    key={file.name}
                    height="100%"
                    theme="vs-dark"
                    language={detectLanguage(file.name)}
                    value={fileContent}
                    onChange={handleEditorChange}
                    options={{
                      automaticLayout: true,
                      minimap: {
                        enabled: false,
                      },
                      fontSize: 13,
                      lineHeight: 22,
                      fontFamily: "Consolas, monospace",
                      wordWrap: "on",
                      scrollBeyondLastLine: false,
                      padding: {
                        top: 16,
                        bottom: 16,
                      },
                      tabSize: 2,
                      renderLineHighlight: "line",
                      roundedSelection: true,
                      scrollbar: {
                        verticalScrollbarSize: 7,
                        horizontalScrollbarSize: 7,
                      },
                    }}
                  />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
                    <FileCode2
                      size={30}
                      className="text-zinc-600"
                    />

                    <p className="text-sm text-zinc-400">
                      No files available
                    </p>

                    <p className="text-xs text-zinc-600">
                      Generated files will appear here.
                    </p>
                  </div>
                )}
              </div>

              {/* Editor footer */}
              <div className="flex h-8 shrink-0 items-center justify-between border-t border-white/[0.07] bg-[#15161b] px-3">
                <span className="truncate text-[10px] text-zinc-600">
                  {file?.name || "No file selected"}
                </span>

                <span className="shrink-0 text-[10px] text-zinc-600">
                  {file ? detectLanguage(file.name) : "Ready"}
                </span>
              </div>
            </div>
          ) : (
            /* LIVE PREVIEW */
            <div className="flex min-h-0 flex-1 flex-col bg-[#202127]">
              <div className="flex h-10 shrink-0 items-center gap-2 border-b border-white/[0.07] bg-[#17181e] px-3">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-red-400/80" />
                  <span className="h-2 w-2 rounded-full bg-yellow-400/80" />
                  <span className="h-2 w-2 rounded-full bg-green-400/80" />
                </div>

                <div className="ml-2 flex min-w-0 flex-1 items-center rounded-md bg-[#22232a] px-3 py-1.5">
                  <span className="truncate text-[10px] text-zinc-500">
                    Preview / {htmlFile?.name}
                  </span>
                </div>
              </div>

              <div className="min-h-0 flex-1 overflow-hidden bg-white">
                <iframe
                  key={refreshKey}
                  title="Generated project preview"
                  srcDoc={previewDoc}
                  sandbox="allow-scripts"
                  className="h-full w-full border-0 bg-white"
                />
              </div>

              <div className="flex h-8 shrink-0 items-center justify-between border-t border-white/[0.07] bg-[#15161b] px-3">
                <span className="text-[10px] text-zinc-500">
                  Live preview
                </span>

                <span className="text-[10px] text-green-500">
                  Ready
                </span>
              </div>
            </div>
          )}

          {/* No HTML preview information */}
          {!canPreview && files.length > 0 && (
            <div className="shrink-0 border-t border-white/[0.06] px-3 py-2">
              <p className="text-[10px] text-zinc-600">
                Preview is available when the project includes index.html.
              </p>
            </div>
          )}
        </>
      )}
    </motion.aside>
  );
}

export default Artifact;
