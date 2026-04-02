"use client";

import { CssBaseline, ThemeProvider } from "@mui/material";
import { ThemeRegistry } from "@/components/providers/theme-registry";
import { appTheme } from "@/lib/theme/theme";

type AppProvidersProps = {
  children: React.ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeRegistry>
      <ThemeProvider theme={appTheme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeRegistry>
  );
}
