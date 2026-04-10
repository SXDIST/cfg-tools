"use client";

interface AppBridge {
  ReadTextFile?: (path: string) => Promise<string>;
  CheckForUpdates?: () => Promise<void>;
  GetStoredLocale?: () => Promise<string> | string;
  SetStoredLocale?: (locale: string) => Promise<string>;
  InstallOrOpenUpdate?: (updateInfo: unknown) => Promise<void>;
  OpenExternal?: (url: string) => Promise<void>;
}

interface RuntimeBridge {
  EventsOn?: (
    eventName: string,
    callback: (payload?: unknown) => void,
  ) => (() => void) | void;
  BrowserOpenURL?: (url: string) => Promise<void> | void;
}

interface DesktopWindow extends Window {
  runtime?: RuntimeBridge;
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
  return Boolean(desktopWindow?.go?.main?.App);
}

export function onDesktopEvent(
  eventName: string,
  callback: (payload: unknown) => void,
) {
  const desktopWindow = getDesktopWindow();
  const subscribe = desktopWindow?.runtime?.EventsOn;

  if (!subscribe) {
    return () => {};
  }

  return (
    subscribe(eventName, (payload) => {
      callback(payload);
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
  const app = desktopWindow?.go?.main?.App;

  if (app?.OpenExternal) {
    await app.OpenExternal(url);
    return;
  }

  if (desktopWindow?.runtime?.BrowserOpenURL) {
    await desktopWindow.runtime.BrowserOpenURL(url);
    return;
  }

  window.open(url, "_blank", "noopener,noreferrer");
}

export async function installOrOpenDesktopUpdate(updateInfo: unknown) {
  const desktopWindow = getDesktopWindow();
  await desktopWindow?.go?.main?.App?.InstallOrOpenUpdate?.(
    updateInfo as never,
  );
}

export async function setDesktopStoredLocale(locale: string) {
  const desktopWindow = getDesktopWindow();
  return desktopWindow?.go?.main?.App?.SetStoredLocale?.(locale);
}

export async function getDesktopStoredLocaleAsync() {
  const desktopWindow = getDesktopWindow();
  const locale = await desktopWindow?.go?.main?.App?.GetStoredLocale?.();
  return locale === "en" ? "en" : locale === "ru" ? "ru" : null;
}

export function onDesktopCppFileDrop(callback: (paths: string[]) => void) {
  const desktopWindow = getDesktopWindow();
  const subscribe = desktopWindow?.runtime?.EventsOn;

  if (!subscribe) {
    return () => {};
  }

  return (
    subscribe("wails:file-drop", (payload) => {
      const paths = extractDroppedPaths(payload);
      if (paths.length > 0) {
        callback(paths);
      }
    }) || (() => {})
  );
}

function extractDroppedPaths(payload: unknown) {
  if (Array.isArray(payload)) {
    return payload.filter((path): path is string => typeof path === "string");
  }

  if (payload && typeof payload === "object") {
    const record = payload as { paths?: unknown; files?: unknown };

    if (Array.isArray(record.paths)) {
      return record.paths.filter((path): path is string => typeof path === "string");
    }

    if (Array.isArray(record.files)) {
      return record.files.filter((path): path is string => typeof path === "string");
    }
  }

  return [];
}
