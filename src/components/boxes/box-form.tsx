"use client";

import {
  Alert,
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

type BoxFormValues = {
  id?: string;
  title: string;
  description: string | null;
  slug: string;
  acceptingQuestions: boolean;
  status: "ACTIVE" | "HIDDEN";
};

type BoxFormProps = {
  initialValues?: BoxFormValues;
};

export function BoxForm({ initialValues }: BoxFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [acceptingQuestions, setAcceptingQuestions] = useState(
    initialValues?.acceptingQuestions ?? true,
  );
  const [status, setStatus] = useState<"ACTIVE" | "HIDDEN">(
    initialValues?.status ?? "ACTIVE",
  );

  async function handleSubmit(formData: FormData) {
    setSubmitting(true);
    setError(null);

    const payload = {
      title: String(formData.get("title") ?? ""),
      description: String(formData.get("description") ?? ""),
      slug: String(formData.get("slug") ?? ""),
      acceptingQuestions,
      status,
    };

    const url = initialValues?.id ? `/api/boxes/${initialValues.id}` : "/api/boxes";
    const method = initialValues?.id ? "PATCH" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const result = await response.json();

      if (!response.ok) {
        setError(result.error ?? "Unable to save the box.");
        return;
      }

      if (!initialValues?.id) {
        router.push(`/dashboard/boxes/${result.id}`);
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
    <Stack component="form" action={handleSubmit} spacing={2.5}>
      <Collapse in={Boolean(error)} unmountOnExit>
        {error ? <Alert severity="error">{error}</Alert> : null}
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
      <TextField
        select
        label="Visibility"
        value={status}
        onChange={(event) => setStatus(event.target.value as "ACTIVE" | "HIDDEN")}
      >
        <MenuItem value="ACTIVE">Active</MenuItem>
        <MenuItem value="HIDDEN">Hidden</MenuItem>
      </TextField>
      <FormControlLabel
        control={
          <Switch
            checked={acceptingQuestions}
            onChange={(event) => setAcceptingQuestions(event.target.checked)}
          />
        }
        label="Accept new anonymous questions"
      />
      <Button
        type="submit"
        variant="contained"
        disabled={submitting}
        size="large"
        sx={{ width: { xs: "100%", sm: "auto" } }}
      >
        {submitting ? "Saving..." : initialValues?.id ? "Save changes" : "Create box"}
      </Button>
    </Stack>
  );
}
