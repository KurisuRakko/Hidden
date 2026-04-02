import {
  Grid,
  Stack,
} from "@mui/material";
import { BoxForm } from "@/components/boxes/box-form";
import { DashboardBoxCard } from "@/components/boxes/dashboard-box-card";
import { EmptyState } from "@/components/common/empty-state";
import { SectionCard } from "@/components/common/section-card";
import { UserDashboardShell } from "@/components/layout/user-dashboard-shell";
import { listBoxesForOwner } from "@/features/boxes/service";
import { requireUserPage } from "@/lib/auth/guards";
import { createTranslator } from "@/lib/i18n";
import { getRequestLocale } from "@/lib/i18n/server";

export default async function DashboardNewBoxPage() {
  const viewer = await requireUserPage();
  const boxes = await listBoxesForOwner(viewer.id);
  const locale = await getRequestLocale();
  const t = createTranslator(locale);

  return (
    <UserDashboardShell viewer={viewer} pageTitle={t("dashboard.newBoxPageTitle")}>
      <Grid container spacing={{ xs: 2, md: 3 }}>
        <Grid size={{ xs: 12, xl: 6 }}>
          <SectionCard
            className="motion-enter-soft"
            title={t("dashboard.newBoxTitle")}
            description={t("dashboard.newBoxDescription")}
          >
            <BoxForm
              createRedirectMode="created"
              submitLabel={t("dashboard.boxForm.publish")}
            />
          </SectionCard>
        </Grid>
        <Grid size={{ xs: 12, xl: 6 }}>
          <SectionCard
            className="motion-enter-soft motion-delay-1"
            title={t("dashboard.existingBoxesTitle")}
            description={t("dashboard.existingBoxesDescription")}
          >
            <Stack spacing={2}>
              {boxes.length === 0 ? (
                <EmptyState
                  title={t("dashboard.existingBoxesEmptyTitle")}
                  description={t("dashboard.existingBoxesEmptyDescription")}
                />
              ) : (
                boxes.slice(0, 4).map((box) => <DashboardBoxCard key={box.id} box={box} />)
              )}
            </Stack>
          </SectionCard>
        </Grid>
      </Grid>
    </UserDashboardShell>
  );
}
