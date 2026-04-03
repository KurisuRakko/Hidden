import { Stack } from "@mui/material";
import { SectionCard } from "@/components/common/section-card";
import { UserDashboardShell } from "@/components/layout/user-dashboard-shell";
import { DashboardAccountInfo } from "../_components/dashboard-account-info";
import { loadDashboardMePageData } from "../_lib/load-dashboard-me-page";
import { DASHBOARD_ME_BACK_TRANSITION } from "../_lib/transitions";

export default async function DashboardMeAccountPage() {
  const { viewer, accountSummary, t } = await loadDashboardMePageData();

  return (
    <UserDashboardShell
      viewer={viewer}
      pageTitle={t("dashboard.personalSettings.accountTitle")}
      back={{
        mode: "href",
        href: "/dashboard/me",
        transitionTypes: [DASHBOARD_ME_BACK_TRANSITION],
      }}
    >
      <Stack spacing={3} sx={{ maxWidth: 760 }}>
        <SectionCard
          className="motion-enter-soft"
          title={t("dashboard.accountInfoTitle")}
        >
          <DashboardAccountInfo {...accountSummary} />
        </SectionCard>
      </Stack>
    </UserDashboardShell>
  );
}
