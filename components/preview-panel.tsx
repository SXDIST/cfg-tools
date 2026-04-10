"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, Copy, Download, FileCode } from "lucide-react";
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

  const highlightedCode = useMemo(() => {
    return highlightConfigCpp(code);
  }, [code]);

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

      <div className="min-h-0 flex-1 overflow-auto px-4 py-4">
        <pre className="cfg-code-preview min-h-full whitespace-pre-wrap break-words font-jetbrains-mono text-[13px] leading-5">
          <code
            dangerouslySetInnerHTML={{
              __html: highlightedCode,
            }}
          />
        </pre>
      </div>
    </div>
  );
}

const tokenPattern =
  /\/\/.*|\/\*[\s\S]*?\*\/|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\b[A-Za-z_][A-Za-z0-9_]*\b|\b\d+(?:\.\d+)?\b|[{}()[\];=,:]/g;

const keywords = new Set([
  "class",
  "const",
  "enum",
  "false",
  "static",
  "struct",
  "true",
  "typedef",
]);

function highlightConfigCpp(code: string) {
  let result = "";
  let lastIndex = 0;
  let previousIdentifier = "";

  for (const match of code.matchAll(tokenPattern)) {
    const token = match[0];
    const index = match.index ?? 0;
    const nextToken = getNextToken(code, index + token.length);
    const tokenClass = getTokenClass(
      token,
      previousIdentifier,
      nextToken,
      isAssignmentKey(code, index + token.length),
    );

    result += escapeHtml(code.slice(lastIndex, index));
    result += `<span class="${tokenClass}">${escapeHtml(token)}</span>`;
    lastIndex = index + token.length;

    if (isIdentifier(token)) {
      previousIdentifier = token;
    } else if (!/^[\s:]$/.test(token)) {
      previousIdentifier = "";
    }
  }

  result += escapeHtml(code.slice(lastIndex));
  return result;
}

function getTokenClass(
  token: string,
  previousIdentifier: string,
  nextToken: string,
  isAssignmentKeyToken: boolean,
) {
  if (token.startsWith("//") || token.startsWith("/*")) {
    return "token comment";
  }

  if (token.startsWith('"') || token.startsWith("'")) {
    return "token string";
  }

  if (/^\d/.test(token)) {
    return "token number";
  }

  if (/^(true|false)$/.test(token)) {
    return "token boolean";
  }

  if (keywords.has(token)) {
    return "token keyword";
  }

  if (previousIdentifier === "class" || token.startsWith("Cfg")) {
    return "token type";
  }

  if (nextToken === "=" || isAssignmentKeyToken) {
    return "token property";
  }

  if (/^[{}()[\];=,:]$/.test(token)) {
    return "token punctuation";
  }

  return "token identifier";
}

function getNextToken(code: string, startIndex: number) {
  const rest = code.slice(startIndex);
  const match = rest.match(/^\s*([A-Za-z_][A-Za-z0-9_]*|\d+(?:\.\d+)?|[{}()[\];=,:]|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')/);
  return match?.[1] || "";
}

function isAssignmentKey(code: string, startIndex: number) {
  const rest = code.slice(startIndex).trimStart();

  if (rest.startsWith("=")) {
    return true;
  }

  const arrayAssignmentMatch = rest.match(/^\[\s*\]\s*=/);
  return Boolean(arrayAssignmentMatch);
}

function isIdentifier(token: string) {
  return /^[A-Za-z_][A-Za-z0-9_]*$/.test(token);
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
