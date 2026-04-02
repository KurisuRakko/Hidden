"use client";

import { CssBaseline, ThemeProvider } from "@mui/material";
import { I18nProvider } from "@/components/providers/i18n-provider";
import { ThemeRegistry } from "@/components/providers/theme-registry";
import { type Locale, type Messages } from "@/lib/i18n";
import { createAppTheme } from "@/lib/theme/theme";

type AppProvidersProps = {
  locale: Locale;
  messages: Messages;
  children: React.ReactNode;
};

export function AppProviders({
  locale,
  messages,
  children,
}: AppProvidersProps) {
  const theme = createAppTheme("light", locale);

  return (
    <ThemeRegistry>
      <I18nProvider locale={locale} messages={messages}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </I18nProvider>
    </ThemeRegistry>
  );
}
