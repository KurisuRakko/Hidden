import Link from "next/link";
import { OpenInNewRounded } from "@mui/icons-material";
import { Button, Grid, Stack } from "@mui/material";
import { BoxForm } from "@/components/boxes/box-form";
import { EmptyState } from "@/components/common/empty-state";
import { MetricCard } from "@/components/common/metric-card";
import { SectionCard } from "@/components/common/section-card";
import { QuestionReviewCard } from "@/components/questions/question-review-card";
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

  const pendingCount = box.questions.filter((item) => item.status === "PENDING").length;
  const publishedCount = box.questions.filter((item) => item.status === "PUBLISHED").length;

  return (
    <Stack spacing={3}>
      <Grid container spacing={{ xs: 2, md: 3 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <MetricCard label="Pending" value={pendingCount} className="motion-enter" />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <MetricCard
            label="Published"
            value={publishedCount}
            className="motion-enter motion-delay-1"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <MetricCard
            label="Public page"
            value={`/b/${box.slug}`}
            className="motion-enter motion-delay-2"
            supporting={
              box.acceptingQuestions ? "Open for new submissions" : "Submission closed"
            }
          />
        </Grid>
      </Grid>

      <Grid container spacing={{ xs: 2, md: 3 }}>
        <Grid size={{ xs: 12, xl: 4 }}>
          <SectionCard
            className="motion-enter motion-delay-1"
            title="Box settings"
            description="Update the title, description, slug, visibility, and submission status."
          >
            <Stack spacing={2}>
              <Button
                component={Link}
                href={`/b/${box.slug}`}
                target="_blank"
                startIcon={<OpenInNewRounded />}
                sx={{ width: { xs: "100%", sm: "auto" } }}
              >
                Open public page
              </Button>
              <BoxForm
                initialValues={{
                  id: box.id,
                  title: box.title,
                  description: box.description,
                  slug: box.slug,
                  acceptingQuestions: box.acceptingQuestions,
                  status: box.status === "DISABLED" ? "HIDDEN" : box.status,
                }}
              />
            </Stack>
          </SectionCard>
        </Grid>
        <Grid size={{ xs: 12, xl: 8 }}>
          <SectionCard
            className="motion-enter motion-delay-2"
            title="Question moderation"
            description="Review incoming questions, draft answers, and publish the ones worth sharing."
          >
            <Stack spacing={2}>
              {box.questions.length === 0 ? (
                <EmptyState
                  className="motion-enter motion-delay-3"
                  title="No questions yet"
                  description="When visitors submit to this box, they will appear here for review."
                />
              ) : (
                box.questions.map((question) => (
                  <QuestionReviewCard
                    key={question.id}
                    boxId={box.id}
                    question={question}
                  />
                ))
              )}
            </Stack>
          </SectionCard>
        </Grid>
      </Grid>
    </Stack>
  );
}
