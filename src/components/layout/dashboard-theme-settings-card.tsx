"use client";

import {
  Button,
  Stack,
  Typography,
} from "@mui/material";
import {
  DarkModeRounded,
  LightModeRounded,
} from "@mui/icons-material";
import { useUserDashboardTheme } from "@/components/layout/user-dashboard-theme";
import { useI18n } from "@/components/providers/i18n-provider";

export function DashboardThemeSettingsCard() {
  const { mode, toggleMode } = useUserDashboardTheme();
  const { t } = useI18n();

  return (
    <Stack spacing={2}>
      <Stack spacing={0.75}>
        <Typography variant="body1">
          {t("dashboard.currentMode", {
            mode:
              mode === "light"
                ? t("dashboard.lightMode")
                : t("dashboard.darkMode"),
          })}
        </Typography>
        <Typography color="text.secondary" sx={{ fontSize: "0.95rem" }}>
          {t("dashboard.themeScope")}
        </Typography>
      </Stack>
      <Button
        type="button"
        variant="contained"
        onClick={toggleMode}
        startIcon={mode === "light" ? <DarkModeRounded /> : <LightModeRounded />}
        sx={{ width: { xs: "100%", sm: "auto" } }}
      >
        {mode === "light"
          ? t("dashboard.switchToDark")
          : t("dashboard.switchToLight")}
      </Button>
    </Stack>
  );
}
