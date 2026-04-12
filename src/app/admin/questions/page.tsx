import { Fragment } from "react";
import {
  Box,
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
import { getUserDisplayLabel } from "@/lib/user-display";
import { buildPathWithQuery, getPublicBoxPath } from "@/lib/url";

type AdminQuestionsPageProps = {
  searchParams: Promise<{
    q?: string;
    status?: "ALL" | "PENDING" | "ANSWERED" | "PUBLISHED" | "REJECTED" | "DELETED";
    page?: string;
  }>;
};

function summarizeText(value: string, maxLength = 110) {
  return value.length > maxLength ? `${value.slice(0, maxLength)}...` : value;
}

function formatAuditValue(value: string | null | undefined, fallback = "Not collected") {
  if (!value) {
    return fallback;
  }

  return value;
}

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
      description="Moderate content across the entire platform. Search by text, box slug, or creator account."
    >
      <Stack spacing={3}>
        <Stack component="form" direction={{ xs: "column", md: "row" }} spacing={2}>
          <TextField
            name="q"
            label="Search question or creator"
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
              <TableCell>Creator</TableCell>
              <TableCell>Box</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Submitted</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {result.items.map((question) => (
              <Fragment key={question.id}>
                <TableRow>
                  <TableCell sx={{ borderBottom: "none" }}>
                    <Stack spacing={0.75}>
                      <Typography variant="body2">
                        {summarizeText(question.content)}
                      </Typography>
                      {question.answer ? (
                        <Typography variant="caption" color="text.secondary">
                          Answer saved
                        </Typography>
                      ) : null}
                    </Stack>
                  </TableCell>
                  <TableCell sx={{ borderBottom: "none" }}>
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
                          {summarizeText(question.answer.content)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {question.answer.imageUrl ? "Has image" : "Text only"}
                        </Typography>
                      </Stack>
                    )}
                  </TableCell>
                  <TableCell sx={{ borderBottom: "none" }}>
                    {getUserDisplayLabel(question.box.owner)}
                  </TableCell>
                  <TableCell sx={{ borderBottom: "none" }}>
                    <Button href={getPublicBoxPath(question.box.slug)} target="_blank">
                      {getPublicBoxPath(question.box.slug)}
                    </Button>
                  </TableCell>
                  <TableCell sx={{ borderBottom: "none" }}>
                    <StatusChip status={question.status} />
                  </TableCell>
                  <TableCell sx={{ borderBottom: "none" }}>
                    {formatDateTime(question.submittedAt)}
                  </TableCell>
                  <TableCell align="right" sx={{ borderBottom: "none" }}>
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      {question.answer && !question.answer.deletedAt ? (
                        <DeleteAnswerButton answerId={question.answer.id} />
                      ) : null}
                      <DeleteQuestionButton questionId={question.id} />
                    </Stack>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={7} sx={{ pt: 0, px: 2, pb: 2.5 }}>
                    <Box
                      component="details"
                      sx={{
                        borderRadius: "16px",
                        bgcolor: "rgba(245, 245, 247, 0.9)",
                        border: "1px solid rgba(30, 31, 36, 0.08)",
                        overflow: "hidden",
                        "& > summary": {
                          listStyle: "none",
                          cursor: "pointer",
                        },
                        "& > summary::-webkit-details-marker": {
                          display: "none",
                        },
                      }}
                    >
                      <Box
                        component="summary"
                        sx={{
                          px: 2,
                          py: 1.5,
                        }}
                      >
                        <Stack
                          direction={{ xs: "column", md: "row" }}
                          justifyContent="space-between"
                          spacing={1}
                        >
                          <Typography variant="subtitle2">Details</Typography>
                          <Typography variant="caption" color="text.secondary">
                            Creator, submitter IP and UA, full content, and image state
                          </Typography>
                        </Stack>
                      </Box>

                      <Stack spacing={2} sx={{ px: 2, pb: 2, pt: 0.5 }}>
                        <Stack
                          direction={{ xs: "column", md: "row" }}
                          spacing={2}
                          useFlexGap
                          flexWrap="wrap"
                        >
                          <Box sx={{ minWidth: 220, flex: "1 1 220px" }}>
                            <Typography variant="caption" color="text.secondary">
                              Creator
                            </Typography>
                            <Typography variant="body2">
                              {getUserDisplayLabel(question.box.owner)}
                            </Typography>
                          </Box>
                          <Box sx={{ minWidth: 220, flex: "1 1 220px" }}>
                            <Typography variant="caption" color="text.secondary">
                              Box
                            </Typography>
                            <Typography variant="body2">
                              {question.box.title} ({question.box.slug})
                            </Typography>
                          </Box>
                          <Box sx={{ minWidth: 220, flex: "1 1 220px" }}>
                            <Typography variant="caption" color="text.secondary">
                              Submitter IP
                            </Typography>
                            <Typography variant="body2">
                              {formatAuditValue(
                                question.submitterIp,
                                "Not collected (legacy record)",
                              )}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Hash: {formatAuditValue(question.submitterIpHash, "Unavailable")}
                            </Typography>
                          </Box>
                          <Box sx={{ minWidth: 220, flex: "1 1 220px" }}>
                            <Typography variant="caption" color="text.secondary">
                              Submitter user agent
                            </Typography>
                            <Typography variant="body2" className="text-break">
                              {formatAuditValue(
                                question.submitterUserAgent,
                                "Not collected",
                              )}
                            </Typography>
                          </Box>
                        </Stack>

                        <Stack spacing={1}>
                          <Typography variant="caption" color="text.secondary">
                            Full question
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ whiteSpace: "pre-wrap" }}
                            className="text-break"
                          >
                            {question.content}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {question.imageUrl ? "Question image attached" : "Question has no image"}
                          </Typography>
                        </Stack>

                        <Stack spacing={1}>
                          <Typography variant="caption" color="text.secondary">
                            Full answer
                          </Typography>
                          {!question.answer ? (
                            <Typography variant="body2" color="text.secondary">
                              No answer saved.
                            </Typography>
                          ) : question.answer.deletedAt ? (
                            <Typography variant="body2" color="text.secondary">
                              Answer removed by moderation.
                            </Typography>
                          ) : (
                            <>
                              <Typography
                                variant="body2"
                                sx={{ whiteSpace: "pre-wrap" }}
                                className="text-break"
                              >
                                {question.answer.content}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {question.answer.imageUrl
                                  ? "Answer image attached"
                                  : "Answer has no image"}
                              </Typography>
                            </>
                          )}
                        </Stack>
                      </Stack>
                    </Box>
                  </TableCell>
                </TableRow>
              </Fragment>
            ))}
          </TableBody>
        </Table>

        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography color="text.secondary">
            Page {page} of {totalPages}
          </Typography>
          <Stack direction="row" spacing={1.5}>
            <Button
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
