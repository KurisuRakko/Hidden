import { AdminTargetType } from "@prisma/client";
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
import { listAdminLogs } from "@/features/admin/service";
import { requireAdminPage } from "@/lib/auth/guards";
import { formatDateTime } from "@/lib/format";
import { buildPathWithQuery } from "@/lib/url";

type AdminLogsPageProps = {
  searchParams: Promise<{
    q?: string;
    targetType?: "ALL" | AdminTargetType;
    page?: string;
  }>;
};

function formatMetadata(metadata: unknown) {
  if (!metadata) {
    return "None";
  }

  const value = JSON.stringify(metadata);
  return value.length > 120 ? `${value.slice(0, 117)}...` : value;
}

export default async function AdminLogsPage({
  searchParams,
}: AdminLogsPageProps) {
  await requireAdminPage();
  const params = await searchParams;
  const page = Number.parseInt(params.page ?? "1", 10) || 1;
  const result = await listAdminLogs({
    q: params.q,
    targetType: params.targetType ?? "ALL",
    page,
    pageSize: 20,
  });
  const totalPages = Math.max(1, Math.ceil(result.total / 20));

  return (
    <SectionCard
      title="Admin logs"
      description="Review moderation and governance activity across the platform."
    >
      <Stack spacing={3}>
        <Stack component="form" direction={{ xs: "column", md: "row" }} spacing={2}>
          <TextField
            name="q"
            label="Search action, target, or admin"
            defaultValue={params.q ?? ""}
            fullWidth
          />
          <TextField
            select
            name="targetType"
            label="Target type"
            defaultValue={params.targetType ?? "ALL"}
            sx={{ minWidth: 180 }}
          >
            <MenuItem value="ALL">All</MenuItem>
            <MenuItem value="USER">User</MenuItem>
            <MenuItem value="QUESTION_BOX">Question box</MenuItem>
            <MenuItem value="QUESTION">Question</MenuItem>
            <MenuItem value="ANSWER">Answer</MenuItem>
            <MenuItem value="INVITE_CODE">Invite code</MenuItem>
          </TextField>
          <Button type="submit" variant="contained">
            Filter
          </Button>
        </Stack>

        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Time</TableCell>
              <TableCell>Admin</TableCell>
              <TableCell>Action</TableCell>
              <TableCell>Target</TableCell>
              <TableCell>Reason</TableCell>
              <TableCell>Metadata</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {result.items.map((log) => (
              <TableRow key={log.id}>
                <TableCell>{formatDateTime(log.createdAt)}</TableCell>
                <TableCell>{log.admin.phone}</TableCell>
                <TableCell>{log.action}</TableCell>
                <TableCell>
                  <Stack spacing={0.5}>
                    <Typography variant="body2">{log.targetType}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {log.targetId}
                    </Typography>
                  </Stack>
                </TableCell>
                <TableCell>{log.reason ?? "None"}</TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {formatMetadata(log.metadata)}
                  </Typography>
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
              href={buildPathWithQuery("/admin/logs", {
                q: params.q,
                targetType: params.targetType,
                page: page > 1 ? page - 1 : 1,
              })}
              disabled={page <= 1}
            >
              Previous
            </Button>
            <Button
              href={buildPathWithQuery("/admin/logs", {
                q: params.q,
                targetType: params.targetType,
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
