"use client";

import { Alert, Button, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";

export function ChangePasswordForm() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(formData: FormData) {
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    const currentPassword = String(formData.get("currentPassword") ?? "");
    const newPassword = String(formData.get("newPassword") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");

    if (!currentPassword.trim()) {
      setError("Enter your current password.");
      setSubmitting(false);
      return;
    }

    if (!newPassword.trim()) {
      setError("Enter a new password.");
      setSubmitting(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirmation do not match.");
      setSubmitting(false);
      return;
    }

    if (currentPassword === newPassword) {
      setError("Choose a different password from your current one.");
      setSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/me/password", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error ?? "Request failed.");
        return;
      }

      setSuccess(
        result.signedOutOtherSessions > 0
          ? "Password updated. Other signed-in devices were signed out."
          : "Password updated successfully.",
      );
      const form = document.getElementById(
        "change-password-form",
      ) as HTMLFormElement | null;
      form?.reset();
    } catch {
      setError("Network request failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Stack spacing={2.25}>
      <Stack spacing={0.75}>
        <Typography variant="body1">
          Update your password to keep this account secure.
        </Typography>
        <Typography color="text.secondary" sx={{ fontSize: "0.95rem" }}>
          After the change, Hidden keeps this device signed in and signs out your
          other active sessions.
        </Typography>
      </Stack>

      {error ? <Alert severity="error">{error}</Alert> : null}
      {success ? <Alert severity="success">{success}</Alert> : null}

      <Stack
        component="form"
        id="change-password-form"
        action={handleSubmit}
        spacing={1.75}
        aria-busy={submitting}
        onChange={() => {
          if (error || success) {
            setError(null);
            setSuccess(null);
          }
        }}
      >
        <TextField
          label="Current password"
          name="currentPassword"
          type="password"
          autoComplete="current-password"
          fullWidth
          required
          disabled={submitting}
        />
        <TextField
          label="New password"
          name="newPassword"
          type="password"
          autoComplete="new-password"
          fullWidth
          required
          disabled={submitting}
          helperText="Use 8 to 72 characters."
        />
        <TextField
          label="Confirm new password"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          fullWidth
          required
          disabled={submitting}
        />
        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={submitting}
          sx={{ width: { xs: "100%", sm: "auto" } }}
        >
          {submitting ? "Updating..." : "Update password"}
        </Button>
      </Stack>
    </Stack>
  );
}
