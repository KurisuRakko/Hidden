"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { PaletteMode, ThemeProvider } from "@mui/material";
import { useI18n } from "@/components/providers/i18n-provider";
import { createAppTheme } from "@/lib/theme/theme";

const STORAGE_KEY = "hidden-user-dashboard-theme";

type UserDashboardThemeContextValue = {
  mode: PaletteMode;
  toggleMode: () => void;
};

const UserDashboardThemeContext =
  createContext<UserDashboardThemeContextValue | null>(null);

function safeGetStoredMode() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return value === "light" || value === "dark" ? value : null;
  } catch {
    return null;
  }
}

function safeSetStoredMode(mode: PaletteMode) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, mode);
  } catch {
    // Ignore storage write failures in restricted browser contexts.
  }
}

export function UserDashboardThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { locale } = useI18n();
  const [mode, setMode] = useState<PaletteMode>(() => safeGetStoredMode() ?? "light");

  useEffect(() => {
    safeSetStoredMode(mode);
  }, [mode]);

  const theme = useMemo(() => createAppTheme(mode, locale), [locale, mode]);

  const value = useMemo(
    () => ({
      mode,
      toggleMode: () =>
        setMode((currentMode) => (currentMode === "light" ? "dark" : "light")),
    }),
    [mode],
  );

  return (
    <UserDashboardThemeContext.Provider value={value}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </UserDashboardThemeContext.Provider>
  );
}

export function useUserDashboardTheme() {
  const context = useContext(UserDashboardThemeContext);

  if (!context) {
    throw new Error("useUserDashboardTheme must be used within UserDashboardThemeProvider.");
  }

  return context;
}
