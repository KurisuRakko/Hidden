import Link from "next/link";
import { SettingsRounded } from "@mui/icons-material";
import { Grid, IconButton, Stack } from "@mui/material";
import { EmptyState } from "@/components/common/empty-state";
import { MetricCard } from "@/components/common/metric-card";
import { SectionCard } from "@/components/common/section-card";
import { OwnerQuestionCard } from "@/components/questions/owner-question-card";
import { UserDashboardShell } from "@/components/layout/user-dashboard-shell";
import { getBoxDetailForOwner } from "@/features/boxes/service";
import { requireUserPage } from "@/lib/auth/guards";

type BoxDetailPageProps = {
  params: Promise<{
    boxId: string;
  }>;
};

export default async function BoxDetailPage({ params }: BoxDetailPageProps) {
  const viewer = await requireUserPage();
  const { boxId } = await params;
  const box = await getBoxDetailForOwner(boxId, viewer.id);
  const visibleQuestions = box.questions.filter((item) => item.status !== "DELETED");

  const pendingCount = visibleQuestions.filter((item) => item.status === "PENDING").length;
  const publishedCount = visibleQuestions.filter((item) => item.status === "PUBLISHED").length;

  return (
    <UserDashboardShell
      viewer={viewer}
      pageTitle={box.title}
      pageAction={
        <IconButton
          component={Link}
          href={`/dashboard/boxes/${box.id}/settings`}
          aria-label="提问箱设置"
        >
          <SettingsRounded />
        </IconButton>
      }
    >
      <Stack spacing={3}>
        <Grid container spacing={{ xs: 2, md: 3 }}>
          <Grid size={{ xs: 12, md: 4 }}>
            <MetricCard
              label="问题总数"
              value={visibleQuestions.length}
              className="motion-enter-soft"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <MetricCard
              label="未审核提问"
              value={pendingCount}
              className="motion-enter-soft motion-delay-1"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <MetricCard
              label="已发布提问"
              value={publishedCount}
              supporting={box.acceptingQuestions ? "当前仍可继续接收提问" : "当前暂停接收提问"}
              className="motion-enter-soft motion-delay-2"
            />
          </Grid>
        </Grid>

        <SectionCard
          className="motion-enter-soft motion-delay-2"
          title="提问"
          description="这里会展示这个提问箱里当前收到的内容，你可以回复并决定是否屏蔽。"
        >
          <Stack spacing={2}>
            {visibleQuestions.length === 0 ? (
              <EmptyState
                className="motion-enter motion-delay-3"
                title="还没有提问"
                description="当有人向这个提问箱提交内容后，它们会出现在这里。"
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
