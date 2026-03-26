"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import { Check, Copy, Download, FileCode } from "lucide-react";
import Editor from "@monaco-editor/react";
import { saveAs } from "file-saver";

import { buildConfigCppBlob, getSafeConfigFileStem } from "@/lib/config-export";
import { generateCpp } from "@/lib/generator";
import { useAppStore } from "@/lib/store";
import { useLocale } from "./locale-provider";
import { Button } from "./ui/button";

export function PreviewPanel() {
  const configs = useAppStore((s) => s.configs);
  const activeConfigId = useAppStore((s) => s.activeConfigId);
  const activeConfig = configs.find((c) => c.id === activeConfigId);
  const { t } = useLocale();

  const [copied, setCopied] = useState(false);
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
      <div className="flex h-full flex-col items-center justify-center gap-3 bg-[#1e1e1e]">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-800">
          <FileCode className="h-5 w-5 text-zinc-500" />
        </div>
        <p className="font-jetbrains-mono text-sm text-zinc-500">
          {t("no_config_selected")}
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
    saveAs(
      buildConfigCppBlob(activeConfig),
      `${getSafeConfigFileStem(activeConfig.name)}_config.cpp`,
    );
  };

  return (
    <div className="flex h-full flex-col bg-[#1e1e1e]">
      <div className="flex shrink-0 items-center justify-between border-b border-zinc-800 bg-[#181818] px-4 py-2.5">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
            <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
            <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
          </div>
          <span className="ml-1 select-none font-jetbrains-mono text-xs font-medium text-zinc-400">
            config.cpp
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="h-7 gap-1.5 border border-transparent px-2.5 text-xs text-zinc-400 transition-all hover:border-zinc-700 hover:bg-zinc-800 hover:text-zinc-200"
          >
            {copied ? (
              <>
                <Check className="h-3 w-3 text-emerald-400" />
                <span className="text-emerald-400">{t("copied")}</span>
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" />
                {t("copy")}
              </>
            )}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleDownload}
            className="h-7 gap-1.5 border border-transparent px-2.5 text-xs text-zinc-400 transition-all hover:border-zinc-700 hover:bg-zinc-800 hover:text-zinc-200"
          >
            <Download className="h-3 w-3" />
            {t("download")}
          </Button>
        </div>
      </div>

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
              value: t("monaco_readonly"),
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
