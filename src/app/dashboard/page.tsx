import Link from "next/link";
import { Button, Grid, Stack, Typography } from "@mui/material";
import { MetricCard } from "@/components/common/metric-card";
import { SectionCard } from "@/components/common/section-card";
import { requireUserPage } from "@/lib/auth/guards";
import { prisma } from "@/lib/db";

export default async function DashboardOverviewPage() {
  const viewer = await requireUserPage();

  const [boxCount, pendingCount, publishedCount, latestBoxes] = await Promise.all([
    prisma.questionBox.count({
      where: { ownerId: viewer.id },
    }),
    prisma.question.count({
      where: {
        box: {
          ownerId: viewer.id,
        },
        status: "PENDING",
      },
    }),
    prisma.question.count({
      where: {
        box: {
          ownerId: viewer.id,
        },
        status: "PUBLISHED",
      },
    }),
    prisma.questionBox.findMany({
      where: { ownerId: viewer.id },
      orderBy: { updatedAt: "desc" },
      take: 5,
    }),
  ]);

  return (
    <Stack spacing={3}>
      <Grid container spacing={{ xs: 2, md: 3 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <MetricCard
            label="Question boxes"
            value={boxCount}
            className="motion-enter-soft"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <MetricCard
            label="Pending questions"
            value={pendingCount}
            className="motion-enter-soft motion-delay-1"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <MetricCard
            label="Published answers"
            value={publishedCount}
            className="motion-enter-soft motion-delay-2"
          />
        </Grid>
      </Grid>

      <SectionCard
        className="motion-enter-soft motion-delay-2"
        title="Recently updated boxes"
        description="Open any box to review pending questions and publish answers."
      >
        <Stack spacing={2}>
          {latestBoxes.length === 0 ? (
            <Typography color="text.secondary">
              You have not created any question boxes yet.
            </Typography>
          ) : (
            latestBoxes.map((box, index) => (
              <Stack
                key={box.id}
                direction={{ xs: "column", md: "row" }}
                justifyContent="space-between"
                spacing={{ xs: 1.5, md: 2 }}
                className={`interactive-panel motion-enter-soft motion-delay-${Math.min(
                  3,
                  index + 1,
                )}`}
                sx={{
                  px: { xs: 1.75, sm: 2 },
                  py: { xs: 1.75, sm: 2.25 },
                  borderRadius: "18px",
                  bgcolor: "rgba(255, 255, 255, 0.6)",
                  border: "1px solid rgba(32, 34, 39, 0.06)",
                }}
              >
                <Stack spacing={0.55}>
                  <Typography variant="h6">{box.title}</Typography>
                  <Typography
                    color="text.secondary"
                    className="text-break"
                    sx={{ fontSize: "0.95rem" }}
                  >
                    /b/{box.slug}
                  </Typography>
                </Stack>
                <Button
                  component={Link}
                  href={`/dashboard/boxes/${box.id}`}
                  sx={{ width: { xs: "100%", md: "auto" }, alignSelf: { xs: "stretch", md: "center" } }}
                >
                  Open box
                </Button>
              </Stack>
            ))
          )}
          <Button
            component={Link}
            href="/dashboard/boxes"
            variant="contained"
            sx={{ width: { xs: "100%", sm: "auto" } }}
          >
            Manage all boxes
          </Button>
        </Stack>
      </SectionCard>
    </Stack>
  );
}
