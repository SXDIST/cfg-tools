"use client";

import { useEffect, useState } from "react";
import { type UpdateInfo } from "@/components/update-dialog";
import {
  checkForDesktopUpdates,
  isDesktopRuntime,
  onDesktopCppFileDrop,
  onDesktopEvent,
  readDesktopTextFile,
} from "@/lib/desktop";
import { importFromCppText } from "@/lib/import-utils";

export function useDesktopAppEvents(
  importConfigFromCpp: (cppText: string, fileName?: string) => {
    success: boolean;
    error?: string;
  },
) {
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo | null>(null);

  useEffect(() => {
    if (!isDesktopRuntime()) {
      return;
    }

    const unsubscribeUpdate = onDesktopEvent("app:update-available", (payload) => {
      const update = payload as UpdateInfo | undefined;
      if (!update?.latestVersion) return;
      setUpdateInfo(update);
    });

    void checkForDesktopUpdates().catch(() => {
      // Ignore update check failures silently on startup.
    });

    const unsubscribeFileDrop = onDesktopCppFileDrop(async (paths) => {
      if (!paths || paths.length === 0) return;

      const cppPath = paths.find((path) => path.toLowerCase().endsWith(".cpp"));
      if (!cppPath) return;

      try {
        const cppText = await readDesktopTextFile(cppPath);
        const fileName = cppPath.split(/[/\\]/).pop() || "Imported_config.cpp";
        const result = importFromCppText(importConfigFromCpp, cppText, fileName);
        if (!result.success) {
          window.alert(result.error || "Импорт не удался");
        }
      } catch {
        window.alert("Не удалось импортировать файл через drag-and-drop");
      }
    });

    return () => {
      unsubscribeUpdate();
      unsubscribeFileDrop();
    };
  }, [importConfigFromCpp]);

  return {
    updateInfo,
    clearUpdateInfo: () => setUpdateInfo(null),
  };
}
