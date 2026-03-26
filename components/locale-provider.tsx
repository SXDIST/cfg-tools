"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";

import {
  applyCatalogLocale,
  type Locale,
  formatMessage,
  LOCALE_STORAGE_KEY,
  readStoredLocale,
  translateUiText,
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

function subscribeToLocaleStore(onStoreChange: () => void) {
  const handleStorage = (event: StorageEvent) => {
    if (event.key && event.key !== LOCALE_STORAGE_KEY) return;
    onStoreChange();
  };

  const handleLocaleChange = () => {
    onStoreChange();
  };

  window.addEventListener("storage", handleStorage);
  window.addEventListener(LOCALE_CHANGE_EVENT, handleLocaleChange);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(LOCALE_CHANGE_EVENT, handleLocaleChange);
  };
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const locale = useSyncExternalStore<Locale>(
    subscribeToLocaleStore,
    readStoredLocale,
    () => "ru",
  );

  const setLocale = (nextLocale: Locale) => {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, nextLocale);
    window.dispatchEvent(new Event(LOCALE_CHANGE_EVENT));
  };

  useEffect(() => {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    document.documentElement.lang = locale;
    applyCatalogLocale(locale);
  }, [locale]);

  useEffect(() => {
    if (locale === "ru") return;

    const translateNode = (node: Node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent?.trim();
        if (!text) return;
        const translated = translateUiText(locale, text);
        if (translated !== text && node.textContent) {
          node.textContent = node.textContent.replace(text, translated);
        }
        return;
      }

      if (!(node instanceof HTMLElement)) return;

      ["placeholder", "title", "aria-label"].forEach((attribute) => {
        const current = node.getAttribute(attribute);
        if (!current) return;
        const translated = translateUiText(locale, current);
        if (translated !== current) {
          node.setAttribute(attribute, translated);
        }
      });

      node.childNodes.forEach(translateNode);
    };

    const runTranslation = () => {
      translateNode(document.body);
    };

    runTranslation();

    const observer = new MutationObserver(() => {
      runTranslation();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ["placeholder", "title", "aria-label"],
    });

    return () => observer.disconnect();
  }, [locale]);

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      setLocale,
      t: (key, params) => formatMessage(locale, key, params),
    }),
    [locale],
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
