"use client";

import { useLocale } from "@/components/locale-provider";
import { MarkdownNotes } from "@/components/markdown-notes";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export interface UpdateInfo {
  currentVersion: string;
  latestVersion: string;
  title: string;
  notes: string;
  url: string;
  installerUrl?: string;
}

interface UpdateDialogProps {
  updateInfo: UpdateInfo | null;
  onClose: () => void;
  onUpdate: () => void;
}

export function UpdateDialog({
  updateInfo,
  onClose,
  onUpdate,
}: UpdateDialogProps) {
  const { t } = useLocale();

  return (
    <Dialog
      open={!!updateInfo}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="w-[min(calc(100vw-2rem),1000px)] max-w-[min(calc(100vw-2rem),1000px)] p-6 sm:max-w-[1000px]">
        <DialogHeader>
          <DialogTitle>{t("update_available")}</DialogTitle>
          <DialogDescription>{t("update_available_desc")}</DialogDescription>
        </DialogHeader>

        {updateInfo && (
          <div className="flex flex-col gap-4">
            <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/40">
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                {updateInfo.title}
              </p>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                {t("current_version", { value: updateInfo.currentVersion })}
              </p>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                {t("latest_version", { value: updateInfo.latestVersion })}
              </p>
            </div>

            {updateInfo.notes?.trim() && (
              <div className="max-h-[55vh] overflow-auto rounded-xl border border-zinc-200 bg-zinc-50/70 p-6 shadow-inner dark:border-zinc-800 dark:bg-zinc-950">
                <MarkdownNotes notes={updateInfo.notes} />
              </div>
            )}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {t("later")}
          </Button>
          <Button onClick={onUpdate}>{t("update")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
