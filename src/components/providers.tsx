"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

type Theme = "dark" | "light";
type Locale = "en" | "ar";

type Messages = Record<string, unknown>;

interface AppContextType {
  theme: Theme;
  setTheme: (t: Theme) => void;
  locale: Locale;
  setLocale: (l: Locale) => void;
  messages: Messages;
}

const AppContext = createContext<AppContextType>({
  theme: "dark",
  setTheme: () => {},
  locale: "en",
  setLocale: () => {},
  messages: {},
});

export function useApp() {
  return useContext(AppContext);
}

export function t(key: string, messages: Messages): string {
  const keys = key.split(".");
  let result: unknown = messages;
  for (const k of keys) {
    if (result && typeof result === "object" && k in (result as Record<string, unknown>)) {
      result = (result as Record<string, unknown>)[k];
    } else {
      return key;
    }
  }
  return typeof result === "string" ? result : key;
}

export function Providers({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark");
  const [locale, setLocaleState] = useState<Locale>("en");
  const [messages, setMessages] = useState<Messages>({});

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored === "light" || stored === "dark") setThemeState(stored);
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("locale");
    if (stored === "en" || stored === "ar") setLocaleState(stored);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("theme-light", theme === "light");
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

  useEffect(() => {
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = locale;
    loadMessages(locale);
  }, [locale]);

  async function loadMessages(locale: Locale) {
    try {
      const mod = await import(`../../messages/${locale}.json`);
      setMessages(mod.default);
    } catch {
      // fallback
    }
  }

  function setTheme(t: Theme) {
    setThemeState(t);
    localStorage.setItem("theme", t);
  }

  function setLocale(l: Locale) {
    setLocaleState(l);
    localStorage.setItem("locale", l);
  }

  return (
    <AppContext.Provider value={{ theme, setTheme, locale, setLocale, messages }}>
      {children}
    </AppContext.Provider>
  );
}
