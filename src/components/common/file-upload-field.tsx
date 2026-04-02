"use client";

import { CloudUploadRounded } from "@mui/icons-material";
import { Button, Stack, Typography } from "@mui/material";
import { useState } from "react";

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
  buttonLabel = "Choose image",
  emptyLabel = "No file selected",
  disabled = false,
  onFileChange,
}: FileUploadFieldProps) {
  const [selectedName, setSelectedName] = useState<string | null>(null);

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
          {buttonLabel}
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
          {selectedName ? `Selected: ${selectedName}` : emptyLabel}
        </Typography>
      </Stack>
    </Stack>
  );
}
