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
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, xl: 4 }}>
        <SectionCard
          className="motion-enter"
          title="Create a new box"
          description="Each box gets its own public URL and moderation queue."
        >
          <BoxForm />
        </SectionCard>
      </Grid>
      <Grid size={{ xs: 12, xl: 8 }}>
        <SectionCard
          className="motion-enter motion-delay-1"
          title="Your boxes"
          description="Manage titles, slugs, submission settings, and moderation from here."
        >
          <Stack spacing={2}>
            {boxes.length === 0 ? (
              <EmptyState
                title="No question boxes yet"
                description="Create your first box on the left to start receiving anonymous questions."
              />
            ) : (
              boxes.map((box) => (
              <Stack
                key={box.id}
                direction={{ xs: "column", md: "row" }}
                justifyContent="space-between"
                spacing={2}
                className="interactive-panel"
                sx={{
                  px: 2.5,
                  py: 2.5,
                    borderRadius: 3,
                    bgcolor: "rgba(255, 255, 255, 0.7)",
                  }}
                >
                  <Stack spacing={1}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography variant="h6">{box.title}</Typography>
                      <StatusChip status={box.status} />
                    </Stack>
                    <Typography color="text.secondary" className="text-break">
                      /b/{box.slug}
                    </Typography>
                    <Typography color="text.secondary" className="text-break">
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
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                    <Button
                      component={Link}
                      href={`/b/${box.slug}`}
                      target="_blank"
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
