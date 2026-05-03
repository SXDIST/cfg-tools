"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, Copy, Download, FileCode } from "lucide-react";
import { saveAs } from "file-saver";
import { Editor } from "@monaco-editor/react";
import type { editor } from "monaco-editor";

import { buildConfigCppBlob, getSafeConfigFileStem } from "@/lib/config-export";
import { generateCpp, buildClassLineMap } from "@/lib/generator";
import { useAppStore } from "@/lib/store";
import { useLocale } from "./locale-provider";
import { Button } from "./ui/button";

export function PreviewPanel() {
  const configs = useAppStore((s) => s.configs);
  const activeConfigId = useAppStore((s) => s.activeConfigId);
  const activeConfig = configs.find((c) => c.id === activeConfigId);
  const { t } = useLocale();

  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const lastScrolledTabId = useRef<string | null>(null);

  const activeTabId = activeConfig?.activeTabId;
  const activeTab = activeConfig?.classes.find((c) => c.id === activeTabId);
  const activeClassName = activeTab?.className?.replace(/[^a-zA-Z0-9_]/g, "") || "ExampleClass";

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

  useEffect(() => {
    if (!editorRef.current || !activeTabId || !activeConfig) return;

    if (lastScrolledTabId.current !== activeTabId) {
      let attempts = 0;
      const interval = setInterval(() => {
        attempts++;
        if (attempts > 15) {
          clearInterval(interval);
          return;
        }

        const currentModel = editorRef.current?.getModel();
        if (!currentModel) return;

        // Ensure Monaco has loaded the exact text we are currently holding
        const editorCode = currentModel.getValue();
        if (!editorCode.includes(code.substring(0, Math.min(100, code.length)))) {
           return; // Model is not synced yet
        }

        const lineMap = buildClassLineMap(editorCode, activeConfig);
        const targetLine = lineMap[activeTabId];

        if (targetLine) {
          clearInterval(interval);
          const editor = editorRef.current;
          if (editor) {
            editor.revealLineInCenter(targetLine);
            const lineContent = currentModel.getLineContent(targetLine);
            editor.setSelection({
              startLineNumber: targetLine,
              startColumn: 1,
              endLineNumber: targetLine,
              endColumn: lineContent.length + 1,
            });
            editor.focus();
          }
          lastScrolledTabId.current = activeTabId;
        }
      }, 100);

      return () => clearInterval(interval);
    }
  }, [activeTabId, activeConfig, code]);

  const handleEditorMount = (editorInstance: editor.IStandaloneCodeEditor) => {
    editorRef.current = editorInstance;
    if (activeTabId && activeConfig) {
      const model = editorInstance.getModel();
      if (model) {
        const editorCode = model.getValue();
        const lineMap = buildClassLineMap(editorCode, activeConfig);
        const targetLine = lineMap[activeTabId];
        if (targetLine) {
          editorInstance.revealLineInCenter(targetLine);
          const lineContent = model.getLineContent(targetLine);
          editorInstance.setSelection({
            startLineNumber: targetLine,
            startColumn: 1,
            endLineNumber: targetLine,
            endColumn: lineContent.length + 1,
          });
          lastScrolledTabId.current = activeTabId;
        }
      }
    }
  };

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

      <div className="min-h-0 flex-1">
        <Editor
          height="100%"
          language="cpp"
          theme="vs-dark"
          value={code}
          onMount={handleEditorMount}
          options={{
            readOnly: true,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            wordWrap: "on",
            padding: { top: 16, bottom: 16 },
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: 13,
          }}
          loading={
            <div className="flex h-full items-center justify-center font-jetbrains-mono text-sm text-zinc-500">
              {t("loading") || "Loading editor..."}
            </div>
          }
        />
      </div>
    </div>
  );
}


