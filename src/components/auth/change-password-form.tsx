"use client";

import { Alert, Button, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useI18n } from "@/components/providers/i18n-provider";

export function ChangePasswordForm() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { t } = useI18n();

  async function handleSubmit(formData: FormData) {
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    const currentPassword = String(formData.get("currentPassword") ?? "");
    const newPassword = String(formData.get("newPassword") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");

    if (!currentPassword.trim()) {
      setError(t("dashboard.changePassword.validation.currentPasswordRequired"));
      setSubmitting(false);
      return;
    }

    if (!newPassword.trim()) {
      setError(t("dashboard.changePassword.validation.newPasswordRequired"));
      setSubmitting(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(t("dashboard.changePassword.validation.passwordMismatch"));
      setSubmitting(false);
      return;
    }

    if (currentPassword === newPassword) {
      setError(t("dashboard.changePassword.validation.passwordUnchanged"));
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
        setError(result.error ?? t("common.feedback.requestFailed"));
        return;
      }

      setSuccess(
        result.signedOutOtherSessions > 0
          ? t("dashboard.changePassword.successSignedOut")
          : t("dashboard.changePassword.success"),
      );
      const form = document.getElementById(
        "change-password-form",
      ) as HTMLFormElement | null;
      form?.reset();
    } catch {
      setError(t("common.feedback.networkError"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Stack spacing={2.25}>
      <Stack spacing={0.75}>
        <Typography variant="body1">
          {t("dashboard.changePassword.intro")}
        </Typography>
        <Typography color="text.secondary" sx={{ fontSize: "0.95rem" }}>
          {t("dashboard.changePassword.description")}
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
          label={t("dashboard.changePassword.currentPassword")}
          name="currentPassword"
          type="password"
          autoComplete="current-password"
          fullWidth
          required
          disabled={submitting}
        />
        <TextField
          label={t("dashboard.changePassword.newPassword")}
          name="newPassword"
          type="password"
          autoComplete="new-password"
          fullWidth
          required
          disabled={submitting}
          helperText={t("dashboard.changePassword.newPasswordHelper")}
        />
        <TextField
          label={t("dashboard.changePassword.confirmPassword")}
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
          {submitting
            ? t("dashboard.changePassword.updating")
            : t("dashboard.changePassword.update")}
        </Button>
      </Stack>
    </Stack>
  );
}
