import { SettingsRounded } from "@mui/icons-material";
import { Grid, IconButton, Stack } from "@mui/material";
import { EmptyState } from "@/components/common/empty-state";
import { MetricCard } from "@/components/common/metric-card";
import { SectionCard } from "@/components/common/section-card";
import { OwnerQuestionCard } from "@/components/questions/owner-question-card";
import { UserDashboardShell } from "@/components/layout/user-dashboard-shell";
import { getBoxDetailForOwner } from "@/features/boxes/service";
import { requireUserPage } from "@/lib/auth/guards";
import { createTranslator } from "@/lib/i18n";
import { getRequestLocale } from "@/lib/i18n/server";

type BoxDetailPageProps = {
  params: Promise<{
    boxId: string;
  }>;
};

export default async function BoxDetailPage({ params }: BoxDetailPageProps) {
  const viewer = await requireUserPage();
  const { boxId } = await params;
  const box = await getBoxDetailForOwner(boxId, viewer.id);
  const locale = await getRequestLocale();
  const t = createTranslator(locale);
  const visibleQuestions = box.questions.filter((item) => item.status !== "DELETED");

  const pendingCount = visibleQuestions.filter((item) => item.status === "PENDING").length;
  const publishedCount = visibleQuestions.filter((item) => item.status === "PUBLISHED").length;

  return (
    <UserDashboardShell
      viewer={viewer}
      pageTitle={box.title}
      backHref="/dashboard/questions"
      pageAction={
        <IconButton
          href={`/dashboard/boxes/${box.id}/settings`}
          aria-label={t("dashboard.detailSettingsAria")}
        >
          <SettingsRounded />
        </IconButton>
      }
    >
      <Stack spacing={3}>
        <Grid container spacing={{ xs: 2, md: 3 }}>
          <Grid size={{ xs: 12, md: 4 }}>
            <MetricCard
              label={t("dashboard.metricTotalQuestions")}
              value={visibleQuestions.length}
              className="motion-enter-soft"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <MetricCard
              label={t("dashboard.metricPendingQuestions")}
              value={pendingCount}
              className="motion-enter-soft motion-delay-1"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <MetricCard
              label={t("dashboard.metricPublishedQuestions")}
              value={publishedCount}
              supporting={
                box.acceptingQuestions
                  ? t("dashboard.metricAccepting")
                  : t("dashboard.metricPaused")
              }
              className="motion-enter-soft motion-delay-2"
            />
          </Grid>
        </Grid>

        <SectionCard
          className="motion-enter-soft motion-delay-2"
          title={t("dashboard.detailQuestionsTitle")}
        >
          <Stack spacing={2}>
            {visibleQuestions.length === 0 ? (
              <EmptyState
                className="motion-enter motion-delay-3"
                title={t("dashboard.noQuestionsTitle")}
                description={t("dashboard.noQuestionsDescription")}
              />
            ) : (
              visibleQuestions.map((question) => (
                <OwnerQuestionCard
                  key={question.id}
                  boxId={box.id}
                  question={question}
                />
              ))
            )}
          </Stack>
        </SectionCard>
      </Stack>
    </UserDashboardShell>
  );
}
