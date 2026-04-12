import { Stack, Typography } from "@mui/material";

type DashboardAccountInfoProps = {
  identifierLabel: string;
  roleLabel: string;
  createdAtLabel: string;
  compact?: boolean;
};

export function DashboardAccountInfo({
  identifierLabel,
  roleLabel,
  createdAtLabel,
  compact = false,
}: DashboardAccountInfoProps) {
  const primaryVariant = compact ? "body2" : "body1";
  const secondaryVariant = compact ? "body2" : "body1";

  return (
    <Stack spacing={compact ? 0.75 : 1.25}>
      <Typography variant={primaryVariant}>{identifierLabel}</Typography>
      <Typography color="text.secondary" variant={secondaryVariant}>{roleLabel}</Typography>
      <Typography color="text.secondary" variant={secondaryVariant}>{createdAtLabel}</Typography>
    </Stack>
  );
}
