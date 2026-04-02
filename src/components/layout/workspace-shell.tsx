"use client";

import Link from "next/link";
import { Box, Button, Card, CardContent, Stack, Typography } from "@mui/material";
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
};

export function WorkspaceShell({
  title,
  description,
  viewer,
  navigation,
  children,
}: WorkspaceShellProps) {
  const pathname = usePathname();

  return (
    <Box
      className="safe-shell"
      sx={{ px: { xs: 2, md: 4 }, py: { xs: 2.5, md: 5 }, minHeight: "100dvh" }}
    >
      <Stack spacing={3}>
        <Card>
          <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
            <Stack
              direction={{ xs: "column", md: "row" }}
              justifyContent="space-between"
              spacing={3}
            >
              <Stack spacing={1}>
                <Typography variant="h4">{title}</Typography>
                <Typography color="text.secondary">{description}</Typography>
              </Stack>
              <Stack spacing={0.5} alignItems={{ xs: "flex-start", md: "flex-end" }}>
                <Typography variant="subtitle1">{viewer.phone}</Typography>
                <Typography color="text.secondary">{viewer.role}</Typography>
                <LogoutButton variant="outlined" sx={{ width: { xs: "100%", md: "auto" } }} />
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        <Stack direction={{ xs: "column", lg: "row" }} spacing={3} alignItems="flex-start">
          <Card
            sx={{
              width: { xs: "100%", lg: 280 },
              position: { xl: "sticky" },
              top: { xl: "calc(env(safe-area-inset-top) + 24px)" },
            }}
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

          <Box sx={{ flex: 1, width: "100%", minWidth: 0 }}>{children}</Box>
        </Stack>
      </Stack>
    </Box>
  );
}
