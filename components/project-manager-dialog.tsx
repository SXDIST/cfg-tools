"use client";

import { useMemo, useState, type KeyboardEvent } from "react";
import {
  Check,
  CopyPlus,
  FolderOpen,
  Pencil,
  Plus,
  Search,
  Trash,
  Upload,
  X,
} from "lucide-react";

import type { ConfigData } from "@/lib/store";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";

interface ProjectManagerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  configs: ConfigData[];
  activeConfigId: string | null;
  onAddProject: () => void;
  onImportProject: () => void;
  onSwitchProject: (id: string) => void;
  onDuplicateProject: (id: string) => void;
  onDeleteProject: (id: string) => void;
  onRenameProject: (id: string, name: string) => void;
}

export function ProjectManagerDialog({
  open,
  onOpenChange,
  configs,
  activeConfigId,
  onAddProject,
  onImportProject,
  onSwitchProject,
  onDuplicateProject,
  onDeleteProject,
  onRenameProject,
}: ProjectManagerDialogProps) {
  const [query, setQuery] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftName, setDraftName] = useState("");
  const [pendingDeleteConfig, setPendingDeleteConfig] =
    useState<ConfigData | null>(null);

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setQuery("");
      setEditingId(null);
      setDraftName("");
      setPendingDeleteConfig(null);
    }
    onOpenChange(nextOpen);
  };

  const filteredConfigs = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return configs;

    return configs.filter((config) => {
      const haystack = [
        config.name,
        config.requiredAddons.join(" "),
        String(config.classes.length),
        ...config.classes.map((cls) => cls.className),
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalized);
    });
  }, [configs, query]);

  const startRenaming = (config: ConfigData) => {
    setEditingId(config.id);
    setDraftName(config.name);
  };

  const commitRename = (configId: string) => {
    const nextName = draftName.trim();
    if (nextName) {
      onRenameProject(configId, nextName);
    }
    setEditingId(null);
    setDraftName("");
  };

  const cancelRename = () => {
    setEditingId(null);
    setDraftName("");
  };

  const handleRenameKeyDown = (
    event: KeyboardEvent<HTMLInputElement>,
    configId: string,
  ) => {
    if (event.key === "Enter") {
      event.preventDefault();
      commitRename(configId);
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      cancelRename();
    }
  };

  const handleDelete = (config: ConfigData) => {
    setPendingDeleteConfig(config);
  };

  const confirmDelete = () => {
    if (!pendingDeleteConfig) return;
    onDeleteProject(pendingDeleteConfig.id);
    setPendingDeleteConfig(null);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="!w-[calc(100vw-2rem)] !max-w-[calc(100vw-2rem)] sm:!w-[min(1180px,calc(100vw-2rem))] sm:!max-w-[min(1180px,calc(100vw-2rem))] p-0 overflow-hidden">
          <DialogHeader className="border-b border-zinc-200 px-6 pt-6 pb-4 dark:border-zinc-800">
            <DialogTitle>Управление проектами</DialogTitle>
            <DialogDescription>
              Быстро переключайтесь между проектами, переименовывайте их и
              удаляйте без похода по маленьким меню.
            </DialogDescription>
          </DialogHeader>

          <div className="border-b border-zinc-200 bg-zinc-50/60 px-6 py-4 dark:border-zinc-800 dark:bg-zinc-900/30">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Поиск по названию проекта, классу или addon..."
                  className="pl-9"
                />
              </div>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onImportProject()}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Импорт
                </Button>
                <Button type="button" onClick={() => onAddProject()}>
                  <Plus className="mr-2 h-4 w-4" />
                  Новый проект
                </Button>
              </div>
            </div>
          </div>

          <div className="grid min-h-0 gap-0 lg:grid-cols-[minmax(0,1fr)_280px]">
            <ScrollArea className="max-h-[72vh]">
              <div className="p-4">
                <div className="mb-3 flex items-center justify-between text-sm text-zinc-500">
                  <span>Проектов: {configs.length}</span>
                  <span>Найдено: {filteredConfigs.length}</span>
                </div>

                <div className="space-y-3">
                  {filteredConfigs.length === 0 && (
                    <div className="rounded-xl border border-dashed border-zinc-300 px-4 py-8 text-center text-sm text-zinc-500 dark:border-zinc-700">
                      По этому запросу проекты не найдены.
                    </div>
                  )}

                  {filteredConfigs.map((config) => {
                    const isActive = config.id === activeConfigId;
                    const isEditing = editingId === config.id;

                    return (
                      <div
                        key={config.id}
                        className={`rounded-2xl border px-4 py-3 transition-colors ${
                          isActive
                            ? "border-zinc-900 bg-zinc-50 dark:border-zinc-100 dark:bg-zinc-900"
                            : "border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950"
                        }`}
                      >
                        <div className="flex flex-col gap-3 xl:flex-row xl:items-start">
                          <div
                            className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                              isActive
                                ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                                : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
                            }`}
                          >
                            {isActive ? (
                              <Check className="h-4 w-4" />
                            ) : (
                              <FolderOpen className="h-4 w-4" />
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              {isEditing ? (
                                <div className="flex min-w-0 flex-1 items-center gap-2">
                                  <Input
                                    value={draftName}
                                    onChange={(e) => setDraftName(e.target.value)}
                                    onKeyDown={(event) =>
                                      handleRenameKeyDown(event, config.id)
                                    }
                                    autoFocus
                                    className="h-8"
                                  />
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="h-8 px-2"
                                    onClick={() => commitRename(config.id)}
                                  >
                                    <Check className="h-3.5 w-3.5" />
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 px-2"
                                    onClick={cancelRename}
                                  >
                                    <X className="h-3.5 w-3.5" />
                                  </Button>
                                </div>
                              ) : (
                                <>
                                  <div className="truncate text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                                    {config.name}
                                  </div>
                                  {isActive && (
                                    <span className="rounded-full bg-zinc-900 px-2 py-0.5 text-[11px] font-medium text-white dark:bg-zinc-100 dark:text-zinc-900">
                                      Активный
                                    </span>
                                  )}
                                </>
                              )}
                            </div>

                            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-500 dark:text-zinc-400">
                              <span>Классов: {config.classes.length}</span>
                              <span>Слотов: {config.slots.length}</span>
                              <span>Прокси: {config.proxies.length}</span>
                              <span>Addons: {config.requiredAddons.length}</span>
                            </div>

                            {!isEditing && config.classes.length > 0 && (
                              <div
                                className="mt-2 truncate text-xs text-zinc-400 dark:text-zinc-500"
                                title={config.classes
                                  .map((cls) => cls.className)
                                  .join(", ")}
                              >
                                {config.classes
                                  .slice(0, 3)
                                  .map((cls) => cls.className)
                                  .join(", ")}
                                {config.classes.length > 3 ? "..." : ""}
                              </div>
                            )}
                          </div>

                          {!isEditing && (
                            <div className="flex shrink-0 flex-wrap items-center gap-1 xl:justify-end">
                              {!isActive && (
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  className="h-8"
                                  onClick={() => onSwitchProject(config.id)}
                                >
                                  Открыть
                                </Button>
                              )}
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-8 px-2"
                                onClick={() => startRenaming(config)}
                                title="Переименовать проект"
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-8 px-2"
                                onClick={() => onDuplicateProject(config.id)}
                                title="Дублировать проект"
                              >
                                <CopyPlus className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-8 px-2 text-red-500 hover:text-red-600"
                                onClick={() => handleDelete(config)}
                                title="Удалить проект"
                              >
                                <Trash className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </ScrollArea>

            <div className="border-t border-zinc-200 bg-zinc-50/50 p-4 text-sm dark:border-zinc-800 dark:bg-zinc-900/20 lg:border-t-0 lg:border-l">
              <div className="font-medium text-zinc-900 dark:text-zinc-50">
                Что можно делать
              </div>
              <div className="mt-3 space-y-2 text-zinc-500 dark:text-zinc-400">
                <div>Переключаться между проектами из одного списка.</div>
                <div>Переименовывать проект прямо на месте.</div>
                <div>Дублировать и удалять без вложенных меню.</div>
                <div>Быстро найти проект по имени, классу или addon.</div>
                <div>Создать новый проект или импортировать `config.cpp` сверху.</div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={pendingDeleteConfig !== null}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) {
            setPendingDeleteConfig(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Удалить проект?</DialogTitle>
            <DialogDescription>
              {pendingDeleteConfig
                ? `Проект "${pendingDeleteConfig.name}" будет удалён без возможности восстановления через корзину.`
                : "Подтвердите удаление проекта."}
            </DialogDescription>
          </DialogHeader>

          <div className="rounded-xl border border-red-200 bg-red-50/70 px-4 py-3 text-sm text-red-700 dark:border-red-950 dark:bg-red-950/30 dark:text-red-300">
            Это действие нельзя отменить.
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setPendingDeleteConfig(null)}
            >
              Отмена
            </Button>
            <Button type="button" variant="destructive" onClick={confirmDelete}>
              Удалить проект
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
