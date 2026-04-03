"use client";

import { Stack, Typography } from "@mui/material";
import { useUserDashboardTheme } from "@/components/layout/user-dashboard-theme";
import { useI18n } from "@/components/providers/i18n-provider";

export function DashboardPreferencesSummary() {
  const { mode } = useUserDashboardTheme();
  const { locale, t } = useI18n();

  return (
    <Stack spacing={0.75}>
      <Typography variant="body2">
        {t("dashboard.currentMode", {
          mode:
            mode === "light"
              ? t("dashboard.lightMode")
              : t("dashboard.darkMode"),
        })}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {t("dashboard.language.current", {
          language: t(`common.localeOption.${locale}`),
        })}
      </Typography>
    </Stack>
  );
}
