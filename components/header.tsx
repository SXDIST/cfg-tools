"use client";

import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import {
  ChevronDown,
  Copy,
  Download,
  FileCode2,
  FolderOpen,
  Redo2,
  Undo2,
} from "lucide-react";
import { saveAs } from "file-saver";

import {
  buildConfigCppBlob,
  buildConfigsZip,
  getSafeConfigFileStem,
} from "@/lib/config-export";
import { importFromCppText } from "@/lib/import-utils";
import { useAppStore } from "@/lib/store";
import { ImportFeedbackDialog } from "./import-feedback-dialog";
import { ProjectManagerDialog } from "./project-manager-dialog";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface ImportFeedbackState {
  title: string;
  description: string;
  tone: "success" | "error";
}

function getImportFeedbackState(
  result: { success: boolean; error?: string },
): ImportFeedbackState {
  if (result.success) {
    return {
      title: "Импорт завершён",
      description: "config.cpp успешно добавлен в список проектов.",
      tone: "success",
    };
  }

  return {
    title: "Не удалось импортировать config.cpp",
    description:
      result.error || "Во время импорта произошла неизвестная ошибка.",
    tone: "error",
  };
}

export function Header() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [projectManagerOpen, setProjectManagerOpen] = useState(false);
  const [importFeedback, setImportFeedback] =
    useState<ImportFeedbackState | null>(null);

  const configs = useAppStore((s) => s.configs);
  const activeConfigId = useAppStore((s) => s.activeConfigId);
  const activeConfig = configs.find((config) => config.id === activeConfigId);

  const addConfig = useAppStore((s) => s.addConfig);
  const duplicateConfig = useAppStore((s) => s.duplicateConfig);
  const deleteConfig = useAppStore((s) => s.deleteConfig);
  const renameConfig = useAppStore((s) => s.renameConfig);
  const setActiveConfig = useAppStore((s) => s.setActiveConfig);
  const importConfigFromCpp = useAppStore((s) => s.importConfigFromCpp);
  const canUndo = useAppStore((s) => s.canUndo);
  const canRedo = useAppStore((s) => s.canRedo);
  const undo = useAppStore((s) => s.undo);
  const redo = useAppStore((s) => s.redo);

  const activeConfigStats = useMemo(() => {
    if (!activeConfig) return null;

    return {
      classes: activeConfig.classes.length,
      addons: activeConfig.requiredAddons.length,
    };
  }, [activeConfig]);

  const handleExportCurrent = async () => {
    if (!activeConfig) return;

    saveAs(
      buildConfigCppBlob(activeConfig),
      `${getSafeConfigFileStem(activeConfig.name)}_config.cpp`,
    );
  };

  const handleExportAll = async () => {
    if (configs.length === 0) return;

    const blob = await buildConfigsZip(configs);
    saveAs(blob, "configs.zip");
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImportFileChange = async (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const result = importFromCppText(importConfigFromCpp, text, file.name);
      setImportFeedback(getImportFeedbackState(result));
    } catch {
      setImportFeedback({
        title: "Не удалось прочитать файл",
        description:
          "Проверьте, что выбран корректный .cpp файл и попробуйте ещё раз.",
        tone: "error",
      });
    } finally {
      event.target.value = "";
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const hasPrimaryModifier = event.ctrlKey || event.metaKey;
      if (!hasPrimaryModifier || event.altKey) return;

      const key = event.key.toLowerCase();

      if (key === "z" && event.shiftKey) {
        if (!canRedo) return;
        event.preventDefault();
        redo();
        return;
      }

      if (key === "y") {
        if (!canRedo) return;
        event.preventDefault();
        redo();
        return;
      }

      if (key === "z") {
        if (!canUndo) return;
        event.preventDefault();
        undo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [canRedo, canUndo, redo, undo]);

  return (
    <header className="z-20 flex h-14 shrink-0 items-center justify-between border-b border-zinc-200 bg-white px-5 dark:border-zinc-800 dark:bg-zinc-950">
      <ImportFeedbackDialog
        open={importFeedback !== null}
        onOpenChange={(open) => {
          if (!open) {
            setImportFeedback(null);
          }
        }}
        title={importFeedback?.title || ""}
        description={importFeedback?.description || ""}
        tone={importFeedback?.tone || "error"}
      />

      <ProjectManagerDialog
        open={projectManagerOpen}
        onOpenChange={setProjectManagerOpen}
        configs={configs}
        activeConfigId={activeConfigId}
        onAddProject={addConfig}
        onImportProject={handleImportClick}
        onSwitchProject={setActiveConfig}
        onDuplicateProject={duplicateConfig}
        onDeleteProject={deleteConfig}
        onRenameProject={renameConfig}
      />

      <input
        ref={fileInputRef}
        type="file"
        accept=".cpp,text/plain"
        className="hidden"
        onChange={handleImportFileChange}
      />

      <div className="flex items-center gap-3">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-zinc-900 dark:bg-white">
          <FileCode2 className="h-4 w-4 text-white dark:text-zinc-900" />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[15px] font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            cfg-tools
          </span>
          <span className="select-none text-zinc-300 dark:text-zinc-700">
            /
          </span>
          <span className="text-sm text-zinc-400 dark:text-zinc-500">
            DayZ Config Generator
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="h-8 w-8 p-0 text-zinc-700 dark:text-zinc-300"
          onClick={undo}
          disabled={!canUndo}
          title="Undo (Ctrl/Cmd+Z)"
        >
          <Undo2 className="h-3.5 w-3.5" />
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="h-8 w-8 p-0 text-zinc-700 dark:text-zinc-300"
          onClick={redo}
          disabled={!canRedo}
          title="Redo (Ctrl/Cmd+Shift+Z / Ctrl/Cmd+Y)"
        >
          <Redo2 className="h-3.5 w-3.5" />
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="h-8 max-w-[360px] gap-1.5 text-zinc-700 dark:text-zinc-300"
          onClick={() => setProjectManagerOpen(true)}
          title={
            activeConfigStats
              ? `${activeConfigStats.classes} классов, ${activeConfigStats.addons} addons`
              : "Открыть менеджер проектов"
          }
        >
          <FolderOpen className="h-3.5 w-3.5 shrink-0" />
          <span className="min-w-0 truncate">
            {activeConfig?.name || "Проекты"}
          </span>
          {activeConfigStats && (
            <span className="hidden rounded-full bg-zinc-100 px-1.5 py-0.5 text-[10px] font-medium text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400 md:inline-flex">
              {activeConfigStats.classes} / {activeConfigStats.addons}
            </span>
          )}
          <ChevronDown className="h-3 w-3 shrink-0 opacity-50" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1.5 text-zinc-700 dark:text-zinc-300"
            >
              <Download className="h-3.5 w-3.5" />
              Экспорт
              <ChevronDown className="h-3 w-3 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuItem
              onClick={handleExportCurrent}
              disabled={!activeConfig}
            >
              <Copy className="mr-2 h-4 w-4" />
              Текущий конфиг (.cpp)
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleExportAll}
              disabled={configs.length === 0}
            >
              <Download className="mr-2 h-4 w-4" />
              Все конфиги (.zip)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
