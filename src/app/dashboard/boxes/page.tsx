import Link from "next/link";
import { Button, Grid, Stack, Typography } from "@mui/material";
import { BoxForm } from "@/components/boxes/box-form";
import { EmptyState } from "@/components/common/empty-state";
import { SectionCard } from "@/components/common/section-card";
import { StatusChip } from "@/components/common/status-chip";
import { listBoxesForOwner } from "@/features/boxes/service";
import { requireUserPage } from "@/lib/auth/guards";

export default async function DashboardBoxesPage() {
  const viewer = await requireUserPage();
  const boxes = await listBoxesForOwner(viewer.id);

  return (
    <Grid container spacing={{ xs: 2, md: 3 }}>
      <Grid size={{ xs: 12, xl: 4 }}>
        <SectionCard
          className="motion-pop"
          title="Create a new box"
          description="Each box gets its own public URL and moderation queue."
        >
          <BoxForm />
        </SectionCard>
      </Grid>
      <Grid size={{ xs: 12, xl: 8 }}>
        <SectionCard
          className="motion-enter-soft motion-delay-1"
          title="Your boxes"
          description="Manage titles, slugs, submission settings, and moderation from here."
        >
          <Stack spacing={2}>
            {boxes.length === 0 ? (
              <EmptyState
                className="motion-enter-soft motion-delay-2"
                title="No question boxes yet"
                description="Create your first box on the left to start receiving anonymous questions."
              />
            ) : (
              boxes.map((box, index) => (
                <Stack
                  key={box.id}
                  direction={{ xs: "column", md: "row" }}
                  justifyContent="space-between"
                  spacing={{ xs: 1.75, md: 2 }}
                  className={`interactive-panel motion-enter-soft motion-delay-${Math.min(
                    4,
                    index + 1,
                  )}`}
                  sx={{
                    px: { xs: 1.75, sm: 2.25, md: 2.5 },
                    py: { xs: 1.75, sm: 2.25, md: 2.5 },
                    borderRadius: "18px",
                    bgcolor: "rgba(255, 255, 255, 0.64)",
                    border: "1px solid rgba(32, 34, 39, 0.06)",
                  }}
                >
                  <Stack spacing={0.9} sx={{ minWidth: 0 }}>
                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      spacing={1}
                      alignItems={{ xs: "flex-start", sm: "center" }}
                    >
                      <Typography variant="h6">{box.title}</Typography>
                      <StatusChip status={box.status} />
                    </Stack>
                    <Typography color="text.secondary" className="text-break">
                      /b/{box.slug}
                    </Typography>
                    <Typography
                      color="text.secondary"
                      className="text-break"
                      sx={{ fontSize: "0.95rem" }}
                    >
                      {box.description || "No description yet."}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {box.acceptingQuestions
                        ? "Accepting questions"
                        : "Submission closed"}
                      {" · "}
                      {box._count.questions} total questions
                    </Typography>
                  </Stack>
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25}>
                    <Button
                      component={Link}
                      href={`/b/${box.slug}`}
                      target="_blank"
                      variant="text"
                      sx={{ width: { xs: "100%", sm: "auto" } }}
                    >
                      Public page
                    </Button>
                    <Button
                      component={Link}
                      href={`/dashboard/boxes/${box.id}`}
                      variant="contained"
                      sx={{ width: { xs: "100%", sm: "auto" } }}
                    >
                      Manage
                    </Button>
                  </Stack>
                </Stack>
              ))
            )}
          </Stack>
        </SectionCard>
      </Grid>
    </Grid>
  );
}
