"use client";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Collapse,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";

type AuthFormProps = {
  mode: "login" | "register";
  portal?: "PUBLIC" | "ADMIN";
  notice?: string;
};

export function AuthForm({
  mode,
  portal = "PUBLIC",
  notice,
}: AuthFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [errorActionUrl, setErrorActionUrl] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const isAdminLogin = mode === "login" && portal === "ADMIN";

  async function handleSubmit(formData: FormData) {
    setSubmitting(true);
    setError(null);
    setErrorActionUrl(null);

    const body =
      mode === "register"
        ? {
            phone: String(formData.get("phone") ?? ""),
            password: String(formData.get("password") ?? ""),
            inviteCode: String(formData.get("inviteCode") ?? ""),
          }
        : {
            phone: String(formData.get("phone") ?? ""),
            password: String(formData.get("password") ?? ""),
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
      className="motion-enter motion-delay-1"
      sx={{ maxWidth: 520, mx: "auto", overflow: "hidden" }}
    >
      <CardContent sx={{ p: { xs: 2.5, sm: 3.5, md: 4 } }}>
        <Stack spacing={{ xs: 2.5, sm: 3 }}>
          <Box>
            <Typography
              variant="h4"
              gutterBottom
              sx={{ fontSize: { xs: "1.65rem", sm: "2rem", md: "2.125rem" } }}
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

          <Collapse in={Boolean(notice)} unmountOnExit>
            {notice ? <Alert severity="info">{notice}</Alert> : null}
          </Collapse>
          <Collapse in={Boolean(error)} unmountOnExit>
            {error ? (
              <Stack spacing={1.25}>
                <Alert severity="error">{error}</Alert>
                {errorActionUrl ? (
                  <Button component="a" href={errorActionUrl} variant="outlined">
                    Open admin portal
                  </Button>
                ) : null}
              </Stack>
            ) : null}
          </Collapse>

          <Box component="form" action={handleSubmit}>
            <Stack spacing={{ xs: 2, sm: 2.5 }}>
              <TextField
                label="Phone number"
                name="phone"
                autoComplete="tel"
                fullWidth
                required
                placeholder="+8613800138000"
              />
              <TextField
                label="Password"
                name="password"
                type="password"
                autoComplete={
                  mode === "login" ? "current-password" : "new-password"
                }
                fullWidth
                required
              />
              {mode === "register" ? (
                <TextField
                  label="Invite code"
                  name="inviteCode"
                  autoCapitalize="characters"
                  fullWidth
                  required
                />
              ) : null}
              <Button
                type="submit"
                variant="contained"
                disabled={submitting}
                size="large"
                sx={{ width: { xs: "100%", sm: "auto" } }}
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
