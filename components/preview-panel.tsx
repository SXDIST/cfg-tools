"use client";

import { useAppStore } from "@/lib/store";
import Editor from "@monaco-editor/react";
import { generateCpp } from "@/lib/generator";
import { Button } from "./ui/button";
import { Copy, Download, Check, FileCode } from "lucide-react";
import { saveAs } from "file-saver";
import { useMemo, useState, useEffect, useRef } from "react";

export function PreviewPanel() {
  const configs = useAppStore((s) => s.configs);
  const activeConfigId = useAppStore((s) => s.activeConfigId);
  const activeConfig = configs.find((c) => c.id === activeConfigId);

  const [copied, setCopied] = useState(false);

  // Debounce config changes so Monaco doesn't re-render on every keystroke
  const [debouncedConfig, setDebouncedConfig] = useState(activeConfig);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setDebouncedConfig(activeConfig);
    }, 300);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [activeConfig]);

  const code = useMemo(() => {
    if (!debouncedConfig) return "";
    return generateCpp(debouncedConfig);
  }, [debouncedConfig]);

  if (!activeConfig) {
    return (
      <div className="flex flex-col h-full items-center justify-center gap-3 bg-[#1e1e1e]">
        <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center">
          <FileCode className="w-5 h-5 text-zinc-500" />
        </div>
        <p className="text-sm text-zinc-500 font-jetbrains-mono">
          No configuration selected
        </p>
      </div>
    );
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: "text/plain;charset=utf-8" });
    saveAs(
      blob,
      `${activeConfig.name.replace(/[^a-zA-Z0-9]/g, "_")}_config.cpp`,
    );
  };

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e]">
      {/* ── Header bar ── */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-zinc-800 bg-[#181818] shrink-0">
        <div className="flex items-center gap-2.5">
          {/* Fake traffic lights (decorative) */}
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
            <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
            <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
          </div>
          <span className="text-xs font-medium text-zinc-400 font-jetbrains-mono select-none ml-1">
            config.cpp
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="h-7 px-2.5 text-xs gap-1.5 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 border border-transparent hover:border-zinc-700 transition-all"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                Copy
              </>
            )}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleDownload}
            className="h-7 px-2.5 text-xs gap-1.5 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 border border-transparent hover:border-zinc-700 transition-all"
          >
            <Download className="w-3 h-3" />
            Download
          </Button>
        </div>
      </div>

      {/* ── Code editor ── */}
      <div className="flex-1 overflow-hidden pt-2">
        <Editor
          height="100%"
          defaultLanguage="cpp"
          theme="vs-dark"
          value={code}
          options={{
            readOnly: true,
            domReadOnly: true,
            readOnlyMessage: {
              value: "Конфиг генерируется автоматически.",
            },
            minimap: { enabled: false },
            fontSize: 13,
            lineHeight: 20,
            fontFamily:
              "var(--font-jetbrains-mono), 'JetBrains Mono', 'Fira Code', Consolas, monospace",
            fontLigatures: true,
            wordWrap: "on",
            scrollBeyondLastLine: false,
            smoothScrolling: true,
            tabSize: 2,
            insertSpaces: true,
            padding: { top: 12, bottom: 12 },
            renderLineHighlight: "none",
            overviewRulerLanes: 0,
            hideCursorInOverviewRuler: true,
            overviewRulerBorder: false,
            scrollbar: {
              verticalScrollbarSize: 6,
              horizontalScrollbarSize: 6,
            },
          }}
        />
      </div>
    </div>
  );
}
