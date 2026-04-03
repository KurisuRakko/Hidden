import {
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { ChangePasswordForm } from "@/components/auth/change-password-form";
import { LogoutButton } from "@/components/common/logout-button";
import { SectionCard } from "@/components/common/section-card";
import { DashboardLanguageSettingsCard } from "@/components/layout/dashboard-language-settings-card";
import { DashboardThemeSettingsCard } from "@/components/layout/dashboard-theme-settings-card";
import { UserDashboardShell } from "@/components/layout/user-dashboard-shell";
import { requireUserPage } from "@/lib/auth/guards";
import { formatDateTime } from "@/lib/format";
import {
  createTranslator,
  getRoleLabel,
} from "@/lib/i18n";
import { getRequestLocale } from "@/lib/i18n/server";

export default async function DashboardMePage() {
  const viewer = await requireUserPage();
  const locale = await getRequestLocale();
  const t = createTranslator(locale);

  return (
    <UserDashboardShell viewer={viewer} pageTitle={t("common.nav.me")}>
      <Grid container spacing={{ xs: 2, md: 3 }}>
        <Grid size={{ xs: 12, xl: 5 }}>
          <Stack spacing={3}>
            <SectionCard
              className="motion-enter-soft"
              title={t("dashboard.accountInfoTitle")}
            >
              <Stack spacing={1.25}>
                <Typography>
                  {t("dashboard.accountPhone", { phone: viewer.phone })}
                </Typography>
                <Typography color="text.secondary">
                  {t("dashboard.accountRole", {
                    role: getRoleLabel(viewer.role, locale),
                  })}
                </Typography>
                <Typography color="text.secondary">
                  {t("dashboard.accountCreatedAt", {
                    value: formatDateTime(viewer.createdAt, locale),
                  })}
                </Typography>
              </Stack>
            </SectionCard>

            <SectionCard
              className="motion-enter-soft motion-delay-1"
              title={t("dashboard.themeTitle")}
            >
              <DashboardThemeSettingsCard />
            </SectionCard>

            <SectionCard
              className="motion-enter-soft motion-delay-2"
              title={t("dashboard.languageTitle")}
            >
              <DashboardLanguageSettingsCard />
            </SectionCard>
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, xl: 7 }}>
          <Stack spacing={3}>
            <SectionCard
              className="motion-enter-soft motion-delay-1"
              title={t("dashboard.passwordTitle")}
            >
              <ChangePasswordForm />
            </SectionCard>

            <SectionCard
              className="motion-enter-soft motion-delay-3"
              title={t("dashboard.logoutTitle")}
            >
              <LogoutButton
                variant="outlined"
                redirectTo="/"
                label={t("common.actions.signOut")}
                sx={{ width: { xs: "100%", sm: "auto" } }}
              />
            </SectionCard>
          </Stack>
        </Grid>
      </Grid>
    </UserDashboardShell>
  );
}
