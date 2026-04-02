"use client";

import Link from "next/link";
import {
  Box,
  BottomNavigation,
  BottomNavigationAction,
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";
import { usePathname } from "next/navigation";
import { LogoutButton } from "@/components/common/logout-button";

type WorkspaceNavItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
};

type WorkspaceShellProps = {
  title: string;
  description: string;
  viewer: {
    phone: string;
    role: string;
  };
  navigation: WorkspaceNavItem[];
  children: React.ReactNode;
  mobileNavigation?: boolean;
  mobileNavigationVariant?: "tabs" | "bottom";
  logoutRedirectTo?: string;
};

export function WorkspaceShell({
  title,
  description,
  viewer,
  navigation,
  children,
  mobileNavigation = false,
  mobileNavigationVariant = "tabs",
  logoutRedirectTo = "/",
}: WorkspaceShellProps) {
  const pathname = usePathname();
  const showBottomNavigation = mobileNavigation && mobileNavigationVariant === "bottom";
  const activeNavigation =
    navigation.find((item) => pathname === item.href || pathname.startsWith(`${item.href}/`))
      ?.href ?? navigation[0]?.href;

  return (
    <Box
      className={`safe-shell${showBottomNavigation ? " safe-bottom-nav" : ""}`}
      sx={{
        px: { xs: 1.5, sm: 2, md: 4 },
        py: { xs: 1.5, sm: 2.5, md: 5 },
        minHeight: "100dvh",
      }}
    >
      <Stack spacing={3}>
        <Card className="motion-enter-soft surface-glass">
          <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
            <Stack
              direction={{ xs: "column", md: "row" }}
              justifyContent="space-between"
              spacing={{ xs: 2, md: 3 }}
            >
              <Stack spacing={0.6} sx={{ maxWidth: { md: 620 } }}>
                <Typography variant="h4" sx={{ fontSize: { xs: "1.45rem", sm: "2rem" } }}>
                  {title}
                </Typography>
                <Typography color="text.secondary" sx={{ maxWidth: { xs: "100%", md: 560 } }}>
                  {description}
                </Typography>
              </Stack>
              <Stack
                direction={{ xs: "column", sm: "row", md: "column" }}
                spacing={{ xs: 1, sm: 1.75, md: 0.5 }}
                alignItems={{ xs: "stretch", sm: "center", md: "flex-end" }}
              >
                <Stack spacing={0.25}>
                  <Typography variant="subtitle1">{viewer.phone}</Typography>
                  <Typography color="text.secondary">{viewer.role}</Typography>
                </Stack>
                <LogoutButton
                  variant="outlined"
                  redirectTo={logoutRedirectTo}
                  sx={{ width: { xs: "100%", sm: "auto" } }}
                />
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        {mobileNavigation && mobileNavigationVariant === "tabs" ? (
          <Box sx={{ display: { xs: "block", lg: "none" } }} className="touch-scroll-x">
            <Stack
              direction="row"
              spacing={1}
              sx={{ minWidth: "max-content", pb: 0.5, px: 0.25 }}
              className="motion-enter-soft motion-delay-1"
            >
              {navigation.map((item) => {
                const active =
                  pathname === item.href || pathname.startsWith(`${item.href}/`);

                return (
                  <Button
                    key={item.href}
                    component={Link}
                    href={item.href}
                    color={active ? "primary" : "inherit"}
                    variant={active ? "contained" : "outlined"}
                    startIcon={item.icon}
                    sx={{
                      whiteSpace: "nowrap",
                      flexShrink: 0,
                      minHeight: 42,
                    }}
                  >
                    {item.label}
                  </Button>
                );
              })}
            </Stack>
          </Box>
        ) : null}

        <Stack direction={{ xs: "column", lg: "row" }} spacing={3} alignItems="flex-start">
          <Card
            sx={{
              display: { xs: mobileNavigation ? "none" : "block", lg: "block" },
              width: { xs: "100%", lg: 280 },
              position: { xl: "sticky" },
              top: { xl: "calc(env(safe-area-inset-top) + 24px)" },
            }}
            className="motion-enter-soft motion-delay-1"
          >
            <CardContent sx={{ p: 2 }}>
              <Stack spacing={1}>
                {navigation.map((item) => {
                  const active =
                    pathname === item.href || pathname.startsWith(`${item.href}/`);

                  return (
                    <Button
                      key={item.href}
                      component={Link}
                      href={item.href}
                      color={active ? "primary" : "inherit"}
                      variant={active ? "contained" : "text"}
                      startIcon={item.icon}
                      sx={{ justifyContent: "flex-start", width: "100%" }}
                    >
                      {item.label}
                    </Button>
                  );
                })}
              </Stack>
            </CardContent>
          </Card>

          <Box sx={{ flex: 1, width: "100%", minWidth: 0, maxWidth: "100%" }}>
            {children}
          </Box>
        </Stack>
      </Stack>

      {showBottomNavigation ? (
        <Box sx={{ display: { xs: "block", lg: "none" } }} className="mobile-bottom-nav surface-glass">
          <BottomNavigation showLabels value={activeNavigation ?? false}>
            {navigation.map((item) => (
              <BottomNavigationAction
                key={item.href}
                component={Link}
                href={item.href}
                value={item.href}
                label={item.label}
                icon={item.icon}
              />
            ))}
          </BottomNavigation>
        </Box>
      ) : null}
    </Box>
  );
}
