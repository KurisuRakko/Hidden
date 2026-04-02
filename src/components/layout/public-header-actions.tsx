"use client";

import Link from "next/link";
import {
  CloseRounded,
  DashboardRounded,
  MenuRounded,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Drawer,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { useId, useState } from "react";
import { usePathname } from "next/navigation";
import { LogoutButton } from "@/components/common/logout-button";

type PublicHeaderViewer = {
  role: string;
} | null;

type PublicHeaderActionsProps = {
  viewer: PublicHeaderViewer;
  hideGuestActions?: boolean;
};

export function PublicHeaderActions({
  viewer,
  hideGuestActions = false,
}: PublicHeaderActionsProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [drawerPathname, setDrawerPathname] = useState(pathname);
  const drawerId = useId();
  const isAdminViewer = viewer?.role === "ADMIN";
  const showGuestActions = !viewer && !hideGuestActions;
  const showUserDashboard = viewer && !isAdminViewer;
  const hasMobileActions =
    showGuestActions || Boolean(showUserDashboard) || isAdminViewer;
  const drawerOpen = open && drawerPathname === pathname;

  function closeDrawer() {
    setOpen(false);
  }

  return (
    <>
      <Stack
        direction="row"
        spacing={1.25}
        alignItems="center"
        sx={{ display: { xs: "none", md: "flex" } }}
      >
        {showUserDashboard ? (
          <>
            <Button component={Link} href="/dashboard" startIcon={<DashboardRounded />} size="small">
              Dashboard
            </Button>
            <LogoutButton size="small" />
          </>
        ) : null}
        {isAdminViewer ? (
          <>
            <Typography variant="body2" color="text.secondary">
              Admin session active
            </Typography>
            <LogoutButton size="small" />
          </>
        ) : null}
        {showGuestActions ? (
          <>
            <Button component={Link} href="/login" size="small">
              Sign in
            </Button>
            <Button component={Link} href="/register" variant="contained" size="small">
              Register
            </Button>
          </>
        ) : null}
      </Stack>

      <Box sx={{ display: { xs: hasMobileActions ? "block" : "none", md: "none" } }}>
        <IconButton
          aria-label="Open navigation menu"
          aria-controls={drawerId}
          aria-expanded={drawerOpen}
          aria-haspopup="dialog"
          onClick={() => {
            setDrawerPathname(pathname);
            setOpen(true);
          }}
          size="small"
          sx={{
            border: "1px solid rgba(32, 34, 39, 0.08)",
            bgcolor: "rgba(255, 255, 255, 0.84)",
            boxShadow: "0 6px 18px rgba(15, 22, 36, 0.08)",
          }}
        >
          <MenuRounded />
        </IconButton>
        <Drawer
          id={drawerId}
          anchor="right"
          open={drawerOpen}
          onClose={closeDrawer}
          PaperProps={{
            sx: {
              borderTopLeftRadius: 24,
              borderBottomLeftRadius: 24,
              backgroundImage: "none",
            },
          }}
        >
          <Box
            sx={{
              width: 280,
              minHeight: "100%",
              px: 2,
              py: 2.5,
              pt: "max(20px, calc(env(safe-area-inset-top) + 16px))",
              pb: "max(24px, calc(env(safe-area-inset-bottom) + 20px))",
              bgcolor: "background.paper",
            }}
          >
            <Stack spacing={2.5}>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography variant="h6">Menu</Typography>
                <IconButton aria-label="Close navigation menu" onClick={closeDrawer} size="small">
                  <CloseRounded />
                </IconButton>
              </Stack>

              {showGuestActions ? (
                <Stack spacing={1.25}>
                  <Button
                    component={Link}
                    href="/register"
                    variant="contained"
                    size="large"
                    onClick={closeDrawer}
                    sx={{ width: "100%" }}
                  >
                    Register
                  </Button>
                  <Button
                    component={Link}
                    href="/login"
                    variant="outlined"
                    size="large"
                    onClick={closeDrawer}
                    sx={{ width: "100%" }}
                  >
                    Sign in
                  </Button>
                </Stack>
              ) : null}

              {showUserDashboard ? (
                <Stack spacing={1.25}>
                  <Button
                    component={Link}
                    href="/dashboard"
                    variant="contained"
                    startIcon={<DashboardRounded />}
                    onClick={closeDrawer}
                    sx={{ width: "100%" }}
                  >
                    Dashboard
                  </Button>
                  <LogoutButton
                    variant="outlined"
                    sx={{ width: "100%" }}
                    onLoggedOut={closeDrawer}
                  />
                </Stack>
              ) : null}

              {isAdminViewer ? (
                <Stack spacing={1.25}>
                  <Typography variant="body2" color="text.secondary">
                    Admin session active on the public site.
                  </Typography>
                  <LogoutButton
                    variant="outlined"
                    sx={{ width: "100%" }}
                    onLoggedOut={closeDrawer}
                  />
                </Stack>
              ) : null}
            </Stack>
          </Box>
        </Drawer>
      </Box>
    </>
  );
}
