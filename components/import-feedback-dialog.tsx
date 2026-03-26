"use client";

import { AlertCircle, CheckCircle2 } from "lucide-react";

import { useLocale } from "./locale-provider";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

interface ImportFeedbackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  tone?: "success" | "error";
}

export function ImportFeedbackDialog({
  open,
  onOpenChange,
  title,
  description,
  tone = "error",
}: ImportFeedbackDialogProps) {
  const isError = tone === "error";
  const Icon = isError ? AlertCircle : CheckCircle2;
  const { t } = useLocale();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <div
              className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                isError
                  ? "bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-300"
                  : "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-300"
              }`}
            >
              <Icon className="h-4 w-4" />
            </div>
            <div className="space-y-1">
              <DialogTitle>{title}</DialogTitle>
              <DialogDescription>{description}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <DialogFooter>
          <Button type="button" onClick={() => onOpenChange(false)}>
            {t("understood")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
