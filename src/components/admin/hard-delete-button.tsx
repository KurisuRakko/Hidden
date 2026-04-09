"use client";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";

type HardDeleteButtonProps = {
  endpoint: string;
  label?: string;
  description: string;
};

export function HardDeleteButton({
  endpoint,
  label = "Hard Delete",
  description,
}: HardDeleteButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleConfirm() {
    setLoading(true);
    try {
      await fetch(endpoint, { method: "DELETE" });
      setOpen(false);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Button
        size="small"
        variant="outlined"
        color="error"
        onClick={() => setOpen(true)}
      >
        {label}
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Permanently Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {description}
            <br />
            <strong>This action cannot be undone.</strong>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            disabled={loading}
            onClick={handleConfirm}
          >
            Permanently Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
