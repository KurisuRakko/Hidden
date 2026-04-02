"use client";

import { createContext, useContext } from "react";
import {
  DEFAULT_LOCALE,
  translate,
  type Locale,
  type Messages,
} from "@/lib/i18n";

type I18nContextValue = {
  locale: Locale;
  messages: Messages;
  t: (key: string, values?: Record<string, string | number>) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

type I18nProviderProps = {
  locale: Locale;
  messages: Messages;
  children: React.ReactNode;
};

export function I18nProvider({
  locale,
  messages,
  children,
}: I18nProviderProps) {
  return (
    <I18nContext.Provider
      value={{
        locale,
        messages,
        t: (key, values) => translate(locale, key, values),
      }}
    >
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);

  if (!context) {
    return {
      locale: DEFAULT_LOCALE,
      messages: {} as Messages,
      t: (key: string, values?: Record<string, string | number>) =>
        translate(DEFAULT_LOCALE, key, values),
    };
  }

  return context;
}
