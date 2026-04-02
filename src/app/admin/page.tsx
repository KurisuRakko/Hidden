import { Button, Grid, Stack, Typography } from "@mui/material";
import { MetricCard } from "@/components/common/metric-card";
import { SectionCard } from "@/components/common/section-card";
import { getAdminOverview } from "@/features/admin/service";
import { requireAdminPage } from "@/lib/auth/guards";
import { formatDateTime } from "@/lib/format";

export default async function AdminOverviewPage() {
  await requireAdminPage();
  const overview = await getAdminOverview();

  return (
    <Stack spacing={3}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 3 }}>
          <MetricCard label="Users" value={overview.userCount} />
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <MetricCard label="Boxes" value={overview.boxCount} />
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <MetricCard label="Questions" value={overview.questionCount} />
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <MetricCard label="Invite codes" value={overview.inviteCount} />
        </Grid>
      </Grid>

      <SectionCard
        title="Recent admin activity"
        description="This audit stream helps keep moderation work visible across the team."
      >
        <Stack spacing={2}>
          <Stack direction="row" justifyContent="flex-end">
            <Button href="/admin/logs">
              View all logs
            </Button>
          </Stack>
          {overview.recentActions.length === 0 ? (
            <Typography color="text.secondary">No admin activity yet.</Typography>
          ) : (
            overview.recentActions.map((action) => (
              <Stack
                key={action.id}
                direction={{ xs: "column", md: "row" }}
                justifyContent="space-between"
                spacing={2}
                sx={{
                  p: 2,
                  borderRadius: "16px",
                  bgcolor: "rgba(255, 255, 255, 0.65)",
                }}
              >
                <Stack spacing={0.75}>
                  <Typography variant="subtitle1">{action.action}</Typography>
                  <Typography color="text.secondary">
                    {action.admin.phone} · {formatDateTime(action.createdAt)}
                  </Typography>
                  {action.reason ? (
                    <Typography variant="body2" color="text.secondary">
                      {action.reason}
                    </Typography>
                  ) : null}
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  {action.targetType} · {action.targetId}
                </Typography>
              </Stack>
            ))
          )}
        </Stack>
      </SectionCard>
    </Stack>
  );
}
