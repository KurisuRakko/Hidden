"use client";

import Link from "next/link";
import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Button,
  Card,
  CardContent,
  Fab,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { usePathname } from "next/navigation";
import {
  AddRounded,
  DarkModeRounded,
  LightModeRounded,
  SendRounded,
} from "@mui/icons-material";
import { HeaderLeadingBackAction } from "@/components/layout/header-leading-back-action";
import {
  getActiveUserDashboardItem,
  userDashboardNavigation,
} from "@/components/layout/user-dashboard-navigation";
import {
  UserDashboardThemeProvider,
  useUserDashboardTheme,
} from "@/components/layout/user-dashboard-theme";
import { useI18n } from "@/components/providers/i18n-provider";
import { getRoleLabel } from "@/lib/i18n";

type UserDashboardShellProps = {
  viewer: {
    phone: string;
    role: string;
  };
  children: React.ReactNode;
  pageTitle?: string;
  pageAction?: React.ReactNode;
  backHref?: string;
};

export function UserDashboardShell({
  viewer,
  children,
  pageTitle = "Hidden",
  pageAction = null,
  backHref,
}: UserDashboardShellProps) {
  return (
    <UserDashboardThemeProvider>
      <UserDashboardShellInner
        viewer={viewer}
        pageTitle={pageTitle}
        pageAction={pageAction}
        backHref={backHref}
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
  backHref,
}: UserDashboardShellProps) {
  const pathname = usePathname();
  const activeNavigation = getActiveUserDashboardItem(pathname);
  const mobileNavigation = userDashboardNavigation.filter(
    (item) => !item.mobileOnlyPrimaryAction,
  );
  const [leftMobileItem, rightMobileItem] = mobileNavigation;
  const mobileNavigationValue = activeNavigation.mobileOnlyPrimaryAction
    ? null
    : activeNavigation.key;
  const { mode, toggleMode } = useUserDashboardTheme();
  const { locale, t } = useI18n();

  return (
    <Box
      className="safe-shell"
      sx={{
        minHeight: "100dvh",
        px: { xs: 1.5, sm: 2.5, lg: 4 },
        py: { xs: 1.5, sm: 2, lg: 4 },
        pb: {
          xs: "calc(var(--mobile-nav-height) + 76px + env(safe-area-inset-bottom))",
          lg: 0,
        },
        colorScheme: mode,
        color: "text.primary",
        backgroundColor: "background.default",
        transition:
          "background-color var(--motion-base) var(--ease-standard), color var(--motion-base) var(--ease-standard)",
      }}
    >
      <Stack spacing={{ xs: 2.5, lg: 3 }}>
        <Card className="motion-enter-soft">
          <CardContent sx={{ p: { xs: 2, sm: 2.5, md: 3 } }}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              spacing={2}
            >
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ minWidth: 0 }}>
                {backHref ? (
                  <HeaderLeadingBackAction
                    back={{ mode: "href", href: backHref }}
                    variant="dashboard"
                  />
                ) : (
                  <Box
                    sx={(theme) => ({
                      width: { xs: 40, sm: 44 },
                      height: { xs: 40, sm: 44 },
                      borderRadius: 1.5,
                      display: "grid",
                      placeItems: "center",
                      color: theme.palette.primary.contrastText,
                      bgcolor: "primary.main",
                      boxShadow: theme.shadows[3],
                    })}
                  >
                    <SendRounded fontSize="small" />
                  </Box>
                )}
                <Stack spacing={0.25} sx={{ minWidth: 0 }}>
                  <Typography variant="overline" color="text.secondary">
                    Hidden
                  </Typography>
                  <Typography
                    variant="h4"
                    className="text-break"
                    sx={{ fontSize: { xs: "1.35rem", sm: "1.75rem" } }}
                  >
                    {pageTitle}
                  </Typography>
                </Stack>
              </Stack>

              <Stack direction="row" spacing={1} alignItems="center">
                {pageAction}
                <IconButton
                  onClick={toggleMode}
                  aria-label={
                    mode === "light"
                      ? t("dashboard.switchToDark")
                      : t("dashboard.switchToLight")
                  }
                  sx={(theme) => ({
                    width: 40,
                    height: 40,
                    border: `1px solid ${theme.palette.divider}`,
                    bgcolor: theme.palette.background.paper,
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
                        {item.key === "create"
                          ? t("common.nav.createBox")
                          : t(item.labelKey)}
                      </Button>
                    );
                  })}

                  <Box
                    sx={(theme) => ({
                      mt: 1.5,
                      px: 1.5,
                      py: 1.25,
                      borderRadius: 1,
                      bgcolor: alpha(theme.palette.action.active, 0.04),
                      border: `1px solid ${theme.palette.divider}`,
                    })}
                  >
                    <Typography variant="subtitle2">{viewer.phone}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {getRoleLabel(viewer.role, locale)}
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
          right: "max(12px, env(safe-area-inset-right))",
          bottom: "max(12px, env(safe-area-inset-bottom))",
          left: "max(12px, env(safe-area-inset-left))",
          zIndex: 1200,
        }}
      >
        <Paper
          elevation={8}
          sx={{
            position: "relative",
            overflow: "visible",
            borderRadius: 2,
            bgcolor: "background.paper",
            pt: 1,
            pb: "calc(env(safe-area-inset-bottom) + 8px)",
          }}
        >
          <Fab
            component={Link}
            href="/dashboard/boxes/new"
            aria-label={t("common.nav.createBox")}
            color={activeNavigation.key === "create" ? "secondary" : "primary"}
            className="dashboard-fab-animate"
            sx={{
              position: "absolute",
              top: 0,
              left: "50%",
              transform: "translate(-50%, -38%)",
            }}
          >
            <AddRounded />
          </Fab>

          <BottomNavigation
            showLabels
            value={mobileNavigationValue}
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 72px 1fr",
              alignItems: "end",
            }}
          >
            {leftMobileItem ? (
              <BottomNavigationAction
                value={leftMobileItem.key}
                component={Link}
                href={leftMobileItem.href}
                icon={leftMobileItem.icon}
                label={t(leftMobileItem.labelKey)}
                sx={{ minWidth: 0 }}
              />
            ) : (
              <Box />
            )}
            <Box aria-hidden="true" />
            {rightMobileItem ? (
              <BottomNavigationAction
                value={rightMobileItem.key}
                component={Link}
                href={rightMobileItem.href}
                icon={rightMobileItem.icon}
                label={t(rightMobileItem.labelKey)}
                sx={{ minWidth: 0 }}
              />
            ) : (
              <Box />
            )}
          </BottomNavigation>
        </Paper>
      </Box>
    </Box>
  );
}
