"use client";

import {
  Alert,
  Box,
  Button,
  Stack,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { FileUploadField } from "@/components/common/file-upload-field";
import { useI18n } from "@/components/providers/i18n-provider";

type PublicQuestionFormProps = {
  slug: string;
  disabled: boolean;
};

export function PublicQuestionForm({
  slug,
  disabled,
}: PublicQuestionFormProps) {
  const { t } = useI18n();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [content, setContent] = useState("");
  const [uploadResetToken, setUploadResetToken] = useState(0);

  async function handleSubmit(formData: FormData) {
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`/api/public/boxes/${slug}/questions`, {
        method: "POST",
        body: formData,
      });
      const result = await response.json();

      if (!response.ok) {
        setError(result.error ?? t("publicQuestionForm.submitError"));
        return;
      }

      setContent("");
      setUploadResetToken((current) => current + 1);
      setSuccess(t("publicQuestionForm.success"));
    } catch {
      setError(t("common.feedback.networkError"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Stack
      component="form"
      action={handleSubmit}
      aria-busy={submitting}
      spacing={{ xs: 2, md: 2.25 }}
      className="motion-enter-soft motion-delay-2"
    >
      <Box
        aria-live="polite"
        aria-atomic="true"
        sx={{
          minHeight: { xs: error || success ? "auto" : 72, sm: error || success ? "auto" : 56 },
        }}
      >
        {error ? (
          <Alert severity="error" className="status-feedback">
            {error}
          </Alert>
        ) : null}
        {!error && success ? (
          <Alert severity="success" className="status-feedback">
            {success}
          </Alert>
        ) : null}
      </Box>
      <TextField
        label={t("publicQuestionForm.questionLabel")}
        name="content"
        multiline
        minRows={4}
        fullWidth
        required
        disabled={disabled || submitting}
        value={content}
        onChange={(event) => {
          setContent(event.target.value);

          if (error) {
            setError(null);
          }

          if (success) {
            setSuccess(null);
          }
        }}
      />
      <Box
        sx={{
          p: { xs: 1.5, sm: 1.75 },
          borderRadius: "16px",
          bgcolor: "rgba(255, 255, 255, 0.54)",
          border: "1px solid rgba(32, 34, 39, 0.06)",
        }}
      >
        <FileUploadField
          key={`public-upload-${uploadResetToken}`}
          name="image"
          accept="image/png,image/jpeg,image/webp"
          disabled={disabled || submitting}
          onFileChange={() => {
            if (error) {
              setError(null);
            }

            if (success) {
              setSuccess(null);
            }
          }}
          helperText={t("publicQuestionForm.imageHelper")}
          buttonLabel={t("publicQuestionForm.attachImage")}
        />
      </Box>
      <Button
        type="submit"
        variant="contained"
        disabled={disabled || submitting}
        size="large"
        aria-busy={submitting}
        sx={{ width: { xs: "100%", sm: "auto" }, alignSelf: "flex-start", mt: 0.25 }}
      >
        {submitting
          ? t("publicQuestionForm.submitting")
          : t("publicQuestionForm.submit")}
      </Button>
    </Stack>
  );
}
