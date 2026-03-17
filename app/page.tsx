"use client";

import { useEffect, useState } from "react";
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
        <DialogContent className="sm:max-w-xl">
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
                <div className="max-h-56 overflow-auto rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4">
                  <pre className="whitespace-pre-wrap text-sm text-zinc-700 dark:text-zinc-300 font-mono">
                    {updateInfo.notes}
                  </pre>
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
