"use client";

import Link from "next/link";
import { CheckCircleRounded } from "@mui/icons-material";
import {
  Box,
  Button,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useState } from "react";
import { FileUploadField } from "@/components/common/file-upload-field";
import { useI18n } from "@/components/providers/i18n-provider";

type PublicQuestionFormProps = {
  slug: string;
  disabled: boolean;
  returnHref?: string;
  returnTransitionTypes?: string[];
};

export function PublicQuestionForm({
  slug,
  disabled,
  returnHref,
  returnTransitionTypes,
}: PublicQuestionFormProps) {
  const { t } = useI18n();
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [content, setContent] = useState("");
  const [uploadResetToken, setUploadResetToken] = useState(0);

  function resetForm() {
    setError(null);
    setSubmitted(false);
    setContent("");
    setUploadResetToken((current) => current + 1);
  }

  async function handleSubmit(formData: FormData) {
    setSubmitting(true);
    setError(null);

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

      resetForm();
      setSubmitted(true);
    } catch {
      setError(t("common.feedback.networkError"));
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted && returnHref) {
    return (
      <Stack spacing={{ xs: 2, md: 2.5 }} className="motion-enter-soft motion-delay-2">
        <Box
          sx={(theme) => ({
            p: { xs: 1.75, sm: 2, md: 2.25 },
            borderRadius: 2,
            border: `1px solid ${alpha(theme.palette.success.main, 0.24)}`,
            backgroundColor: alpha(theme.palette.success.main, 0.08),
          })}
        >
          <Stack spacing={1.25}>
            <Stack direction="row" spacing={1.25} alignItems="center">
              <CheckCircleRounded color="success" />
              <Typography variant="h6">
                {t("publicQuestionForm.successTitle")}
              </Typography>
            </Stack>
            <Typography color="text.secondary">
              {t("publicQuestionForm.successDescription")}
            </Typography>
          </Stack>
        </Box>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25}>
          <Button
            component={Link}
            href={returnHref}
            transitionTypes={returnTransitionTypes}
            variant="contained"
            sx={{ width: { xs: "100%", sm: "auto" } }}
          >
            {t("publicQuestionForm.backToPublished")}
          </Button>
          <Button
            type="button"
            variant="text"
            onClick={resetForm}
            sx={{ width: { xs: "100%", sm: "auto" } }}
          >
            {t("publicQuestionForm.askAnother")}
          </Button>
        </Stack>
      </Stack>
    );
  }

  return (
    <Stack
      component="form"
      action={handleSubmit}
      aria-busy={submitting}
      spacing={{ xs: 2, md: 2.25 }}
    >
      <Box
        aria-live="polite"
        aria-atomic="true"
        sx={{
          minHeight: {
            xs: error || submitted ? "auto" : 40,
            sm: error || submitted ? "auto" : 28,
          },
        }}
      >
        {error ? <Typography color="error.main">{error}</Typography> : null}
        {!error && submitted ? (
          <Typography color="success.main">{t("publicQuestionForm.success")}</Typography>
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

          if (submitted) {
            setSubmitted(false);
          }
        }}
      />
      <Box
        sx={{
          p: { xs: 1.5, sm: 1.75 },
          borderRadius: 1.5,
          bgcolor: "background.paper",
          border: "1px solid",
          borderColor: "divider",
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

            if (submitted) {
              setSubmitted(false);
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
