import {
  Stack,
} from "@mui/material";
import { CheckCircleRounded } from "@mui/icons-material";
import { BoxShareActions } from "@/components/boxes/box-share-actions";
import { SectionCard } from "@/components/common/section-card";
import { UserDashboardShell } from "@/components/layout/user-dashboard-shell";
import { getBoxSummaryForOwner } from "@/features/boxes/service";
import { getPublicAppUrl } from "@/lib/admin-portal";
import { requireUserPage } from "@/lib/auth/guards";
import { createTranslator } from "@/lib/i18n";
import { getRequestLocale } from "@/lib/i18n/server";
import { getPublicBoxPath } from "@/lib/url";

type CreatedPageProps = {
  params: Promise<{
    boxId: string;
  }>;
};

export default async function BoxCreatedPage({ params }: CreatedPageProps) {
  const viewer = await requireUserPage();
  const { boxId } = await params;
  const box = await getBoxSummaryForOwner(boxId, viewer.id);
  const shareUrl = await getPublicAppUrl(getPublicBoxPath(box.slug));
  const locale = await getRequestLocale();
  const t = createTranslator(locale);

  return (
    <UserDashboardShell
      viewer={viewer}
      pageTitle={t("dashboard.createdPageTitle")}
      backHref={`/dashboard/boxes/${box.id}`}
    >
      <SectionCard
        className="motion-enter-soft"
        title={box.title}
      >
        <Stack spacing={2.5}>
          <Stack direction="row" spacing={1.25} alignItems="center">
            <CheckCircleRounded color="success" />
            <span>{t("dashboard.createdSuccess")}</span>
          </Stack>
          <BoxShareActions
            shareUrl={shareUrl}
            manageHref={`/dashboard/boxes/${box.id}`}
          />
        </Stack>
      </SectionCard>
    </UserDashboardShell>
  );
}
