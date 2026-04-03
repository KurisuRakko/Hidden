import {
  Button,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { OpenInNewRounded } from "@mui/icons-material";
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
import { getPublicBoxPath } from "@/lib/url";

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
  const publicPath = getPublicBoxPath(box.slug);
  const shareUrl = await getPublicAppUrl(publicPath);

  return (
    <UserDashboardShell
      viewer={viewer}
      pageTitle={box.title}
      backHref={`/dashboard/boxes/${box.id}`}
    >
      <Grid container spacing={{ xs: 2, md: 3 }}>
        <Grid size={{ xs: 12, xl: 7 }}>
          <SectionCard
            className="motion-enter-soft"
            title={t("dashboard.settingsTitle")}
          >
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
          </SectionCard>
        </Grid>
        <Grid size={{ xs: 12, xl: 5 }}>
          <SectionCard
            className="motion-enter-soft motion-delay-1"
            title={t("dashboard.publicPageTitle")}
            description={t("dashboard.publicPageDescription")}
            variant="secondary"
          >
            <Stack spacing={2.5}>
              <Button
                href={publicPath}
                target="_blank"
                startIcon={<OpenInNewRounded />}
                variant="outlined"
                sx={{ width: { xs: "100%", sm: "auto" } }}
              >
                {t("common.actions.openPublicPage")}
              </Button>
              <BoxShareActions shareUrl={shareUrl} />
              <Divider />
              <Stack spacing={1.25}>
                <Typography variant="subtitle2">{t("dashboard.summaryTitle")}</Typography>
                <Typography color="text.secondary">
                  {t("dashboard.summaryStatus", {
                    value: getStatusLabel(boxSummary.status, locale),
                  })}
                </Typography>
                <Typography color="text.secondary">
                  {t("dashboard.summaryAccepting", {
                    value: boxSummary.acceptingQuestions
                      ? t("dashboard.acceptingOn")
                      : t("dashboard.acceptingOff"),
                  })}
                </Typography>
                <Typography color="text.secondary">
                  {t("dashboard.summaryWallpaper", {
                    value: boxSummary.wallpaperUrl
                      ? t("dashboard.wallpaperSet")
                      : t("dashboard.wallpaperUnset"),
                  })}
                </Typography>
                <Typography color="text.secondary">
                  {t("dashboard.summaryQuestions", {
                    count: boxSummary._count.questions,
                  })}
                </Typography>
              </Stack>
            </Stack>
          </SectionCard>
        </Grid>
      </Grid>
    </UserDashboardShell>
  );
}
