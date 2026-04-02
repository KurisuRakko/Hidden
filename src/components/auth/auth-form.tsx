"use client";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  DIAL_CODE_OPTIONS,
  type DialCode,
  normalizeLocalPhoneNumber,
} from "@/lib/phone";

type AuthFormProps = {
  mode: "login" | "register";
  portal?: "PUBLIC" | "ADMIN";
  notice?: string;
  defaultDialCode: DialCode;
};

export function AuthForm({
  mode,
  portal = "PUBLIC",
  notice,
  defaultDialCode,
}: AuthFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [errorActionUrl, setErrorActionUrl] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const isAdminLogin = mode === "login" && portal === "ADMIN";
  const feedbackSeverity = error ? "error" : notice ? "info" : null;
  const feedbackMessage = error ?? notice ?? null;

  async function handleSubmit(formData: FormData) {
    setSubmitting(true);
    setError(null);
    setErrorActionUrl(null);

    const dialCode = String(formData.get("dialCode") ?? defaultDialCode);
    const password = String(formData.get("password") ?? "");
    const inviteCode = String(formData.get("inviteCode") ?? "");
    const localPhone = normalizeLocalPhoneNumber(
      String(formData.get("localPhone") ?? ""),
    );
    const phone = `${dialCode}${localPhone}`;

    if (!localPhone) {
      setError("Enter a valid local phone number before continuing.");
      setSubmitting(false);
      return;
    }

    if (!password.trim()) {
      setError("Enter your password before continuing.");
      setSubmitting(false);
      return;
    }

    if (mode === "register" && !inviteCode.trim()) {
      setError("Enter your invite code before creating an account.");
      setSubmitting(false);
      return;
    }

    const body =
      mode === "register"
        ? {
            phone,
            password,
            inviteCode,
          }
        : {
            phone,
            password,
            portal,
          };

    try {
      const response = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error ?? "Request failed.");
        setErrorActionUrl(
          typeof result.details?.adminLoginUrl === "string"
            ? result.details.adminLoginUrl
            : null,
        );
        return;
      }

      const redirectTo =
        typeof result.redirectTo === "string"
          ? result.redirectTo
          : result.user?.role === "ADMIN"
            ? "/admin"
            : "/dashboard";

      if (/^https?:\/\//.test(redirectTo)) {
        window.location.assign(redirectTo);
        return;
      }

      router.push(redirectTo);
      router.refresh();
    } catch {
      setError("Network request failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card
      className="motion-pop motion-delay-1 surface-glass"
      sx={{ maxWidth: 520, mx: "auto", overflow: "hidden", borderRadius: { xs: "20px", sm: "24px" } }}
    >
      <CardContent sx={{ p: { xs: 2.25, sm: 3.5, md: 4 } }}>
        <Stack spacing={{ xs: 2, sm: 2.75 }}>
          <Box sx={{ pb: 0.25 }}>
            <Typography
              variant="h4"
              gutterBottom
              sx={{ fontSize: { xs: "1.55rem", sm: "2rem", md: "2.125rem" } }}
            >
              {isAdminLogin
                ? "Admin sign in"
                : mode === "login"
                  ? "Sign in"
                  : "Create your Hidden account"}
            </Typography>
            <Typography color="text.secondary">
              {isAdminLogin
                ? "Use the internal admin portal to review users, questions, and moderation logs."
                : mode === "login"
                ? "Use your phone number and password to continue."
                : "Registration is invite-only in the first release."}
            </Typography>
          </Box>

          <Box
            aria-live="polite"
            aria-atomic="true"
            sx={{
              minHeight: { xs: feedbackMessage ? "auto" : 72, sm: feedbackMessage ? "auto" : 56 },
            }}
          >
            {feedbackMessage && feedbackSeverity ? (
              <Stack spacing={1.25} sx={{ pb: 0.25 }}>
                <Alert severity={feedbackSeverity} className="status-feedback">
                  {feedbackMessage}
                </Alert>
                {errorActionUrl ? (
                  <Button component="a" href={errorActionUrl} variant="outlined">
                    Open admin portal
                  </Button>
                ) : null}
              </Stack>
            ) : null}
          </Box>

          <Box
            component="form"
            action={handleSubmit}
            aria-busy={submitting}
            onChange={() => {
              if (error) {
                setError(null);
                setErrorActionUrl(null);
              }
            }}
          >
            <Stack spacing={{ xs: 1.75, sm: 2.25 }}>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                <TextField
                  select
                  label="Country code"
                  name="dialCode"
                  defaultValue={defaultDialCode}
                  disabled={submitting}
                  sx={{ width: { xs: "100%", sm: 190 } }}
                >
                  {DIAL_CODE_OPTIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  label="Phone number"
                  name="localPhone"
                  autoComplete="tel-national"
                  fullWidth
                  required
                  disabled={submitting}
                  placeholder="138 0013 8000"
                  helperText="Enter the local number without the international prefix."
                />
              </Stack>
              <TextField
                label="Password"
                name="password"
                type="password"
                autoComplete={
                  mode === "login" ? "current-password" : "new-password"
                }
                fullWidth
                required
                disabled={submitting}
              />
              {mode === "register" ? (
                <TextField
                  label="Invite code"
                  name="inviteCode"
                  autoCapitalize="characters"
                  fullWidth
                  required
                  disabled={submitting}
                />
              ) : null}
              <Button
                type="submit"
                variant="contained"
                disabled={submitting}
                size="large"
                aria-busy={submitting}
                sx={{ width: { xs: "100%", sm: "auto" }, mt: 0.25 }}
              >
                {submitting
                  ? "Submitting..."
                  : isAdminLogin
                    ? "Sign in to admin"
                    : mode === "login"
                    ? "Sign in"
                    : "Register"}
              </Button>
            </Stack>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
