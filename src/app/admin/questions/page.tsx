import Link from "next/link";
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
import { DeleteAnswerButton } from "@/components/admin/delete-answer-button";
import { DeleteQuestionButton } from "@/components/admin/delete-question-button";
import { SectionCard } from "@/components/common/section-card";
import { StatusChip } from "@/components/common/status-chip";
import { listAdminQuestions } from "@/features/admin/service";
import { requireAdminPage } from "@/lib/auth/guards";
import { formatDateTime } from "@/lib/format";
import { buildPathWithQuery } from "@/lib/url";

type AdminQuestionsPageProps = {
  searchParams: Promise<{
    q?: string;
    status?: "ALL" | "PENDING" | "ANSWERED" | "PUBLISHED" | "REJECTED" | "DELETED";
    page?: string;
  }>;
};

export default async function AdminQuestionsPage({
  searchParams,
}: AdminQuestionsPageProps) {
  await requireAdminPage();
  const params = await searchParams;
  const page = Number.parseInt(params.page ?? "1", 10) || 1;
  const result = await listAdminQuestions({
    q: params.q,
    status: params.status ?? "ALL",
    page,
    pageSize: 20,
  });
  const totalPages = Math.max(1, Math.ceil(result.total / 20));

  return (
    <SectionCard
      title="Questions"
      description="Moderate content across the entire platform. Search by text, box slug, or owner phone."
    >
      <Stack spacing={3}>
        <Stack component="form" direction={{ xs: "column", md: "row" }} spacing={2}>
          <TextField
            name="q"
            label="Search question or owner"
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
            <MenuItem value="PENDING">Pending</MenuItem>
            <MenuItem value="ANSWERED">Answered</MenuItem>
            <MenuItem value="PUBLISHED">Published</MenuItem>
            <MenuItem value="REJECTED">Rejected</MenuItem>
            <MenuItem value="DELETED">Deleted</MenuItem>
          </TextField>
          <Button type="submit" variant="contained">
            Filter
          </Button>
        </Stack>

        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Question</TableCell>
              <TableCell>Answer</TableCell>
              <TableCell>Owner</TableCell>
              <TableCell>Box</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Submitted</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {result.items.map((question) => (
              <TableRow key={question.id}>
                <TableCell>
                  <Stack spacing={0.75}>
                    <Typography variant="body2">
                      {question.content.slice(0, 110)}
                      {question.content.length > 110 ? "..." : ""}
                    </Typography>
                    {question.answer ? (
                      <Typography variant="caption" color="text.secondary">
                        Answer saved
                      </Typography>
                    ) : null}
                  </Stack>
                </TableCell>
                <TableCell>
                  {!question.answer ? (
                    <Typography variant="body2" color="text.secondary">
                      No answer
                    </Typography>
                  ) : question.answer.deletedAt ? (
                    <Typography variant="body2" color="text.secondary">
                      Answer removed
                    </Typography>
                  ) : (
                    <Stack spacing={0.75}>
                      <Typography variant="body2">
                        {question.answer.content.slice(0, 110)}
                        {question.answer.content.length > 110 ? "..." : ""}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {question.answer.imageUrl ? "Has image" : "Text only"}
                      </Typography>
                    </Stack>
                  )}
                </TableCell>
                <TableCell>{question.box.owner.phone}</TableCell>
                <TableCell>
                  <Button component={Link} href={`/b/${question.box.slug}`} target="_blank">
                    /b/{question.box.slug}
                  </Button>
                </TableCell>
                <TableCell>
                  <StatusChip status={question.status} />
                </TableCell>
                <TableCell>{formatDateTime(question.submittedAt)}</TableCell>
                <TableCell align="right">
                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    {question.answer && !question.answer.deletedAt ? (
                      <DeleteAnswerButton answerId={question.answer.id} />
                    ) : null}
                    <DeleteQuestionButton questionId={question.id} />
                  </Stack>
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
              component={Link}
              href={buildPathWithQuery("/admin/questions", {
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
              href={buildPathWithQuery("/admin/questions", {
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
