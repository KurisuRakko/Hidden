import {
  Alert,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { ChangePasswordForm } from "@/components/auth/change-password-form";
import { LogoutButton } from "@/components/common/logout-button";
import { SectionCard } from "@/components/common/section-card";
import { UserDashboardShell } from "@/components/layout/user-dashboard-shell";
import { loadDashboardMePageData } from "../_lib/load-dashboard-me-page";
import { DASHBOARD_ME_BACK_TRANSITION } from "../_lib/transitions";

export default async function DashboardMeSecurityPage() {
  const { viewer, oidcProviderLabel, t } = await loadDashboardMePageData();

  return (
    <UserDashboardShell
      viewer={viewer}
      pageTitle={t("dashboard.personalSettings.securityTitle")}
      back={{
        mode: "href",
        href: "/dashboard/me",
        transitionTypes: [DASHBOARD_ME_BACK_TRANSITION],
      }}
    >
      <Stack spacing={3} sx={{ maxWidth: 760 }}>
        <SectionCard
          className="motion-enter-soft"
          title={t("dashboard.personalSettings.securityTitle")}
        >
          <Stack spacing={3}>
            <Stack spacing={1.25}>
              <Typography variant="subtitle2">{t("dashboard.passwordTitle")}</Typography>
              {viewer.hasPassword ? (
                <ChangePasswordForm />
              ) : (
                <Alert severity="info">
                  {t("dashboard.passwordManagedByOidcDescription", {
                    provider: oidcProviderLabel,
                  })}
                </Alert>
              )}
            </Stack>
            <Divider />
            <Stack spacing={1.25}>
              <Typography variant="subtitle2">{t("dashboard.logoutTitle")}</Typography>
              <Typography color="text.secondary">
                {t("dashboard.logoutDescription")}
              </Typography>
              <LogoutButton
                variant="outlined"
                redirectTo="/"
                label={t("common.actions.signOut")}
                sx={{ width: { xs: "100%", sm: "auto" } }}
              />
            </Stack>
          </Stack>
        </SectionCard>
      </Stack>
    </UserDashboardShell>
  );
}
