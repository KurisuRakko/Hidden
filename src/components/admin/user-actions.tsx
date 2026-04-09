"use client";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { HardDeleteButton } from "@/components/admin/hard-delete-button";

type UserActionsProps = {
  userId: string;
  userRole: string;
  userStatus: string;
};

export function UserActions({ userId, userRole, userStatus }: UserActionsProps) {
  const router = useRouter();
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [tempPassword, setTempPassword] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isAdmin = userRole === "ADMIN";
  const isActive = userStatus === "ACTIVE";

  async function handleResetPassword() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}/reset-password`, {
        method: "POST",
      });
      if (res.ok) {
        const data = await res.json();
        setTempPassword(data.temporaryPassword);
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleImpersonate() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}/impersonate`, {
        method: "POST",
      });
      if (res.ok) {
        const data = await res.json();
        window.open(data.impersonateUrl, "_blank");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Stack direction="row" spacing={1} justifyContent="flex-end">
        <Button
          size="small"
          variant="outlined"
          disabled={isAdmin || loading}
          onClick={() => {
            setTempPassword(null);
            setResetDialogOpen(true);
          }}
        >
          Reset Password
        </Button>
        <Button
          size="small"
          variant="outlined"
          color="warning"
          disabled={isAdmin || !isActive || loading}
          onClick={handleImpersonate}
        >
          Impersonate
        </Button>
        {!isAdmin && (
          <HardDeleteButton
            endpoint={`/api/admin/users/${userId}`}
            label="Hard Delete"
            description="This will permanently delete the user account and all associated data including boxes, questions, and answers."
          />
        )}
      </Stack>

      <Dialog
        open={resetDialogOpen}
        onClose={() => setResetDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Reset User Password</DialogTitle>
        <DialogContent>
          {tempPassword ? (
            <>
              <DialogContentText sx={{ mb: 2 }}>
                Password has been reset. The user&apos;s existing sessions have been invalidated.
                Please copy the temporary password below and share it with the user securely.
              </DialogContentText>
              <TextField
                fullWidth
                label="Temporary Password"
                value={tempPassword}
                slotProps={{ input: { readOnly: true } }}
                onFocus={(e) => e.target.select()}
              />
            </>
          ) : (
            <DialogContentText>
              This will generate a new random password and invalidate all existing sessions for this
              user. Are you sure?
            </DialogContentText>
          )}
        </DialogContent>
        <DialogActions>
          {tempPassword ? (
            <Button onClick={() => setResetDialogOpen(false)}>Close</Button>
          ) : (
            <>
              <Button onClick={() => setResetDialogOpen(false)}>Cancel</Button>
              <Button
                variant="contained"
                color="error"
                disabled={loading}
                onClick={handleResetPassword}
              >
                Reset Password
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
}
