"use client";

import { ExitToAppRounded } from "@mui/icons-material";
import { Button } from "@mui/material";
import { SxProps, Theme } from "@mui/material/styles";
import { useRouter } from "next/navigation";
import { useState } from "react";

type LogoutButtonProps = {
  variant?: "text" | "outlined" | "contained";
  size?: "small" | "medium" | "large";
  sx?: SxProps<Theme>;
  redirectTo?: string;
};

export function LogoutButton({
  variant = "text",
  size = "medium",
  sx,
  redirectTo = "/",
}: LogoutButtonProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  async function handleLogout() {
    setSubmitting(true);

    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (/^https?:\/\//.test(redirectTo)) {
        window.location.assign(redirectTo);
        return;
      }

      router.push(redirectTo);
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Button
      onClick={handleLogout}
      variant={variant}
      color="inherit"
      size={size}
      startIcon={<ExitToAppRounded />}
      disabled={submitting}
      sx={sx}
    >
      Sign out
    </Button>
  );
}
