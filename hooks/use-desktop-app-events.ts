"use client";

import { useEffect, useState } from "react";
import { CheckForUpdates } from "@/frontend/wailsjs/go/main/App";
import { EventsOn, OnFileDrop, OnFileDropOff } from "@/frontend/wailsjs/runtime/runtime";
import { type UpdateInfo } from "@/components/update-dialog";
import { importFromCppText } from "@/lib/import-utils";

interface AppBridge {
  ReadTextFile?: (path: string) => Promise<string>;
  CheckForUpdates?: () => Promise<void>;
}

interface WailsWindow extends Window {
  runtime?: unknown;
  go?: {
    main?: {
      App?: AppBridge;
    };
  };
}

export function useDesktopAppEvents(
  importConfigFromCpp: (cppText: string, fileName?: string) => {
    success: boolean;
    error?: string;
  },
) {
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

  return {
    updateInfo,
    clearUpdateInfo: () => setUpdateInfo(null),
  };
}
