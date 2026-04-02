"use client";

import { Alert, Button, MenuItem, Stack, TextField } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";

type InviteEditFormProps = {
  invite: {
    id: string;
    code: string;
    maxUses: number | null;
    expiresAt: Date | string | null;
    status: "ACTIVE" | "DISABLED";
  };
};

function formatDateTimeLocal(value: Date | string | null) {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60000);
  return localDate.toISOString().slice(0, 16);
}

export function InviteEditForm({ invite }: InviteEditFormProps) {
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
      const response = await fetch(`/api/admin/invites/${invite.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const result = await response.json();

      if (!response.ok) {
        setError(result.error ?? "Unable to update invite.");
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
    <Stack component="form" action={handleSubmit} spacing={1.5}>
      {error ? <Alert severity="error">{error}</Alert> : null}
      <TextField label="Code" name="code" defaultValue={invite.code} size="small" />
      <TextField
        label="Max uses"
        name="maxUses"
        defaultValue={invite.maxUses ?? ""}
        type="number"
        size="small"
      />
      <TextField
        label="Expires at"
        name="expiresAt"
        defaultValue={formatDateTimeLocal(invite.expiresAt)}
        type="datetime-local"
        size="small"
        slotProps={{ inputLabel: { shrink: true } }}
      />
      <TextField
        select
        label="Status"
        name="status"
        defaultValue={invite.status}
        size="small"
      >
        <MenuItem value="ACTIVE">Active</MenuItem>
        <MenuItem value="DISABLED">Disabled</MenuItem>
      </TextField>
      <Button type="submit" variant="outlined" disabled={submitting}>
        Save invite
      </Button>
    </Stack>
  );
}
