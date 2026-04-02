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
  notice?: string;
};

export function AuthForm({ mode, notice }: AuthFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(formData: FormData) {
    setSubmitting(true);
    setError(null);

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
        return;
      }

      router.push(result.user?.role === "ADMIN" ? "/admin" : "/dashboard");
      router.refresh();
    } catch {
      setError("Network request failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card className="motion-enter motion-delay-1" sx={{ maxWidth: 520, mx: "auto", overflow: "hidden" }}>
      <CardContent sx={{ p: { xs: 3, md: 4 } }}>
        <Stack spacing={3}>
          <Box>
            <Typography
              variant="h4"
              gutterBottom
              sx={{ fontSize: { xs: "1.85rem", sm: "2.125rem" } }}
            >
              {mode === "login" ? "Sign in" : "Create your Hidden account"}
            </Typography>
            <Typography color="text.secondary">
              {mode === "login"
                ? "Use your phone number and password to continue."
                : "Registration is invite-only in the first release."}
            </Typography>
          </Box>

          <Collapse in={Boolean(notice)} unmountOnExit>
            {notice ? <Alert severity="info">{notice}</Alert> : null}
          </Collapse>
          <Collapse in={Boolean(error)} unmountOnExit>
            {error ? <Alert severity="error">{error}</Alert> : null}
          </Collapse>

          <Box component="form" action={handleSubmit}>
            <Stack spacing={2.5}>
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
