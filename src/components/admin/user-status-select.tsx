"use client";

import { MenuItem, TextField } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";

type UserStatusSelectProps = {
  userId: string;
  status: "ACTIVE" | "DISABLED" | "BANNED";
};

export function UserStatusSelect({ userId, status }: UserStatusSelectProps) {
  const router = useRouter();
  const [value, setValue] = useState(status);

  async function handleChange(nextStatus: typeof status) {
    setValue(nextStatus);
    await fetch(`/api/admin/users/${userId}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: nextStatus }),
    });
    router.refresh();
  }

  return (
    <TextField
      select
      size="small"
      value={value}
      onChange={(event) =>
        handleChange(event.target.value as "ACTIVE" | "DISABLED" | "BANNED")
      }
    >
      <MenuItem value="ACTIVE">Active</MenuItem>
      <MenuItem value="DISABLED">Disabled</MenuItem>
      <MenuItem value="BANNED">Banned</MenuItem>
    </TextField>
  );
}
