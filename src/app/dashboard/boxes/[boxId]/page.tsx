import { SettingsRounded } from "@mui/icons-material";
import {
  Box,
  Button,
  Stack,
  Typography,
} from "@mui/material";
import { EmptyState } from "@/components/common/empty-state";
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
  const summaryItems = [
    {
      label: t("dashboard.summaryAcceptingLabel"),
      value: box.acceptingQuestions
        ? t("dashboard.metricAccepting")
        : t("dashboard.metricPaused"),
    },
    {
      label: t("dashboard.metricTotalQuestions"),
      value: String(visibleQuestions.length),
    },
    {
      label: t("dashboard.metricPendingQuestions"),
      value: String(pendingCount),
    },
    {
      label: t("dashboard.metricPublishedQuestions"),
      value: String(publishedCount),
    },
  ];

  return (
    <UserDashboardShell
      viewer={viewer}
      pageTitle={box.title}
      backHref="/dashboard/questions"
    >
      <Stack spacing={3}>
        <SectionCard
          className="motion-enter-soft"
          title={t("dashboard.settingsTitle")}
          description={t("dashboard.detailManageDescription")}
          action={
            <Button
              href={`/dashboard/boxes/${box.id}/settings`}
              startIcon={<SettingsRounded />}
              variant="contained"
              sx={{ width: { xs: "100%", sm: "auto" } }}
            >
              {t("dashboard.detailSettingsAction")}
            </Button>
          }
          variant="secondary"
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={{ xs: 1.5, sm: 2 }}
            useFlexGap
            flexWrap="wrap"
          >
            {summaryItems.map((item) => (
              <Box
                key={item.label}
                sx={(theme) => ({
                  minWidth: { xs: "100%", sm: 160 },
                  flex: "1 1 160px",
                  px: 1.5,
                  py: 1.25,
                  borderRadius: 1.5,
                  bgcolor: theme.palette.action.hover,
                  border: `1px solid ${theme.palette.divider}`,
                })}
              >
                <Typography variant="overline" color="text.secondary">
                  {item.label}
                </Typography>
                <Typography sx={{ mt: 0.25 }}>{item.value}</Typography>
              </Box>
            ))}
          </Stack>
        </SectionCard>

        <SectionCard
          className="motion-enter-soft motion-delay-1"
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
