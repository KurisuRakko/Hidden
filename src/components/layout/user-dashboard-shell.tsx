"use client";

import Link from "next/link";
import {
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { usePathname } from "next/navigation";
import {
  DarkModeRounded,
  LightModeRounded,
  SendRounded,
} from "@mui/icons-material";
import {
  getActiveUserDashboardItem,
  userDashboardNavigation,
} from "@/components/layout/user-dashboard-navigation";
import {
  UserDashboardThemeProvider,
  useUserDashboardTheme,
} from "@/components/layout/user-dashboard-theme";

type UserDashboardShellProps = {
  viewer: {
    phone: string;
    role: string;
  };
  children: React.ReactNode;
  pageTitle?: string;
  pageAction?: React.ReactNode;
};

export function UserDashboardShell({
  viewer,
  children,
  pageTitle = "Hidden",
  pageAction = null,
}: UserDashboardShellProps) {
  return (
    <UserDashboardThemeProvider>
      <UserDashboardShellInner
        viewer={viewer}
        pageTitle={pageTitle}
        pageAction={pageAction}
      >
        {children}
      </UserDashboardShellInner>
    </UserDashboardThemeProvider>
  );
}

function UserDashboardShellInner({
  viewer,
  children,
  pageTitle = "Hidden",
  pageAction = null,
}: UserDashboardShellProps) {
  const pathname = usePathname();
  const activeNavigation = getActiveUserDashboardItem(pathname);
  const { mode, toggleMode } = useUserDashboardTheme();

  return (
    <Box
      className="safe-shell"
      sx={{
        minHeight: "100dvh",
        px: { xs: 1.25, sm: 2, lg: 4 },
        py: { xs: 1.5, sm: 2, lg: 4.5 },
        pb: {
          xs: "calc(var(--mobile-nav-height) + 52px + env(safe-area-inset-bottom))",
          lg: 0,
        },
        colorScheme: mode,
        "--app-background": mode === "dark" ? "#0f1318" : "#f3f1ec",
        "--app-surface": mode === "dark" ? "#171d24" : "#ffffff",
        "--app-foreground": mode === "dark" ? "#eef2f7" : "#1e1f24",
        "--app-muted": mode === "dark" ? "#a9b4c2" : "#60636d",
        "--app-divider":
          mode === "dark"
            ? "rgba(238, 242, 247, 0.12)"
            : "rgba(30, 31, 36, 0.08)",
        color: "text.primary",
        backgroundColor: "background.default",
        backgroundImage:
          mode === "dark"
            ? "radial-gradient(circle at top left, rgba(138, 180, 255, 0.18), transparent 28%), radial-gradient(circle at top right, rgba(107, 201, 188, 0.12), transparent 22%), linear-gradient(180deg, #0f1318 0%, #111821 100%)"
            : "radial-gradient(circle at top left, rgba(31, 93, 168, 0.14), transparent 28%), radial-gradient(circle at top right, rgba(0, 105, 92, 0.1), transparent 22%), linear-gradient(180deg, #f8f6f2 0%, #f3f1ec 100%)",
        transition:
          "background-color var(--motion-base) var(--ease-standard), background-image var(--motion-slow) var(--ease-standard), color var(--motion-base) var(--ease-standard)",
      }}
    >
      <Stack spacing={{ xs: 2.5, lg: 3 }}>
        <Card
          className="motion-enter-soft"
          sx={(theme) => ({
            background:
              theme.palette.mode === "dark"
                ? `linear-gradient(180deg, ${alpha("#171d24", 0.98)} 0%, ${alpha(
                    "#1d2630",
                    0.92,
                  )} 100%)`
                : `linear-gradient(180deg, ${alpha("#ffffff", 0.95)} 0%, ${alpha(
                    "#f7f4ee",
                    0.9,
                  )} 100%)`,
            backdropFilter: "blur(14px)",
          })}
        >
          <CardContent sx={{ p: { xs: 2, sm: 2.5, md: 3 } }}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              spacing={2}
            >
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ minWidth: 0 }}>
                <Box
                  sx={(theme) => ({
                    width: { xs: 44, sm: 48 },
                    height: { xs: 44, sm: 48 },
                    borderRadius: "16px",
                    display: "grid",
                    placeItems: "center",
                    color: theme.palette.primary.contrastText,
                    background:
                      theme.palette.mode === "dark"
                        ? "linear-gradient(135deg, #8ab4ff 0%, #5f8fdd 100%)"
                        : "linear-gradient(135deg, #1f5da8 0%, #184885 100%)",
                    boxShadow:
                      theme.palette.mode === "dark"
                        ? "0 10px 28px rgba(0, 0, 0, 0.24)"
                        : "0 12px 26px rgba(31, 93, 168, 0.18)",
                  })}
                >
                  <SendRounded />
                </Box>
                <Stack spacing={0.2} sx={{ minWidth: 0 }}>
                  <Typography variant="overline" color="text.secondary">
                    Hidden
                  </Typography>
                  <Typography
                    variant="h4"
                    className="text-break"
                    sx={{ fontSize: { xs: "1.35rem", sm: "1.8rem" } }}
                  >
                    {pageTitle}
                  </Typography>
                </Stack>
              </Stack>

              <Stack direction="row" spacing={1} alignItems="center">
                {pageAction}
                <IconButton
                  onClick={toggleMode}
                  aria-label={mode === "light" ? "切换到夜间模式" : "切换到白天模式"}
                  sx={(theme) => ({
                    width: 44,
                    height: 44,
                    border: `1px solid ${theme.palette.divider}`,
                    backgroundColor: alpha(theme.palette.background.paper, 0.72),
                  })}
                >
                  {mode === "light" ? <DarkModeRounded /> : <LightModeRounded />}
                </IconButton>
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        <Stack direction={{ xs: "column", lg: "row" }} spacing={{ xs: 2.5, lg: 3 }}>
          <Box sx={{ display: { xs: "none", lg: "block" }, width: 280, flexShrink: 0 }}>
            <Card className="motion-enter-soft motion-delay-1">
              <CardContent sx={{ p: 2 }}>
                <Stack spacing={1}>
                  {userDashboardNavigation.map((item) => {
                    const active = activeNavigation.key === item.key;

                    return (
                      <Button
                        key={item.key}
                        component={Link}
                        href={item.href}
                        startIcon={item.icon}
                        variant={active ? "contained" : "text"}
                        color={active ? "primary" : "inherit"}
                        sx={{ justifyContent: "flex-start", width: "100%" }}
                      >
                        {item.key === "create" ? "新增提问箱" : item.label}
                      </Button>
                    );
                  })}

                  <Box
                    sx={(theme) => ({
                      mt: 1.5,
                      px: 1.5,
                      py: 1.25,
                      borderRadius: "16px",
                      backgroundColor: alpha(theme.palette.primary.main, 0.08),
                    })}
                  >
                    <Typography variant="subtitle2">{viewer.phone}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {viewer.role}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Box>

          <Box sx={{ flex: 1, minWidth: 0 }}>{children}</Box>
        </Stack>
      </Stack>

      <Box
        sx={{
          display: { xs: "block", lg: "none" },
          position: "fixed",
          right: "max(14px, env(safe-area-inset-right))",
          bottom: "max(14px, env(safe-area-inset-bottom))",
          left: "max(14px, env(safe-area-inset-left))",
          zIndex: 1200,
        }}
      >
        <Box
          sx={(theme) => ({
            position: "relative",
            borderRadius: "28px",
            border: `1px solid ${theme.palette.divider}`,
            background:
              theme.palette.mode === "dark"
                ? alpha(theme.palette.background.paper, 0.92)
                : alpha("#ffffff", 0.92),
            backdropFilter: "blur(18px)",
            WebkitBackdropFilter: "blur(18px)",
            boxShadow:
              theme.palette.mode === "dark"
                ? "0 18px 40px rgba(0, 0, 0, 0.28)"
                : "0 18px 40px rgba(15, 22, 36, 0.14)",
            px: 1.25,
            py: 1,
          })}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr auto 1fr",
              alignItems: "end",
              columnGap: 1,
            }}
          >
            {userDashboardNavigation
              .filter((item) => !item.mobileOnlyPrimaryAction)
              .map((item) => {
                const active = activeNavigation.key === item.key;

                return (
                  <Button
                    key={item.key}
                    component={Link}
                    href={item.href}
                    color={active ? "primary" : "inherit"}
                    sx={{
                      minHeight: "var(--mobile-nav-height)",
                      borderRadius: "22px",
                      flexDirection: "column",
                      gap: 0.4,
                      fontSize: "0.78rem",
                      lineHeight: 1,
                    }}
                  >
                    {item.icon}
                    {item.label}
                  </Button>
                );
              })}

            <Box sx={{ display: "flex", justifyContent: "center", mt: -4.5 }}>
              <IconButton
                component={Link}
                href="/dashboard/boxes/new"
                aria-label="新增提问箱"
                className="dashboard-fab-animate"
                sx={(theme) => ({
                  width: 72,
                  height: 72,
                  border: `6px solid ${theme.palette.background.default}`,
                  color: theme.palette.primary.contrastText,
                  background:
                    activeNavigation.key === "create"
                      ? "linear-gradient(135deg, #1f5da8 0%, #00695c 100%)"
                      : theme.palette.mode === "dark"
                        ? "linear-gradient(135deg, #8ab4ff 0%, #6bc9bc 100%)"
                        : "linear-gradient(135deg, #1f5da8 0%, #3d9488 100%)",
                  boxShadow:
                    theme.palette.mode === "dark"
                      ? "0 16px 32px rgba(0, 0, 0, 0.34)"
                      : "0 16px 30px rgba(31, 93, 168, 0.24)",
                  "&:hover": {
                    background:
                      theme.palette.mode === "dark"
                        ? "linear-gradient(135deg, #9ac0ff 0%, #7ad2c6 100%)"
                        : "linear-gradient(135deg, #2769b8 0%, #45a498 100%)",
                  },
                })}
              >
                <Typography component="span" sx={{ fontSize: "2rem", lineHeight: 1 }}>
                  +
                </Typography>
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
