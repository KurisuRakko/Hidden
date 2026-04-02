import {
  Button,
  Grid,
  Stack,
} from "@mui/material";
import { ArrowBackRounded, OpenInNewRounded } from "@mui/icons-material";
import { BoxForm } from "@/components/boxes/box-form";
import { BoxShareActions } from "@/components/boxes/box-share-actions";
import { SectionCard } from "@/components/common/section-card";
import { UserDashboardShell } from "@/components/layout/user-dashboard-shell";
import {
  getBoxDetailForOwner,
  getBoxSummaryForOwner,
} from "@/features/boxes/service";
import { getPublicAppUrl } from "@/lib/admin-portal";
import { requireUserPage } from "@/lib/auth/guards";
import {
  createTranslator,
  getStatusLabel,
} from "@/lib/i18n";
import { getRequestLocale } from "@/lib/i18n/server";

type BoxSettingsPageProps = {
  params: Promise<{
    boxId: string;
  }>;
};

export default async function BoxSettingsPage({
  params,
}: BoxSettingsPageProps) {
  const viewer = await requireUserPage();
  const locale = await getRequestLocale();
  const t = createTranslator(locale);
  const { boxId } = await params;
  const [box, boxSummary] = await Promise.all([
    getBoxDetailForOwner(boxId, viewer.id),
    getBoxSummaryForOwner(boxId, viewer.id),
  ]);
  const shareUrl = await getPublicAppUrl(`/b/${box.slug}`);

  return (
    <UserDashboardShell viewer={viewer} pageTitle={box.title}>
      <Grid container spacing={{ xs: 2, md: 3 }}>
        <Grid size={{ xs: 12, xl: 7 }}>
          <SectionCard
            className="motion-enter-soft"
            title={t("dashboard.settingsTitle")}
            description={t("dashboard.settingsDescription")}
          >
            <Stack spacing={2}>
              <Button
                href={`/dashboard/boxes/${box.id}`}
                startIcon={<ArrowBackRounded />}
                variant="text"
                sx={{ width: { xs: "100%", sm: "auto" } }}
              >
                {t("dashboard.backToQuestions")}
              </Button>
              <BoxForm
                initialValues={{
                  id: box.id,
                  title: box.title,
                  description: box.description,
                  slug: box.slug,
                  wallpaperUrl: box.wallpaperUrl,
                  acceptingQuestions: box.acceptingQuestions,
                  status: box.status === "DISABLED" ? "HIDDEN" : box.status,
                }}
              />
            </Stack>
          </SectionCard>
        </Grid>
        <Grid size={{ xs: 12, xl: 5 }}>
          <Stack spacing={3}>
            <SectionCard
              className="motion-enter-soft motion-delay-1"
              title={t("dashboard.publicPageTitle")}
              description={t("dashboard.publicPageDescription")}
            >
              <Stack spacing={2}>
                <Button
                  href={`/b/${box.slug}`}
                  target="_blank"
                  startIcon={<OpenInNewRounded />}
                  variant="outlined"
                  sx={{ width: { xs: "100%", sm: "auto" } }}
                >
                  {t("common.actions.openPublicPage")}
                </Button>
                <BoxShareActions shareUrl={shareUrl} />
              </Stack>
            </SectionCard>
            <SectionCard
              className="motion-enter-soft motion-delay-2"
              title={t("dashboard.summaryTitle")}
              description={t("dashboard.summaryDescription")}
            >
              <Stack spacing={1}>
                <div>
                  {t("dashboard.summaryStatus", {
                    value: getStatusLabel(boxSummary.status, locale),
                  })}
                </div>
                <div>
                  {t("dashboard.summaryAccepting", {
                    value: boxSummary.acceptingQuestions
                      ? t("dashboard.acceptingOn")
                      : t("dashboard.acceptingOff"),
                  })}
                </div>
                <div>
                  {t("dashboard.summaryWallpaper", {
                    value: boxSummary.wallpaperUrl
                      ? t("dashboard.wallpaperSet")
                      : t("dashboard.wallpaperUnset"),
                  })}
                </div>
                <div>
                  {t("dashboard.summaryQuestions", {
                    count: boxSummary._count.questions,
                  })}
                </div>
              </Stack>
            </SectionCard>
          </Stack>
        </Grid>
      </Grid>
    </UserDashboardShell>
  );
}
