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
import { getPublicAppUrl } from "@/lib/admin-portal";
import { requireUserPage } from "@/lib/auth/guards";
import { createTranslator } from "@/lib/i18n";
import { getRequestLocale } from "@/lib/i18n/server";
import { getPublicBoxPath } from "@/lib/url";

export default async function DashboardQuestionsPage() {
  const viewer = await requireUserPage();
  const boxes = await listBoxesForOwner(viewer.id);
  const boxesWithShareUrls = await Promise.all(
    boxes.map(async (box) => ({
      box,
      shareUrl: await getPublicAppUrl(getPublicBoxPath(box.slug)),
    })),
  );
  const locale = await getRequestLocale();
  const t = createTranslator(locale);

  return (
    <UserDashboardShell viewer={viewer}>
      <Stack spacing={3}>
        <SectionCard
          className="motion-enter-soft"
          title={t("dashboard.myBoxesTitle")}
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
              boxesWithShareUrls.map(({ box, shareUrl }) => (
                <DashboardBoxCard key={box.id} box={box} shareUrl={shareUrl} />
              ))
            )}
          </Stack>
        </SectionCard>
      </Stack>
    </UserDashboardShell>
  );
}
