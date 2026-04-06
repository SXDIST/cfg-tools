"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { setDesktopStoredLocale } from "@/lib/desktop";
import {
  applyCatalogLocale,
  type Locale,
  formatMessage,
  LOCALE_STORAGE_KEY,
  readStoredLocale,
} from "@/lib/i18n";

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (
    key: string,
    params?: Record<string, string | number | boolean | undefined>,
  ) => string;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);
const LOCALE_CHANGE_EVENT = "cfg-tools-locale-change";

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => readStoredLocale());

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key && event.key !== LOCALE_STORAGE_KEY) return;
      setLocaleState(readStoredLocale());
    };

    const handleLocaleChange = () => {
      setLocaleState(readStoredLocale());
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener(LOCALE_CHANGE_EVENT, handleLocaleChange);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(LOCALE_CHANGE_EVENT, handleLocaleChange);
    };
  }, []);

  const setLocale = useCallback((nextLocale: Locale) => {
    setLocaleState((currentLocale) => {
      if (nextLocale === currentLocale) {
        return currentLocale;
      }

      window.localStorage.setItem(LOCALE_STORAGE_KEY, nextLocale);
      window.dispatchEvent(new Event(LOCALE_CHANGE_EVENT));
      void setDesktopStoredLocale(nextLocale);
      return nextLocale;
    });
  }, []);

  useEffect(() => {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    void setDesktopStoredLocale(locale);
    document.documentElement.lang = locale;
    applyCatalogLocale(locale);
  }, [locale]);

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      setLocale,
      t: (key, params) => formatMessage(locale, key, params),
    }),
    [locale, setLocale],
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useLocale must be used inside LocaleProvider");
  }
  return context;
}
