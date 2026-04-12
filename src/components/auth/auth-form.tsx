"use client";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
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
  getDialCodeOptions,
  normalizeLocalPhoneNumber,
} from "@/lib/phone";
import { useI18n } from "@/components/providers/i18n-provider";
import { getLocalizedErrorMessage } from "@/lib/i18n";

type AuthFieldName = "localPhone" | "password" | "inviteCode";
type AuthFieldErrors = Partial<Record<AuthFieldName, string>>;

type AuthFormProps = {
  mode: "login" | "register";
  portal?: "PUBLIC" | "ADMIN";
  notice?: string;
  defaultDialCode: DialCode;
  oidcEnabled?: boolean;
  oidcProviderLabel?: string;
};

export function AuthForm({
  mode,
  portal = "PUBLIC",
  notice,
  defaultDialCode,
  oidcEnabled = false,
  oidcProviderLabel = "Casdoor",
}: AuthFormProps) {
  const { locale, t } = useI18n();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<AuthFieldErrors>({});
  const [errorActionUrl, setErrorActionUrl] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const isAdminLogin = mode === "login" && portal === "ADMIN";
  const showOidcEntry = oidcEnabled && !isAdminLogin;
  const feedbackSeverity = error ? "error" : notice ? "info" : null;
  const feedbackMessage = error ?? notice ?? null;
  const dialCodeOptions = isAdminLogin ? DIAL_CODE_OPTIONS : getDialCodeOptions(locale);

  function getFieldKeyFromPath(path: unknown) {
    if (path === "phone" || path === "localPhone") {
      return "localPhone" as const;
    }

    if (path === "password") {
      return "password" as const;
    }

    if (path === "inviteCode") {
      return "inviteCode" as const;
    }

    return null;
  }

  function setSingleFieldError(field: AuthFieldName, message: string) {
    setFieldErrors({ [field]: message });
    setError(null);
    setErrorActionUrl(null);
  }

  function buildFieldErrorsFromResponse(input: {
    code?: string;
    localizedError: string;
    details?: unknown;
  }) {
    const nextFieldErrors: AuthFieldErrors = {};

    if (mode === "register") {
      if (input.code === "PHONE_TAKEN") {
        nextFieldErrors.localPhone = input.localizedError;
      }

      if (
        input.code === "INVITE_INVALID" ||
        input.code === "INVITE_EXPIRED" ||
        input.code === "INVITE_EXHAUSTED"
      ) {
        nextFieldErrors.inviteCode = input.localizedError;
      }
    }

    if (input.code === "VALIDATION_ERROR" && Array.isArray(input.details)) {
      for (const detail of input.details) {
        if (!detail || typeof detail !== "object") {
          continue;
        }

        const path = "path" in detail ? detail.path : undefined;
        const message = "message" in detail ? detail.message : undefined;

        if (typeof path !== "string" || typeof message !== "string") {
          continue;
        }

        const field = getFieldKeyFromPath(path);

        if (!field || nextFieldErrors[field]) {
          continue;
        }

        nextFieldErrors[field] = getLocalizedErrorMessage({
          locale,
          message,
        });
      }
    }

    return nextFieldErrors;
  }

  async function handleSubmit(formData: FormData) {
    setSubmitting(true);
    setError(null);
    setFieldErrors({});
    setErrorActionUrl(null);

    const dialCode = String(formData.get("dialCode") ?? defaultDialCode);
    const password = String(formData.get("password") ?? "");
    const inviteCode = String(formData.get("inviteCode") ?? "");
    const localPhone = normalizeLocalPhoneNumber(
      String(formData.get("localPhone") ?? ""),
    );
    const phone = `${dialCode}${localPhone}`;

    if (!localPhone) {
      setSingleFieldError(
        "localPhone",
        isAdminLogin
          ? "Enter a valid local phone number before continuing."
          : t("auth.validation.localPhoneRequired"),
      );
      setSubmitting(false);
      return;
    }

    if (!password.trim()) {
      setSingleFieldError(
        "password",
        isAdminLogin
          ? "Enter your password before continuing."
          : t("auth.validation.passwordRequired"),
      );
      setSubmitting(false);
      return;
    }

    if (mode === "register" && !inviteCode.trim()) {
      setSingleFieldError("inviteCode", t("auth.validation.inviteCodeRequired"));
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
        const localizedError =
          isAdminLogin
            ? result.error ?? "Request failed."
            : getLocalizedErrorMessage({
                locale,
                code:
                  typeof result.code === "string" ? result.code : undefined,
                message:
                  typeof result.error === "string"
                    ? result.error
                    : t("common.feedback.requestFailed"),
              });
        const nextFieldErrors = buildFieldErrorsFromResponse({
          code: typeof result.code === "string" ? result.code : undefined,
          localizedError,
          details: result.details,
        });

        if (Object.keys(nextFieldErrors).length > 0) {
          setFieldErrors(nextFieldErrors);
          setError(null);
        } else {
          setError(localizedError);
        }

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
      setError(
        isAdminLogin
          ? "Network request failed. Please try again."
          : t("common.feedback.networkError"),
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card
      className="motion-pop motion-delay-1"
      sx={{ maxWidth: 520, mx: "auto", overflow: "hidden", borderRadius: 2 }}
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
                ? t("auth.adminTitle")
                : mode === "login"
                  ? t("auth.loginTitle")
                  : t("auth.registerTitle")}
            </Typography>
            <Typography color="text.secondary">
              {isAdminLogin
                ? t("auth.adminDescription")
                : showOidcEntry
                  ? mode === "login"
                    ? t("auth.loginDescriptionWithOidc", {
                        provider: oidcProviderLabel,
                      })
                    : t("auth.registerDescriptionWithOidc", {
                        provider: oidcProviderLabel,
                      })
                  : mode === "login"
                    ? t("auth.loginDescription")
                    : t("auth.registerDescription")}
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

          {showOidcEntry ? (
            <Stack spacing={1.5}>
              <Button
                component="a"
                href="/api/auth/oidc/start"
                variant="contained"
                size="large"
                sx={{ width: { xs: "100%", sm: "auto" } }}
              >
                {t("auth.oidcPrimaryAction", {
                  provider: oidcProviderLabel,
                })}
              </Button>
              <Typography color="text.secondary">
                {mode === "login"
                  ? t("auth.oidcLoginDescription", {
                      provider: oidcProviderLabel,
                    })
                  : t("auth.oidcRegisterDescription", {
                      provider: oidcProviderLabel,
                    })}
              </Typography>
              <Divider>
                {mode === "login"
                  ? t("auth.legacyLoginDivider")
                  : t("auth.legacyRegisterDivider")}
              </Divider>
            </Stack>
          ) : null}

          <Box
            component="form"
            action={handleSubmit}
            aria-busy={submitting}
            onChange={() => {
              if (error || Object.keys(fieldErrors).length > 0) {
                setError(null);
                setFieldErrors({});
                setErrorActionUrl(null);
              }
            }}
          >
            <Stack spacing={{ xs: 1.75, sm: 2.25 }}>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                <TextField
                  select
                  label={isAdminLogin ? "Country code" : t("auth.countryCode")}
                  name="dialCode"
                  defaultValue={defaultDialCode}
                  disabled={submitting}
                  sx={{ width: { xs: "100%", sm: 190 } }}
                >
                  {dialCodeOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  label={isAdminLogin ? "Phone number" : t("auth.phoneNumber")}
                  name="localPhone"
                  autoComplete="tel-national"
                  fullWidth
                  required
                  disabled={submitting}
                  error={Boolean(fieldErrors.localPhone)}
                  placeholder={
                    isAdminLogin ? "138 0013 8000" : t("auth.phonePlaceholder")
                  }
                  helperText={
                    fieldErrors.localPhone ??
                    (isAdminLogin
                      ? "Enter the local number without the international prefix."
                      : t("auth.phoneHelper"))
                  }
                />
              </Stack>
              <TextField
                label={isAdminLogin ? "Password" : t("auth.password")}
                name="password"
                type="password"
                autoComplete={
                  mode === "login" ? "current-password" : "new-password"
                }
                fullWidth
                required
                disabled={submitting}
                error={Boolean(fieldErrors.password)}
                helperText={fieldErrors.password}
              />
              {mode === "register" ? (
                <TextField
                  label={t("auth.inviteCode")}
                  name="inviteCode"
                  autoCapitalize="characters"
                  fullWidth
                  required
                  disabled={submitting}
                  error={Boolean(fieldErrors.inviteCode)}
                  helperText={fieldErrors.inviteCode}
                />
              ) : null}
              <Button
                type="submit"
                variant={showOidcEntry ? "outlined" : "contained"}
                disabled={submitting}
                size="large"
                aria-busy={submitting}
                sx={{ width: { xs: "100%", sm: "auto" }, mt: 0.25 }}
              >
                {submitting
                  ? isAdminLogin
                    ? t("auth.submit")
                    : t("auth.submit")
                  : isAdminLogin
                    ? t("auth.signInToAdmin")
                    : mode === "login"
                      ? t("common.actions.signIn")
                      : t("auth.registerAction")}
              </Button>
            </Stack>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
