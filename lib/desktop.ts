"use client";

type RuntimeEventPayload = {
  name?: string;
  payload?: unknown;
};

interface AppBridge {
  ReadTextFile?: (path: string) => Promise<string>;
  CheckForUpdates?: () => Promise<void>;
}

interface ElectronBridge {
  getStoredLocale?: () => string;
  setStoredLocale?: (locale: string) => Promise<string>;
  installOrOpenUpdate?: (updateInfo: unknown) => Promise<void>;
  openExternal?: (url: string) => Promise<void>;
  onRuntimeEvent?: (
    listener: (payload: RuntimeEventPayload) => void,
  ) => (() => void) | void;
}

interface DesktopWindow extends Window {
  runtime?: unknown;
  electronAPI?: ElectronBridge;
  go?: {
    main?: {
      App?: AppBridge;
    };
  };
}

function getDesktopWindow() {
  if (typeof window === "undefined") {
    return null;
  }

  return window as DesktopWindow;
}

export function isDesktopRuntime() {
  const desktopWindow = getDesktopWindow();
  return Boolean(desktopWindow?.electronAPI && desktopWindow?.go?.main?.App);
}

export function onDesktopEvent(
  eventName: string,
  callback: (payload: unknown) => void,
) {
  const desktopWindow = getDesktopWindow();
  const subscribe = desktopWindow?.electronAPI?.onRuntimeEvent;

  if (!subscribe) {
    return () => {};
  }

  return (
    subscribe((eventPayload) => {
      if (eventPayload?.name !== eventName) {
        return;
      }

      callback(eventPayload.payload);
    }) || (() => {})
  );
}

export async function checkForDesktopUpdates() {
  const desktopWindow = getDesktopWindow();
  await desktopWindow?.go?.main?.App?.CheckForUpdates?.();
}

export async function readDesktopTextFile(path: string) {
  const desktopWindow = getDesktopWindow();
  const reader = desktopWindow?.go?.main?.App?.ReadTextFile;

  if (!reader) {
    throw new Error("Desktop file reader is unavailable.");
  }

  return reader(path);
}

export async function openExternalUrl(url: string) {
  const desktopWindow = getDesktopWindow();
  await desktopWindow?.electronAPI?.openExternal?.(url);
}

export async function installOrOpenDesktopUpdate(updateInfo: unknown) {
  const desktopWindow = getDesktopWindow();
  await desktopWindow?.electronAPI?.installOrOpenUpdate?.(updateInfo);
}

export function getDesktopStoredLocale() {
  const desktopWindow = getDesktopWindow();
  const locale = desktopWindow?.electronAPI?.getStoredLocale?.();
  return locale === "en" ? "en" : locale === "ru" ? "ru" : null;
}

export async function setDesktopStoredLocale(locale: string) {
  const desktopWindow = getDesktopWindow();
  return desktopWindow?.electronAPI?.setStoredLocale?.(locale);
}

export function onDesktopCppFileDrop(callback: (paths: string[]) => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handleDragOver = (event: DragEvent) => {
    event.preventDefault();
  };

  const handleDrop = (event: DragEvent) => {
    event.preventDefault();

    const paths = Array.from(event.dataTransfer?.files || [])
      .map((file) => (file as File & { path?: string }).path)
      .filter((path): path is string => Boolean(path));

    if (paths.length > 0) {
      callback(paths);
    }
  };

  window.addEventListener("dragover", handleDragOver);
  window.addEventListener("drop", handleDrop);

  return () => {
    window.removeEventListener("dragover", handleDragOver);
    window.removeEventListener("drop", handleDrop);
  };
}
