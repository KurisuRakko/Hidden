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
import { BoxStatusSelect } from "@/components/admin/box-status-select";
import { SectionCard } from "@/components/common/section-card";
import { StatusChip } from "@/components/common/status-chip";
import { listAdminBoxes } from "@/features/admin/service";
import { requireAdminPage } from "@/lib/auth/guards";
import { formatDateTime } from "@/lib/format";
import { getUserDisplayLabel } from "@/lib/user-display";
import { buildPathWithQuery, getPublicBoxPath } from "@/lib/url";

type AdminBoxesPageProps = {
  searchParams: Promise<{
    q?: string;
    status?: "ALL" | "ACTIVE" | "HIDDEN" | "DISABLED";
    page?: string;
  }>;
};

export default async function AdminBoxesPage({
  searchParams,
}: AdminBoxesPageProps) {
  await requireAdminPage();
  const params = await searchParams;
  const page = Number.parseInt(params.page ?? "1", 10) || 1;
  const result = await listAdminBoxes({
    q: params.q,
    status: params.status ?? "ALL",
    page,
    pageSize: 20,
  });
  const totalPages = Math.max(1, Math.ceil(result.total / 20));

  return (
    <SectionCard
      title="Question boxes"
      description="Inspect public slugs, ownership, question counts, and disable boxes when needed."
    >
      <Stack spacing={3}>
        <Stack component="form" direction={{ xs: "column", md: "row" }} spacing={2}>
          <TextField
            name="q"
            label="Search title, slug, or owner"
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
            <MenuItem value="HIDDEN">Hidden</MenuItem>
            <MenuItem value="DISABLED">Disabled</MenuItem>
          </TextField>
          <Button type="submit" variant="contained">
            Filter
          </Button>
        </Stack>

        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Slug</TableCell>
              <TableCell>Owner</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Questions</TableCell>
              <TableCell>Created</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {result.items.map((box) => (
              <TableRow key={box.id}>
                <TableCell>{box.title}</TableCell>
                <TableCell>
                  <Button href={getPublicBoxPath(box.slug)} target="_blank">
                    {getPublicBoxPath(box.slug)}
                  </Button>
                </TableCell>
                <TableCell>{getUserDisplayLabel(box.owner)}</TableCell>
                <TableCell>
                  <StatusChip status={box.status} />
                </TableCell>
                <TableCell>{box._count.questions}</TableCell>
                <TableCell>{formatDateTime(box.createdAt)}</TableCell>
                <TableCell align="right">
                  <BoxStatusSelect boxId={box.id} status={box.status} />
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
              href={buildPathWithQuery("/admin/boxes", {
                q: params.q,
                status: params.status,
                page: page > 1 ? page - 1 : 1,
              })}
              disabled={page <= 1}
            >
              Previous
            </Button>
            <Button
              href={buildPathWithQuery("/admin/boxes", {
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
