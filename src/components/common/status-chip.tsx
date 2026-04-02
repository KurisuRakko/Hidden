import { Chip } from "@mui/material";

type StatusChipProps = {
  status: string;
};

const colorMap: Record<
  string,
  "default" | "primary" | "secondary" | "success" | "warning" | "error"
> = {
  ACTIVE: "success",
  DISABLED: "warning",
  BANNED: "error",
  HIDDEN: "secondary",
  PENDING: "warning",
  ANSWERED: "primary",
  PUBLISHED: "success",
  REJECTED: "default",
  DELETED: "error",
};

export function StatusChip({ status }: StatusChipProps) {
  return (
    <Chip
      label={status.replaceAll("_", " ")}
      color={colorMap[status] ?? "default"}
      size="small"
      variant={status === "REJECTED" ? "outlined" : "filled"}
      sx={{ fontWeight: 600 }}
    />
  );
}
