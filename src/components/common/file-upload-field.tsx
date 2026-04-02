"use client";

import { CloudUploadRounded } from "@mui/icons-material";
import { Button, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { useI18n } from "@/components/providers/i18n-provider";

type FileUploadFieldProps = {
  name: string;
  accept: string;
  helperText: string;
  buttonLabel?: string;
  emptyLabel?: string;
  disabled?: boolean;
  onFileChange?: () => void;
};

export function FileUploadField({
  name,
  accept,
  helperText,
  buttonLabel,
  emptyLabel,
  disabled = false,
  onFileChange,
}: FileUploadFieldProps) {
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const { t } = useI18n();

  const resolvedButtonLabel = buttonLabel ?? t("common.actions.uploadImage");
  const resolvedEmptyLabel = emptyLabel ?? t("common.fileUpload.noFileSelected");

  return (
    <Stack spacing={1.25}>
      <Typography variant="body2" color="text.secondary">
        {helperText}
      </Typography>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={1.25}
        alignItems={{ sm: "center" }}
      >
        <Button
          component="label"
          variant="outlined"
          startIcon={<CloudUploadRounded />}
          disabled={disabled}
          sx={{ alignSelf: { xs: "stretch", sm: "flex-start" } }}
        >
          {resolvedButtonLabel}
          <input
            hidden
            type="file"
            name={name}
            accept={accept}
            disabled={disabled}
            onChange={(event) => {
              setSelectedName(event.target.files?.[0]?.name ?? null);
              onFileChange?.();
            }}
          />
        </Button>
        <Typography
          variant="body2"
          color="text.secondary"
          className="text-break"
          aria-live="polite"
        >
          {selectedName
            ? t("common.fileUpload.selectedFile", { name: selectedName })
            : resolvedEmptyLabel}
        </Typography>
      </Stack>
    </Stack>
  );
}
