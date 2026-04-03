import {
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { SectionCard } from "@/components/common/section-card";
import { UserDashboardShell } from "@/components/layout/user-dashboard-shell";
import { DashboardLanguageSettingsCard } from "@/components/layout/dashboard-language-settings-card";
import { DashboardThemeSettingsCard } from "@/components/layout/dashboard-theme-settings-card";
import { loadDashboardMePageData } from "../_lib/load-dashboard-me-page";
import { DASHBOARD_ME_BACK_TRANSITION } from "../_lib/transitions";

export default async function DashboardMePreferencesPage() {
  const { viewer, t } = await loadDashboardMePageData();

  return (
    <UserDashboardShell
      viewer={viewer}
      pageTitle={t("dashboard.personalSettings.preferencesTitle")}
      back={{
        mode: "href",
        href: "/dashboard/me",
        transitionTypes: [DASHBOARD_ME_BACK_TRANSITION],
      }}
    >
      <Stack spacing={3} sx={{ maxWidth: 760 }}>
        <SectionCard
          className="motion-enter-soft"
          title={t("dashboard.personalSettings.preferencesTitle")}
        >
          <Stack spacing={2.5}>
            <Stack spacing={1.25}>
              <Typography variant="subtitle2">{t("dashboard.themeTitle")}</Typography>
              <DashboardThemeSettingsCard />
            </Stack>
            <Divider />
            <Stack spacing={1.25}>
              <Typography variant="subtitle2">{t("dashboard.languageTitle")}</Typography>
              <DashboardLanguageSettingsCard />
            </Stack>
          </Stack>
        </SectionCard>
      </Stack>
    </UserDashboardShell>
  );
}
