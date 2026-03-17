"use client";

import { Fragment, type ReactNode, useEffect, useState } from "react";
import { Header } from "@/components/header";
import { EditorPanel } from "@/components/editor-panel";
import { PreviewPanel } from "@/components/preview-panel";
import { importFromCppText } from "@/lib/import-utils";
import { useAppStore } from "@/lib/store";
import { CheckForUpdates } from "@/frontend/wailsjs/go/main/App";
import {
  BrowserOpenURL,
  EventsOn,
  OnFileDrop,
  OnFileDropOff,
} from "@/frontend/wailsjs/runtime/runtime";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface AppBridge {
  ReadTextFile?: (path: string) => Promise<string>;
  CheckForUpdates?: () => Promise<void>;
}

interface UpdateInfo {
  currentVersion: string;
  latestVersion: string;
  title: string;
  notes: string;
  url: string;
}

interface WailsWindow extends Window {
  runtime?: unknown;
  go?: {
    main?: {
      App?: AppBridge;
    };
  };
}

function renderInlineMarkdown(text: string): ReactNode[] {
  const parts = text.split(/(`[^`]+`)/g).filter(Boolean);

  return parts.map((part, index) => {
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={`${part}-${index}`}
          className="rounded-md border border-zinc-200 bg-zinc-100 px-1.5 py-0.5 font-mono text-[0.92em] text-zinc-800 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
        >
          {part.slice(1, -1)}
        </code>
      );
    }

    const boldParts = part.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
    return (
      <Fragment key={`${part}-${index}`}>
        {boldParts.map((boldPart, boldIndex) => {
          if (boldPart.startsWith("**") && boldPart.endsWith("**")) {
            return (
              <strong key={`${boldPart}-${boldIndex}`} className="font-semibold">
                {boldPart.slice(2, -2)}
              </strong>
            );
          }
          return <Fragment key={`${boldPart}-${boldIndex}`}>{boldPart}</Fragment>;
        })}
      </Fragment>
    );
  });
}

function renderMarkdown(notes: string) {
  const lines = notes.replace(/\r\n?/g, "\n").split("\n");
  const blocks: ReactNode[] = [];
  let index = 0;

  while (index < lines.length) {
    const rawLine = lines[index];
    const line = rawLine.trimEnd();
    const trimmed = line.trim();

    if (!trimmed) {
      index += 1;
      continue;
    }

    const headingMatch = /^(#{1,6})\s+(.+)$/.exec(trimmed);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const title = headingMatch[2];
      const headingClass =
        level === 1
          ? "text-2xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50"
          : level === 2
            ? "border-b border-zinc-200 pb-2 text-xl font-semibold tracking-tight text-zinc-950 dark:border-zinc-800 dark:text-zinc-100"
            : "text-lg font-semibold text-zinc-900 dark:text-zinc-100";

      blocks.push(
        <div key={`heading-${index}`} className={headingClass}>
          {renderInlineMarkdown(title)}
        </div>,
      );
      index += 1;
      continue;
    }

    if (/^---+$/.test(trimmed)) {
      blocks.push(
        <hr
          key={`hr-${index}`}
          className="border-0 border-t border-zinc-200 dark:border-zinc-800"
        />,
      );
      index += 1;
      continue;
    }

    if (/^\s*[-*]\s+/.test(rawLine)) {
      const items: ReactNode[] = [];

      while (index < lines.length && /^\s*[-*]\s+/.test(lines[index])) {
        const current = lines[index];
        const indent = current.match(/^\s*/)?.[0].length ?? 0;
        const itemText = current.replace(/^\s*[-*]\s+/, "");
        items.push(
          <li
            key={`li-${index}`}
            className="leading-7 marker:text-zinc-500"
            style={{ marginLeft: `${Math.max(0, indent / 2) * 1.25}rem` }}
          >
            {renderInlineMarkdown(itemText)}
          </li>,
        );
        index += 1;
      }

      blocks.push(
        <ul
          key={`ul-${index}`}
          className="list-disc space-y-1.5 pl-6 text-[15px] text-zinc-700 dark:text-zinc-300"
        >
          {items}
        </ul>,
      );
      continue;
    }

    if (/^\s*\d+\.\s+/.test(rawLine)) {
      const items: ReactNode[] = [];

      while (index < lines.length && /^\s*\d+\.\s+/.test(lines[index])) {
        const current = lines[index];
        const indent = current.match(/^\s*/)?.[0].length ?? 0;
        const itemText = current.replace(/^\s*\d+\.\s+/, "");
        items.push(
          <li
            key={`ol-li-${index}`}
            className="leading-7 marker:font-medium marker:text-zinc-500"
            style={{ marginLeft: `${Math.max(0, indent / 2) * 1.25}rem` }}
          >
            {renderInlineMarkdown(itemText)}
          </li>,
        );
        index += 1;
      }

      blocks.push(
        <ol
          key={`ol-${index}`}
          className="list-decimal space-y-1.5 pl-6 text-[15px] text-zinc-700 dark:text-zinc-300"
        >
          {items}
        </ol>,
      );
      continue;
    }

    const paragraphLines: string[] = [];
    while (
      index < lines.length &&
      lines[index].trim() &&
      !/^(#{1,6})\s+/.test(lines[index].trim()) &&
      !/^\s*[-*]\s+/.test(lines[index]) &&
      !/^\s*\d+\.\s+/.test(lines[index]) &&
      !/^---+$/.test(lines[index].trim())
    ) {
      paragraphLines.push(lines[index].trim());
      index += 1;
    }

    blocks.push(
      <p
        key={`p-${index}`}
        className="text-[15px] leading-7 text-zinc-700 dark:text-zinc-300"
      >
        {renderInlineMarkdown(paragraphLines.join(" "))}
      </p>,
    );
  }

  return blocks;
}

export default function Home() {
  const importConfigFromCpp = useAppStore((s) => s.importConfigFromCpp);
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const wailsWindow = window as WailsWindow;
    if (!wailsWindow.runtime) {
      return;
    }

    const unsubscribeUpdate = EventsOn("app:update-available", (payload) => {
      const update = payload as UpdateInfo | undefined;
      if (!update?.latestVersion) return;
      setUpdateInfo(update);
    });

    void CheckForUpdates().catch(() => {
      // Ignore update check failures silently on startup.
    });

    OnFileDrop(async (_x, _y, paths) => {
      if (!paths || paths.length === 0) return;

      const cppPath = paths.find((path) => path.toLowerCase().endsWith(".cpp"));
      if (!cppPath) return;

      try {
        const appBridge = wailsWindow.go?.main?.App;
        if (!appBridge?.ReadTextFile) {
          window.alert("Drag-and-drop import недоступен: отсутствует bridge ReadTextFile");
          return;
        }

        const cppText = await appBridge.ReadTextFile(cppPath);
        const fileName = cppPath.split(/[/\\]/).pop() || "Imported_config.cpp";
        const result = importFromCppText(importConfigFromCpp, cppText, fileName);
        if (!result.success) {
          window.alert(result.error || "Импорт не удался");
        }
      } catch {
        window.alert("Не удалось импортировать файл через drag-and-drop");
      }
    }, false);

    return () => {
      unsubscribeUpdate();
      OnFileDropOff();
    };
  }, [importConfigFromCpp]);

  const handleUpdate = () => {
    if (!updateInfo?.url) return;
    BrowserOpenURL(updateInfo.url);
    setUpdateInfo(null);
  };

  return (
    <>
      <main className="flex flex-col h-screen w-screen overflow-hidden bg-zinc-50 dark:bg-zinc-950 font-inter antialiased text-zinc-900 dark:text-zinc-50">
        <Header />
        <ResizablePanelGroup className="flex-1 overflow-hidden">
          <ResizablePanel defaultSize={52} minSize={30}>
            <EditorPanel />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={48} minSize={25}>
            <PreviewPanel />
          </ResizablePanel>
        </ResizablePanelGroup>
      </main>

      <Dialog
        open={!!updateInfo}
        onOpenChange={(open) => {
          if (!open) setUpdateInfo(null);
        }}
      >
        <DialogContent className="w-[min(calc(100vw-2rem),1000px)] max-w-[min(calc(100vw-2rem),1000px)] p-6 sm:max-w-[1000px]">
          <DialogHeader>
            <DialogTitle>Доступно обновление</DialogTitle>
            <DialogDescription>
              Вышла новая версия cfg-tools. Хотите перейти к обновлению?
            </DialogDescription>
          </DialogHeader>

          {updateInfo && (
            <div className="flex flex-col gap-4">
              <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 p-4">
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  {updateInfo.title}
                </p>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  Текущая версия: {updateInfo.currentVersion}
                </p>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Доступная версия: {updateInfo.latestVersion}
                </p>
              </div>

              {updateInfo.notes?.trim() && (
                <div className="max-h-[55vh] overflow-auto rounded-xl border border-zinc-200 bg-zinc-50/70 p-6 shadow-inner dark:border-zinc-800 dark:bg-zinc-950">
                  <div className="flex flex-col gap-5">
                    {renderMarkdown(updateInfo.notes)}
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setUpdateInfo(null)}>
              Позже
            </Button>
            <Button onClick={handleUpdate}>Обновить</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
