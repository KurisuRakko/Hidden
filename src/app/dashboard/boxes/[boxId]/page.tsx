import { SettingsRounded } from "@mui/icons-material";
import {
  Box,
  Button,
  Stack,
  Typography,
} from "@mui/material";
import { EmptyState } from "@/components/common/empty-state";
import { SectionCard } from "@/components/common/section-card";
import { UserDashboardShell } from "@/components/layout/user-dashboard-shell";
import { getBoxDetailForOwner } from "@/features/boxes/service";
import { requireUserPage } from "@/lib/auth/guards";
import { formatDateTime } from "@/lib/format";
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
  const safeQuestions = visibleQuestions.map((item) => ({
    id: item.id,
    content: item.content,
    imageUrl: item.imageUrl,
    status: item.status,
    submittedAtLabel: t("dashboard.ownerQuestion.submittedAt", {
      value: formatDateTime(item.submittedAt, locale),
    }),
    publishedAtLabel: item.publishedAt
      ? t("dashboard.ownerQuestion.publishedAt", {
          value: formatDateTime(item.publishedAt, locale),
        })
      : null,
    answer: item.answer
      ? {
          content: item.answer.content,
          imageUrl: item.answer.imageUrl,
        }
      : null,
  }));

  const pendingCount = safeQuestions.filter((item) => item.status === "PENDING").length;
  const publishedCount = safeQuestions.filter((item) => item.status === "PUBLISHED").length;
  const summaryItems = [
    {
      label: t("dashboard.summaryAcceptingLabel"),
      value: box.acceptingQuestions
        ? t("dashboard.metricAccepting")
        : t("dashboard.metricPaused"),
    },
    {
      label: t("dashboard.metricTotalQuestions"),
      value: String(safeQuestions.length),
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
  const questionList = safeQuestions.length > 0
    ? await import("./_components/box-question-list")
    : null;
  const QuestionList = questionList?.BoxQuestionList;

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
                sx={{
                  minWidth: { xs: "100%", sm: 160 },
                  flex: "1 1 160px",
                  px: 1.5,
                  py: 1.25,
                  borderRadius: 1.5,
                  bgcolor: "action.hover",
                  border: "1px solid",
                  borderColor: "divider",
                }}
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
          {safeQuestions.length === 0 ? (
            <EmptyState
              className="motion-enter motion-delay-3"
              title={t("dashboard.noQuestionsTitle")}
              description={t("dashboard.noQuestionsDescription")}
            />
          ) : QuestionList ? (
            <QuestionList boxId={box.id} questions={safeQuestions} />
          ) : null}
        </SectionCard>
      </Stack>
    </UserDashboardShell>
  );
}
