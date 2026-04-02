"use client";

import {
  Alert,
  Box,
  Button,
  Collapse,
  FormControlLabel,
  MenuItem,
  Stack,
  Switch,
  TextField,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FileUploadField } from "@/components/common/file-upload-field";

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
        setError(result.error ?? "Unable to save the box.");
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
      setError("Network request failed. Please try again.");
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
      <TextField
        name="title"
        label="Box title"
        required
        fullWidth
        defaultValue={initialValues?.title ?? ""}
      />
      <TextField
        name="description"
        label="Description"
        fullWidth
        multiline
        minRows={3}
        defaultValue={initialValues?.description ?? ""}
      />
      <TextField
        name="slug"
        label="Public slug"
        required
        fullWidth
        helperText="Public URLs use /b/[slug]."
        defaultValue={initialValues?.slug ?? ""}
      />
      <Stack spacing={1.5}>
        {initialValues?.wallpaperUrl && !removeWallpaper && !hasPendingWallpaper ? (
          <Box
            sx={(theme) => ({
              p: 1.25,
              borderRadius: "18px",
              border: `1px solid ${theme.palette.divider}`,
              bgcolor: theme.palette.action.hover,
            })}
          >
            <Box
              component="img"
              src={initialValues.wallpaperUrl}
              alt="当前提问箱壁纸"
              sx={{
                width: "100%",
                maxHeight: 220,
                borderRadius: "14px",
                objectFit: "cover",
              }}
            />
          </Box>
        ) : null}

        <FileUploadField
          name="wallpaper"
          accept="image/png,image/jpeg,image/webp"
          helperText="可选上传一张提问箱壁纸，它会显示在公开提问页顶部。上传新图会替换旧图。"
          buttonLabel="上传壁纸"
          emptyLabel={
            initialValues?.wallpaperUrl && !removeWallpaper
              ? "当前保留已有壁纸"
              : "暂未选择壁纸"
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
            {removeWallpaper ? "恢复当前壁纸" : "移除当前壁纸"}
          </Button>
        ) : null}
      </Stack>
      <TextField
        select
        label="Visibility"
        value={status}
        onChange={(event) => setStatus(event.target.value as "ACTIVE" | "HIDDEN")}
      >
        <MenuItem value="ACTIVE">Active</MenuItem>
        <MenuItem value="HIDDEN">Hidden</MenuItem>
      </TextField>
      <Box
        sx={(theme) => ({
          px: 1.5,
          py: 1,
          borderRadius: "14px",
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
          label="Accept new anonymous questions"
          sx={{ m: 0, width: "100%", justifyContent: "space-between" }}
        />
      </Box>
      <Button
        type="submit"
        variant="contained"
        disabled={submitting}
        size="large"
        sx={{ width: { xs: "100%", sm: "auto" } }}
      >
        {submitting
          ? "Saving..."
          : submitLabel ?? (initialValues?.id ? "Save changes" : "Create box")}
      </Button>
    </Stack>
  );
}
