"use client";

import { CopyPlus, Download, FolderOpen, Plus, Trash } from "lucide-react";
import { saveAs } from "file-saver";

import { buildConfigsZip } from "@/lib/config-export";
import { useAppStore } from "@/lib/store";
import { useLocale } from "./locale-provider";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

export function Sidebar() {
  const configs = useAppStore((s) => s.configs);
  const activeConfigId = useAppStore((s) => s.activeConfigId);
  const addConfig = useAppStore((s) => s.addConfig);
  const deleteConfig = useAppStore((s) => s.deleteConfig);
  const duplicateConfig = useAppStore((s) => s.duplicateConfig);
  const setActiveConfig = useAppStore((s) => s.setActiveConfig);
  const { t } = useLocale();

  const handleExportAll = async () => {
    if (configs.length === 0) return;
    const blob = await buildConfigsZip(configs);
    saveAs(blob, "configs.zip");
  };

  return (
    <TooltipProvider>
      <div className="flex h-full w-16 shrink-0 flex-col border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex items-center justify-center border-b p-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={() => addConfig()}>
                <Plus className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">{t("new_project")}</TooltipContent>
          </Tooltip>
        </div>

        <ScrollArea className="flex-1">
          <div className="flex flex-col gap-1 p-2">
            {configs.map((config) => (
              <Tooltip key={config.id}>
                <TooltipTrigger asChild>
                  <div
                    className={`flex cursor-pointer items-center justify-center rounded-md p-2 transition-colors ${
                      activeConfigId === config.id
                        ? "bg-zinc-100 dark:bg-zinc-800/70"
                        : "hover:bg-zinc-50 dark:hover:bg-zinc-800/30"
                    }`}
                    onClick={() => setActiveConfig(config.id)}
                  >
                    <FolderOpen
                      className={`h-5 w-5 ${
                        activeConfigId === config.id
                          ? "text-zinc-900 dark:text-zinc-100"
                          : "text-zinc-500"
                      }`}
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right" className="max-w-[200px]">
                  <div className="flex flex-col gap-1">
                    <span className="font-medium">{config.name}</span>
                    <div className="mt-1 flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={(e) => {
                          e.stopPropagation();
                          duplicateConfig(config.id);
                        }}
                      >
                        <CopyPlus className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteConfig(config.id);
                        }}
                      >
                        <Trash className="h-3 w-3 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            ))}

            {configs.length === 0 && (
              <div className="mt-4 text-center">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <FolderOpen className="mx-auto h-5 w-5 text-zinc-300" />
                  </TooltipTrigger>
                  <TooltipContent side="right">{t("no_projects")}</TooltipContent>
                </Tooltip>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="flex items-center justify-center border-t p-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={handleExportAll}>
                <Download className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">{t("export_all_zip")}</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
}
