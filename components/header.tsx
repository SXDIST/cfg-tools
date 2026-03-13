"use client";

import { useAppStore } from "@/lib/store";
import { Button } from "./ui/button";
import { useRef, type ChangeEvent } from "react";
import {
  Download,
  Copy,
  Plus,
  Trash,
  CopyPlus,
  FolderOpen,
  FileCode2,
  ChevronDown,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "./ui/dropdown-menu";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { generateCpp } from "@/lib/generator";
import { importFromCppText } from "@/lib/import-utils";

export function Header() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const configs = useAppStore((s) => s.configs);
  const activeConfigId = useAppStore((s) => s.activeConfigId);
  const activeConfig = configs.find((c) => c.id === activeConfigId);

  const addConfig = useAppStore((s) => s.addConfig);
  const duplicateConfig = useAppStore((s) => s.duplicateConfig);
  const deleteConfig = useAppStore((s) => s.deleteConfig);
  const setActiveConfig = useAppStore((s) => s.setActiveConfig);
  const importConfigFromCpp = useAppStore((s) => s.importConfigFromCpp);

  const handleExportCurrent = async () => {
    if (!activeConfig) return;
    const cppStr = generateCpp(activeConfig);
    const blob = new Blob([cppStr], { type: "text/plain;charset=utf-8" });
    saveAs(
      blob,
      `${activeConfig.name.replace(/[^a-zA-Z0-9]/g, "_")}_config.cpp`,
    );
  };

  const handleExportAll = async () => {
    if (configs.length === 0) return;
    const zip = new JSZip();
    configs.forEach((config) => {
      const cppStr = generateCpp(config);
      const safeName = config.name.replace(/[^a-zA-Z0-9]/g, "_") || "config";
      zip.file(`${safeName}_config.cpp`, cppStr);
    });
    const blob = await zip.generateAsync({ type: "blob" });
    saveAs(blob, "configs.zip");
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImportFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const result = importFromCppText(importConfigFromCpp, text, file.name);
      if (!result.success) {
        window.alert(result.error || "Импорт не удался");
      }
    } catch {
      window.alert("Не удалось прочитать файл");
    } finally {
      event.target.value = "";
    }
  };

  return (
    <header className="h-14 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex items-center justify-between px-5 shrink-0 z-20">
      <input
        ref={fileInputRef}
        type="file"
        accept=".cpp,text/plain"
        className="hidden"
        onChange={handleImportFileChange}
      />

      {/* ── Logo ── */}
      <div className="flex items-center gap-3">
        <div className="w-7 h-7 rounded-md bg-zinc-900 dark:bg-white flex items-center justify-center shrink-0">
          <FileCode2 className="w-4 h-4 text-white dark:text-zinc-900" />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[15px] font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            cfg-tools
          </span>
          <span className="text-zinc-300 dark:text-zinc-700 select-none">
            /
          </span>
          <span className="text-sm text-zinc-400 dark:text-zinc-500">
            DayZ Config Generator
          </span>
        </div>
      </div>

      {/* ── Action buttons ── */}
      <div className="flex items-center gap-2">
        {/* Project dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1.5 text-zinc-700 dark:text-zinc-300"
            >
              <FolderOpen className="w-3.5 h-3.5" />
              Проект
              <ChevronDown className="w-3 h-3 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="text-xs font-normal text-zinc-500">
              Управление проектом
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={() => addConfig()}>
              <Plus className="w-4 h-4 mr-2" />
              Новый проект
            </DropdownMenuItem>

            <DropdownMenuItem onClick={handleImportClick}>
              <FolderOpen className="w-4 h-4 mr-2" />
              Импортировать config.cpp
            </DropdownMenuItem>

            {activeConfig && (
              <DropdownMenuItem
                onClick={() => duplicateConfig(activeConfig.id)}
              >
                <CopyPlus className="w-4 h-4 mr-2" />
                Дублировать проект
              </DropdownMenuItem>
            )}

            {activeConfig && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => deleteConfig(activeConfig.id)}
                  className="text-red-500 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/30"
                >
                  <Trash className="w-4 h-4 mr-2" />
                  Удалить проект
                </DropdownMenuItem>
              </>
            )}

            {configs.length > 1 && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="text-xs font-normal text-zinc-500">
                  Открытые проекты
                </DropdownMenuLabel>
                {configs.map((config) => (
                  <DropdownMenuItem
                    key={config.id}
                    onClick={() => setActiveConfig(config.id)}
                    className={
                      activeConfigId === config.id
                        ? "bg-zinc-100 dark:bg-zinc-800 font-medium"
                        : ""
                    }
                  >
                    <FolderOpen className="w-4 h-4 mr-2 opacity-50" />
                    <span className="truncate">{config.name}</span>
                  </DropdownMenuItem>
                ))}
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Export dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1.5 text-zinc-700 dark:text-zinc-300"
            >
              <Download className="w-3.5 h-3.5" />
              Экспорт
              <ChevronDown className="w-3 h-3 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuItem
              onClick={handleExportCurrent}
              disabled={!activeConfig}
            >
              <Copy className="w-4 h-4 mr-2" />
              Текущий конфиг (.cpp)
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleExportAll}
              disabled={configs.length === 0}
            >
              <Download className="w-4 h-4 mr-2" />
              Все конфиги (.zip)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
