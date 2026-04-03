"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Alert,
  Button,
  Stack,
  TextField,
} from "@mui/material";
import {
  ContentCopyRounded,
  LaunchRounded,
} from "@mui/icons-material";
import { useI18n } from "@/components/providers/i18n-provider";

type BoxShareActionsProps = {
  shareUrl: string;
};

export function BoxShareActions({
  shareUrl,
}: BoxShareActionsProps) {
  const { t } = useI18n();
  const [message, setMessage] = useState<string | null>(null);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setMessage(t("dashboard.share.copied"));
    } catch {
      setMessage(t("dashboard.share.copyFailed"));
    }
  }

  return (
    <Stack spacing={2}>
      {message ? <Alert severity="success">{message}</Alert> : null}
      <TextField
        label={t("dashboard.share.shareUrl")}
        value={shareUrl}
        fullWidth
        slotProps={{
          input: {
            readOnly: true,
          },
        }}
      />
      <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25}>
        <Button
          type="button"
          variant="outlined"
          startIcon={<ContentCopyRounded />}
          onClick={handleCopy}
          sx={{ width: { xs: "100%", sm: "auto" } }}
        >
          {t("dashboard.share.share")}
        </Button>
        <Button
          component={Link}
          href={shareUrl}
          target="_blank"
          variant="outlined"
          startIcon={<LaunchRounded />}
          sx={{ width: { xs: "100%", sm: "auto" } }}
        >
          {t("dashboard.share.open")}
        </Button>
      </Stack>
    </Stack>
  );
}
