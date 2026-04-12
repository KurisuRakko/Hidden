import {
  Button,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { SectionCard } from "@/components/common/section-card";
import { StatusChip } from "@/components/common/status-chip";
import { UserActions } from "@/components/admin/user-actions";
import { UserStatusSelect } from "@/components/admin/user-status-select";
import { listAdminUsers } from "@/features/admin/service";
import { requireAdminPage } from "@/lib/auth/guards";
import { formatDateTime } from "@/lib/format";
import { getUserDisplayLabel } from "@/lib/user-display";
import { buildPathWithQuery } from "@/lib/url";

type AdminUsersPageProps = {
  searchParams: Promise<{
    q?: string;
    status?: "ALL" | "ACTIVE" | "DISABLED" | "BANNED";
    page?: string;
  }>;
};

export default async function AdminUsersPage({
  searchParams,
}: AdminUsersPageProps) {
  await requireAdminPage();
  const params = await searchParams;
  const page = Number.parseInt(params.page ?? "1", 10) || 1;
  const result = await listAdminUsers({
    q: params.q,
    status: params.status ?? "ALL",
    page,
    pageSize: 20,
  });
  const totalPages = Math.max(1, Math.ceil(result.total / 20));

  return (
    <SectionCard
      title="Users"
      description="Search users by phone number, email, or OIDC identity and update account status when moderation requires it."
    >
      <Stack spacing={3}>
        <Stack component="form" direction={{ xs: "column", md: "row" }} spacing={2}>
          <TextField
            name="q"
            label="Search account"
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
            <MenuItem value="BANNED">Banned</MenuItem>
          </TextField>
          <Button type="submit" variant="contained">
            Filter
          </Button>
        </Stack>

        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Account</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Boxes</TableCell>
              <TableCell>Created</TableCell>
              <TableCell align="right">Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {result.items.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{getUserDisplayLabel(user)}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <StatusChip status={user.status} />
                </TableCell>
                <TableCell>{user._count.boxes}</TableCell>
                <TableCell>{formatDateTime(user.createdAt)}</TableCell>
                <TableCell align="right">
                  <UserStatusSelect userId={user.id} status={user.status} />
                </TableCell>
                <TableCell align="right">
                  <UserActions
                    userId={user.id}
                    userRole={user.role}
                    userStatus={user.status}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography color="text.secondary">
            Page {page} of {totalPages}
          </Typography>
          <Stack direction="row" spacing={1.5}>
            <Button
              href={buildPathWithQuery("/admin/users", {
                q: params.q,
                status: params.status,
                page: page > 1 ? page - 1 : 1,
              })}
              disabled={page <= 1}
            >
              Previous
            </Button>
            <Button
              href={buildPathWithQuery("/admin/users", {
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
  );
}
