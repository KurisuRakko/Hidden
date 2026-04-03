import { Stack, Typography } from "@mui/material";
import { formatDateTime } from "@/lib/format";
import { type Locale } from "@/lib/i18n";
import { createTranslator, getRoleLabel } from "@/lib/i18n";

type DashboardAccountInfoProps = {
  viewer: {
    phone: string;
    role: string;
    createdAt: Date;
  };
  locale: Locale;
  compact?: boolean;
};

export function DashboardAccountInfo({
  viewer,
  locale,
  compact = false,
}: DashboardAccountInfoProps) {
  const t = createTranslator(locale);
  const primaryVariant = compact ? "body2" : "body1";
  const secondaryVariant = compact ? "body2" : "body1";

  return (
    <Stack spacing={compact ? 0.75 : 1.25}>
      <Typography variant={primaryVariant}>
        {t("dashboard.accountPhone", { phone: viewer.phone })}
      </Typography>
      <Typography color="text.secondary" variant={secondaryVariant}>
        {t("dashboard.accountRole", {
          role: getRoleLabel(viewer.role, locale),
        })}
      </Typography>
      <Typography color="text.secondary" variant={secondaryVariant}>
        {t("dashboard.accountCreatedAt", {
          value: formatDateTime(viewer.createdAt, locale),
        })}
      </Typography>
    </Stack>
  );
}
