"use client";

import { startTransition, useState } from "react";
import {
  Alert,
  Button,
  Stack,
  Typography,
} from "@mui/material";
import { TranslateRounded } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useI18n } from "@/components/providers/i18n-provider";
import { type Locale } from "@/lib/i18n";

const localeOrder: Locale[] = ["zh-CN", "en"];

export function DashboardLanguageSettingsCard() {
  const router = useRouter();
  const { locale, t } = useI18n();
  const [submitting, setSubmitting] = useState<Locale | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleUpdate(nextLocale: Locale) {
    if (nextLocale === locale) {
      return;
    }

    setSubmitting(nextLocale);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/me/locale", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ locale: nextLocale }),
      });
      const result = await response.json();

      if (!response.ok) {
        setError(result.error ?? t("dashboard.language.updateError"));
        return;
      }

      setSuccess(t("dashboard.language.updateSuccess"));
      startTransition(() => {
        router.refresh();
      });
    } catch {
      setError(t("common.feedback.networkError"));
    } finally {
      setSubmitting(null);
    }
  }

  return (
    <Stack spacing={2}>
      <Stack spacing={0.75}>
        <Typography variant="body1">
          {t("dashboard.language.current", {
            language: t(`common.localeOption.${locale}`),
          })}
        </Typography>
        <Typography color="text.secondary" sx={{ fontSize: "0.95rem" }}>
          {t("dashboard.language.helper")}
        </Typography>
      </Stack>

      {error ? <Alert severity="error">{error}</Alert> : null}
      {!error && success ? <Alert severity="success">{success}</Alert> : null}

      <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25}>
        {localeOrder.map((item) => {
          const selected = item === locale;
          const busy = submitting === item;

          return (
            <Button
              key={item}
              type="button"
              variant={selected ? "contained" : "outlined"}
              startIcon={<TranslateRounded />}
              disabled={Boolean(submitting) || selected}
              onClick={() => handleUpdate(item)}
              sx={{ width: { xs: "100%", sm: "auto" } }}
            >
              {busy
                ? t("dashboard.language.updating")
                : t(`common.localeOption.${item}`)}
            </Button>
          );
        })}
      </Stack>
    </Stack>
  );
}
