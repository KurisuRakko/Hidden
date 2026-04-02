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

export function DashboardThemeSettingsCard() {
  const { mode, toggleMode } = useUserDashboardTheme();

  return (
    <Stack spacing={2}>
      <Stack spacing={0.75}>
        <Typography variant="body1">
          当前模式：{mode === "light" ? "白天" : "夜间"}
        </Typography>
        <Typography color="text.secondary">
          这里只影响用户中心，不会改动公开页和管理端。
        </Typography>
      </Stack>
      <Button
        type="button"
        variant="contained"
        onClick={toggleMode}
        startIcon={mode === "light" ? <DarkModeRounded /> : <LightModeRounded />}
        sx={{ width: { xs: "100%", sm: "auto" } }}
      >
        {mode === "light" ? "切换到夜间模式" : "切换到白天模式"}
      </Button>
    </Stack>
  );
}
