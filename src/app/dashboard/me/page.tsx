import {
  ManageAccountsRounded,
  PaletteRounded,
  ShieldRounded,
} from "@mui/icons-material";
import { Stack, Typography } from "@mui/material";
import { UserDashboardShell } from "@/components/layout/user-dashboard-shell";
import { DashboardAccountInfo } from "./_components/dashboard-account-info";
import { DashboardPreferencesSummary } from "./_components/dashboard-preferences-summary";
import { PersonalSettingsEntryCard } from "./_components/personal-settings-entry-card";
import { loadDashboardMePageData } from "./_lib/load-dashboard-me-page";
import { DASHBOARD_ME_FORWARD_TRANSITION } from "./_lib/transitions";

export default async function DashboardMePage() {
  const { viewer, locale, t } = await loadDashboardMePageData();

  return (
    <UserDashboardShell
      viewer={viewer}
      pageTitle={t("dashboard.meSettingsTitle")}
    >
      <Stack spacing={{ xs: 2, md: 2.5 }} sx={{ maxWidth: 760 }}>
        <Typography color="text.secondary" className="motion-enter-soft">
          {t("dashboard.meSettingsDescription")}
        </Typography>

        <PersonalSettingsEntryCard
          href="/dashboard/me/account"
          title={t("dashboard.personalSettings.accountTitle")}
          description={t("dashboard.personalSettings.accountDescription")}
          icon={<ManageAccountsRounded />}
          summary={<DashboardAccountInfo viewer={viewer} locale={locale} compact />}
          transitionTypes={[DASHBOARD_ME_FORWARD_TRANSITION]}
          className="motion-enter-soft motion-delay-1"
        />

        <PersonalSettingsEntryCard
          href="/dashboard/me/preferences"
          title={t("dashboard.personalSettings.preferencesTitle")}
          description={t("dashboard.personalSettings.preferencesDescription")}
          icon={<PaletteRounded />}
          summary={<DashboardPreferencesSummary />}
          transitionTypes={[DASHBOARD_ME_FORWARD_TRANSITION]}
          className="motion-enter-soft motion-delay-2"
        />

        <PersonalSettingsEntryCard
          href="/dashboard/me/security"
          title={t("dashboard.personalSettings.securityTitle")}
          description={t("dashboard.personalSettings.securityDescription")}
          icon={<ShieldRounded />}
          summary={(
            <Stack spacing={0.75}>
              <Typography variant="body2">
                {t("dashboard.passwordTitle")}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t("dashboard.logoutTitle")}
              </Typography>
            </Stack>
          )}
          transitionTypes={[DASHBOARD_ME_FORWARD_TRANSITION]}
          className="motion-enter-soft motion-delay-3"
        />
      </Stack>
    </UserDashboardShell>
  );
}
