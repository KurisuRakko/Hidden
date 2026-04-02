"use client";

import { MenuItem, TextField } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";

type BoxStatusSelectProps = {
  boxId: string;
  status: "ACTIVE" | "HIDDEN" | "DISABLED";
};

export function BoxStatusSelect({ boxId, status }: BoxStatusSelectProps) {
  const router = useRouter();
  const [value, setValue] = useState(status);

  async function handleChange(nextStatus: typeof status) {
    setValue(nextStatus);
    await fetch(`/api/admin/boxes/${boxId}/status`, {
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
        handleChange(event.target.value as "ACTIVE" | "HIDDEN" | "DISABLED")
      }
    >
      <MenuItem value="ACTIVE">Active</MenuItem>
      <MenuItem value="HIDDEN">Hidden</MenuItem>
      <MenuItem value="DISABLED">Disabled</MenuItem>
    </TextField>
  );
}
