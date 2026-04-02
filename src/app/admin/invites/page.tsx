import Link from "next/link";
import { Button, Grid, MenuItem, Stack, TextField, Typography } from "@mui/material";
import { InviteCreateForm } from "@/components/admin/invite-create-form";
import { InviteEditForm } from "@/components/admin/invite-edit-form";
import { SectionCard } from "@/components/common/section-card";
import { StatusChip } from "@/components/common/status-chip";
import { listAdminInvites } from "@/features/admin/service";
import { requireAdminPage } from "@/lib/auth/guards";
import { formatDateTime } from "@/lib/format";
import { buildPathWithQuery } from "@/lib/url";

type AdminInvitesPageProps = {
  searchParams: Promise<{
    q?: string;
    status?: "ALL" | "ACTIVE" | "DISABLED";
    page?: string;
  }>;
};

export default async function AdminInvitesPage({
  searchParams,
}: AdminInvitesPageProps) {
  await requireAdminPage();
  const params = await searchParams;
  const page = Number.parseInt(params.page ?? "1", 10) || 1;
  const result = await listAdminInvites({
    q: params.q,
    status: params.status ?? "ALL",
    page,
    pageSize: 20,
  });
  const totalPages = Math.max(1, Math.ceil(result.total / 20));

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, xl: 4 }}>
        <SectionCard
          title="Create invite code"
          description="Use invite codes to control registration, set expiry, and cap usage."
        >
          <InviteCreateForm />
        </SectionCard>
      </Grid>
      <Grid size={{ xs: 12, xl: 8 }}>
        <SectionCard
          title="Existing invites"
          description="Adjust status, usage limits, and expiration as the rollout grows."
        >
          <Stack spacing={2}>
            <Stack component="form" direction={{ xs: "column", md: "row" }} spacing={2}>
              <TextField
                name="q"
                label="Search invite code"
                defaultValue={params.q ?? ""}
                fullWidth
              />
              <TextField
                select
                name="status"
                label="Status"
                defaultValue={params.status ?? "ALL"}
                sx={{ minWidth: 180 }}
              >
                <MenuItem value="ALL">All</MenuItem>
                <MenuItem value="ACTIVE">Active</MenuItem>
                <MenuItem value="DISABLED">Disabled</MenuItem>
              </TextField>
              <Button type="submit" variant="contained">
                Filter
              </Button>
            </Stack>
            {result.items.length === 0 ? (
              <Typography color="text.secondary">No invite codes yet.</Typography>
            ) : (
              result.items.map((invite) => (
                <Grid
                  key={invite.id}
                  container
                  spacing={2.5}
                  sx={{
                    p: 2,
                    borderRadius: "16px",
                    bgcolor: "rgba(255, 255, 255, 0.72)",
                  }}
                >
                  <Grid size={{ xs: 12, md: 5 }}>
                    <Stack spacing={1}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="h6">{invite.code}</Typography>
                        <StatusChip status={invite.status} />
                      </Stack>
                      <Typography color="text.secondary">
                        Used {invite.usedCount}
                        {invite.maxUses ? ` / ${invite.maxUses}` : " / unlimited"}
                      </Typography>
                      <Typography color="text.secondary">
                        Expires {invite.expiresAt ? formatDateTime(invite.expiresAt) : "never"}
                      </Typography>
                      <Typography color="text.secondary">
                        Created {formatDateTime(invite.createdAt)}
                        {invite.createdBy ? ` by ${invite.createdBy.phone}` : ""}
                      </Typography>
                    </Stack>
                  </Grid>
                  <Grid size={{ xs: 12, md: 7 }}>
                    <InviteEditForm
                      invite={{
                        id: invite.id,
                        code: invite.code,
                        maxUses: invite.maxUses,
                        expiresAt: invite.expiresAt,
                        status: invite.status,
                      }}
                    />
                  </Grid>
                </Grid>
              ))
            )}
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography color="text.secondary">
                Page {page} of {totalPages}
              </Typography>
              <Stack direction="row" spacing={1.5}>
                <Button
                  component={Link}
                  href={buildPathWithQuery("/admin/invites", {
                    q: params.q,
                    status: params.status,
                    page: page > 1 ? page - 1 : 1,
                  })}
                  disabled={page <= 1}
                >
                  Previous
                </Button>
                <Button
                  component={Link}
                  href={buildPathWithQuery("/admin/invites", {
                    q: params.q,
                    status: params.status,
                    page: page < totalPages ? page + 1 : totalPages,
                  })}
                  disabled={page >= totalPages}
                >
                  Next
                </Button>
              </Stack>
            </Stack>
          </Stack>
        </SectionCard>
      </Grid>
    </Grid>
  );
}
