"use client";

import { Alert, Button, MenuItem, Stack, TextField } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function InviteCreateForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(formData: FormData) {
    setSubmitting(true);
    setError(null);

    const maxUsesValue = String(formData.get("maxUses") ?? "").trim();

    const payload = {
      code: String(formData.get("code") ?? ""),
      maxUses: maxUsesValue ? Number(maxUsesValue) : null,
      expiresAt: String(formData.get("expiresAt") ?? "") || null,
      status: String(formData.get("status") ?? "ACTIVE"),
    };

    try {
      const response = await fetch("/api/admin/invites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const result = await response.json();

      if (!response.ok) {
        setError(result.error ?? "Unable to create invite code.");
        return;
      }

      router.refresh();
    } catch {
      setError("Network request failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Stack component="form" action={handleSubmit} spacing={2}>
      {error ? <Alert severity="error">{error}</Alert> : null}
      <TextField label="Invite code" name="code" required />
      <TextField
        label="Max uses"
        name="maxUses"
        type="number"
        helperText="Leave empty for unlimited usage."
      />
      <TextField
        label="Expires at"
        name="expiresAt"
        type="datetime-local"
        slotProps={{ inputLabel: { shrink: true } }}
      />
      <TextField select label="Status" name="status" defaultValue="ACTIVE">
        <MenuItem value="ACTIVE">Active</MenuItem>
        <MenuItem value="DISABLED">Disabled</MenuItem>
      </TextField>
      <Button type="submit" variant="contained" disabled={submitting}>
        {submitting ? "Creating..." : "Create invite"}
      </Button>
    </Stack>
  );
}
