"use client";

import { useEffect } from "react";
import { Header } from "@/components/header";
import { EditorPanel } from "@/components/editor-panel";
import { PreviewPanel } from "@/components/preview-panel";
import { importFromCppText } from "@/lib/import-utils";
import { useAppStore } from "@/lib/store";
import { OnFileDrop, OnFileDropOff } from "@/frontend/wailsjs/runtime/runtime";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

interface AppBridge {
  ReadTextFile?: (path: string) => Promise<string>;
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

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const wailsWindow = window as WailsWindow;
    if (!wailsWindow.runtime) {
      return;
    }

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
      OnFileDropOff();
    };
  }, [importConfigFromCpp]);

  return (
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
  );
}
