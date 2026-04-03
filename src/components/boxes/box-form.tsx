"use client";

import {
  Alert,
  Box,
  Button,
  Collapse,
  Divider,
  FormControlLabel,
  MenuItem,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FileUploadField } from "@/components/common/file-upload-field";
import { useI18n } from "@/components/providers/i18n-provider";
import { getStatusLabel } from "@/lib/i18n";

type BoxFormValues = {
  id?: string;
  title: string;
  description: string | null;
  slug: string;
  wallpaperUrl?: string | null;
  acceptingQuestions: boolean;
  status: "ACTIVE" | "HIDDEN";
};

type BoxFormProps = {
  initialValues?: BoxFormValues;
  createRedirectMode?: "detail" | "created";
  submitLabel?: string;
};

export function BoxForm({
  initialValues,
  createRedirectMode = "detail",
  submitLabel,
}: BoxFormProps) {
  const { locale, t } = useI18n();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [acceptingQuestions, setAcceptingQuestions] = useState(
    initialValues?.acceptingQuestions ?? true,
  );
  const [status, setStatus] = useState<"ACTIVE" | "HIDDEN">(
    initialValues?.status ?? "ACTIVE",
  );
  const [removeWallpaper, setRemoveWallpaper] = useState(false);
  const [hasPendingWallpaper, setHasPendingWallpaper] = useState(false);

  async function handleSubmit(formData: FormData) {
    setSubmitting(true);
    setError(null);
    formData.set("acceptingQuestions", String(acceptingQuestions));
    formData.set("status", status);
    formData.set("removeWallpaper", String(removeWallpaper));

    const url = initialValues?.id ? `/api/boxes/${initialValues.id}` : "/api/boxes";
    const method = initialValues?.id ? "PATCH" : "POST";

    try {
      const response = await fetch(url, {
        method,
        body: formData,
      });
      const result = await response.json();

      if (!response.ok) {
        setError(result.error ?? t("dashboard.boxForm.saveError"));
        return;
      }

      if (!initialValues?.id) {
        router.push(
          createRedirectMode === "created"
            ? `/dashboard/boxes/${result.id}/created`
            : `/dashboard/boxes/${result.id}`,
        );
      } else {
        router.refresh();
      }
    } catch {
      setError(t("common.feedback.networkError"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Stack component="form" action={handleSubmit} spacing={2.25}>
      <input type="hidden" name="removeWallpaper" value={String(removeWallpaper)} />
      <Collapse in={Boolean(error)} unmountOnExit>
        {error ? <Alert severity="error" className="status-feedback">{error}</Alert> : null}
      </Collapse>
      <Stack spacing={2}>
        <Stack spacing={0.5}>
          <Typography variant="subtitle2">{t("dashboard.boxForm.basicsTitle")}</Typography>
          <Typography color="text.secondary">
            {t("dashboard.boxForm.basicsDescription")}
          </Typography>
        </Stack>
        <TextField
          name="title"
          label={t("dashboard.boxForm.title")}
          required
          fullWidth
          defaultValue={initialValues?.title ?? ""}
        />
        <TextField
          name="description"
          label={t("dashboard.boxForm.description")}
          fullWidth
          multiline
          minRows={3}
          defaultValue={initialValues?.description ?? ""}
        />
        <TextField
          name="slug"
          label={t("dashboard.boxForm.slug")}
          required
          fullWidth
          helperText={t("dashboard.boxForm.slugHelper")}
          defaultValue={initialValues?.slug ?? ""}
        />
      </Stack>
      <Divider />
      <Stack spacing={2}>
        <Stack spacing={0.5}>
          <Typography variant="subtitle2">{t("dashboard.boxForm.wallpaperTitle")}</Typography>
          <Typography color="text.secondary">
            {t("dashboard.boxForm.wallpaperDescription")}
          </Typography>
        </Stack>
        <Stack spacing={1.5}>
          {initialValues?.wallpaperUrl && !removeWallpaper && !hasPendingWallpaper ? (
            <Box
              sx={(theme) => ({
                p: 1.25,
                borderRadius: 1.5,
                border: `1px solid ${theme.palette.divider}`,
                bgcolor: theme.palette.action.hover,
              })}
            >
              <Box
                component="img"
                src={initialValues.wallpaperUrl}
                alt={t("dashboard.boxForm.wallpaperAlt")}
                sx={{
                  width: "100%",
                  maxHeight: 220,
                  borderRadius: 1.5,
                  objectFit: "cover",
                }}
              />
            </Box>
          ) : null}

          <FileUploadField
            name="wallpaper"
            accept="image/png,image/jpeg,image/webp"
            helperText={t("dashboard.boxForm.wallpaperHelper")}
            buttonLabel={t("dashboard.boxForm.uploadWallpaper")}
            emptyLabel={
              initialValues?.wallpaperUrl && !removeWallpaper
                ? t("dashboard.boxForm.keepWallpaper")
                : t("dashboard.boxForm.noWallpaper")
            }
            onFileChange={() => {
              setRemoveWallpaper(false);
              setHasPendingWallpaper(true);
            }}
          />

          {initialValues?.wallpaperUrl ? (
            <Button
              type="button"
              variant={removeWallpaper ? "contained" : "text"}
              color={removeWallpaper ? "warning" : "inherit"}
              onClick={() => {
                setRemoveWallpaper((value) => !value);
                setHasPendingWallpaper(false);
              }}
              sx={{ width: { xs: "100%", sm: "auto" } }}
            >
              {removeWallpaper
                ? t("dashboard.boxForm.restoreWallpaper")
                : t("dashboard.boxForm.removeWallpaper")}
            </Button>
          ) : null}
        </Stack>
      </Stack>
      <Divider />
      <Stack spacing={2}>
        <Stack spacing={0.5}>
          <Typography variant="subtitle2">{t("dashboard.boxForm.availabilityTitle")}</Typography>
          <Typography color="text.secondary">
            {t("dashboard.boxForm.availabilityDescription")}
          </Typography>
        </Stack>
        <TextField
          select
          label={t("dashboard.boxForm.visibility")}
          value={status}
          onChange={(event) => setStatus(event.target.value as "ACTIVE" | "HIDDEN")}
        >
          <MenuItem value="ACTIVE">{getStatusLabel("ACTIVE", locale)}</MenuItem>
          <MenuItem value="HIDDEN">{getStatusLabel("HIDDEN", locale)}</MenuItem>
        </TextField>
        <Box
          sx={(theme) => ({
            px: 1.5,
            py: 1,
            borderRadius: 1.5,
            bgcolor: theme.palette.action.hover,
            border: `1px solid ${theme.palette.divider}`,
          })}
        >
          <FormControlLabel
            control={
              <Switch
                checked={acceptingQuestions}
                onChange={(event) => setAcceptingQuestions(event.target.checked)}
              />
            }
            label={t("dashboard.boxForm.acceptQuestions")}
            sx={{ m: 0, width: "100%", justifyContent: "space-between" }}
          />
        </Box>
      </Stack>
      <Divider />
      <Button
        type="submit"
        variant="contained"
        disabled={submitting}
        size="large"
        sx={{ width: { xs: "100%", sm: "auto" } }}
      >
        {submitting
          ? t("common.actions.saving")
          : submitLabel ??
            (initialValues?.id
              ? t("common.actions.saveChanges")
              : t("dashboard.boxForm.create"))}
      </Button>
    </Stack>
  );
}
