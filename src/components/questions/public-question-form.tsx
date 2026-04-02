"use client";

import {
  Alert,
  Button,
  Collapse,
  Stack,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { FileUploadField } from "@/components/common/file-upload-field";

type PublicQuestionFormProps = {
  slug: string;
  disabled: boolean;
};

export function PublicQuestionForm({
  slug,
  disabled,
}: PublicQuestionFormProps) {
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
        setError(result.error ?? "Unable to submit question.");
        return;
      }

      setContent("");
      setUploadResetToken((current) => current + 1);
      setSuccess("Question received. It will stay private until the owner reviews it.");
    } catch {
      setError("Network request failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Stack
      component="form"
      action={handleSubmit}
      spacing={2.5}
      className="motion-enter motion-delay-2"
    >
      <Collapse in={disabled} unmountOnExit>
        {disabled ? (
          <Alert severity="warning">
            This box is currently closed for new submissions.
          </Alert>
        ) : null}
      </Collapse>
      <Collapse in={Boolean(error)} unmountOnExit>
        {error ? <Alert severity="error">{error}</Alert> : null}
      </Collapse>
      <Collapse in={Boolean(success)} unmountOnExit>
        {success ? <Alert severity="success">{success}</Alert> : null}
      </Collapse>
      <TextField
        label="Your anonymous question"
        name="content"
        multiline
        minRows={4}
        fullWidth
        required
        disabled={disabled || submitting}
        value={content}
        onChange={(event) => setContent(event.target.value)}
      />
      <FileUploadField
        key={`public-upload-${uploadResetToken}`}
        name="image"
        accept="image/png,image/jpeg,image/webp"
        disabled={disabled || submitting}
        helperText="Optional image, up to 5 MB. JPG, PNG, and WEBP are supported."
        buttonLabel="Attach image"
      />
      <Button
        type="submit"
        variant="contained"
        disabled={disabled || submitting}
        size="large"
        sx={{ width: { xs: "100%", sm: "auto" } }}
      >
        {submitting ? "Submitting..." : "Send anonymously"}
      </Button>
    </Stack>
  );
}
