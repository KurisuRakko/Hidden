import {
  Button,
  Stack,
} from "@mui/material";
import { AddRounded } from "@mui/icons-material";
import { DashboardBoxCard } from "@/components/boxes/dashboard-box-card";
import { EmptyState } from "@/components/common/empty-state";
import { SectionCard } from "@/components/common/section-card";
import { UserDashboardShell } from "@/components/layout/user-dashboard-shell";
import { listBoxesForOwner } from "@/features/boxes/service";
import { requireUserPage } from "@/lib/auth/guards";
import { createTranslator } from "@/lib/i18n";
import { getRequestLocale } from "@/lib/i18n/server";

export default async function DashboardQuestionsPage() {
  const viewer = await requireUserPage();
  const boxes = await listBoxesForOwner(viewer.id);
  const locale = await getRequestLocale();
  const t = createTranslator(locale);

  return (
    <UserDashboardShell viewer={viewer}>
      <Stack spacing={3}>
        <SectionCard
          className="motion-enter-soft"
          title={t("dashboard.myBoxesTitle")}
          description={t("dashboard.myBoxesDescription")}
        >
          <Stack spacing={2}>
            <Button
              href="/dashboard/boxes/new"
              startIcon={<AddRounded />}
              variant="contained"
              sx={{ width: { xs: "100%", sm: "auto" } }}
            >
              {t("common.nav.createBox")}
            </Button>

            {boxes.length === 0 ? (
              <EmptyState
                title={t("dashboard.noBoxesTitle")}
                description={t("dashboard.noBoxesDescription")}
              />
            ) : (
              boxes.map((box) => <DashboardBoxCard key={box.id} box={box} />)
            )}
          </Stack>
        </SectionCard>
      </Stack>
    </UserDashboardShell>
  );
}
