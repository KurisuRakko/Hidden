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
  SettingsRounded,
} from "@mui/icons-material";

type BoxShareActionsProps = {
  shareUrl: string;
  manageHref?: string;
};

export function BoxShareActions({
  shareUrl,
  manageHref,
}: BoxShareActionsProps) {
  const [message, setMessage] = useState<string | null>(null);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setMessage("提问箱链接已复制。");
    } catch {
      setMessage("复制失败，请手动复制链接。");
    }
  }

  return (
    <Stack spacing={2}>
      {message ? <Alert severity="success">{message}</Alert> : null}
      <TextField
        label="提问箱链接"
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
          variant="contained"
          startIcon={<ContentCopyRounded />}
          onClick={handleCopy}
          sx={{ width: { xs: "100%", sm: "auto" } }}
        >
          分享提问箱
        </Button>
        <Button
          component={Link}
          href={shareUrl}
          target="_blank"
          variant="outlined"
          startIcon={<LaunchRounded />}
          sx={{ width: { xs: "100%", sm: "auto" } }}
        >
          打开公开页
        </Button>
        {manageHref ? (
          <Button
            component={Link}
            href={manageHref}
            variant="text"
            startIcon={<SettingsRounded />}
            sx={{ width: { xs: "100%", sm: "auto" } }}
          >
            管理该提问箱
          </Button>
        ) : null}
      </Stack>
    </Stack>
  );
}
