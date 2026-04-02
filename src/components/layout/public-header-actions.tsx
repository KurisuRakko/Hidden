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
import { useState } from "react";
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
  const [open, setOpen] = useState(false);
  const isAdminViewer = viewer?.role === "ADMIN";
  const showGuestActions = !viewer && !hideGuestActions;
  const showUserDashboard = viewer && !isAdminViewer;
  const hasMobileActions =
    showGuestActions || Boolean(showUserDashboard) || isAdminViewer;

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
          onClick={() => setOpen(true)}
          size="small"
          sx={{
            border: "1px solid rgba(32, 34, 39, 0.08)",
            bgcolor: "rgba(255, 255, 255, 0.8)",
          }}
        >
          <MenuRounded />
        </IconButton>
        <Drawer anchor="right" open={open} onClose={closeDrawer}>
          <Box
            sx={{
              width: 280,
              minHeight: "100%",
              px: 2,
              py: 2.5,
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
                  <LogoutButton variant="outlined" sx={{ width: "100%" }} />
                </Stack>
              ) : null}

              {isAdminViewer ? (
                <Stack spacing={1.25}>
                  <Typography variant="body2" color="text.secondary">
                    Admin session active on the public site.
                  </Typography>
                  <LogoutButton variant="outlined" sx={{ width: "100%" }} />
                </Stack>
              ) : null}
            </Stack>
          </Box>
        </Drawer>
      </Box>
    </>
  );
}
