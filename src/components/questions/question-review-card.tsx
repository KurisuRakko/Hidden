"use client";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Collapse,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FileUploadField } from "@/components/common/file-upload-field";
import { formatDateTime } from "@/lib/format";
import { StatusChip } from "@/components/common/status-chip";

type ReviewQuestion = {
  id: string;
  content: string;
  imageUrl: string | null;
  status: string;
  submittedAt: Date | string;
  publishedAt: Date | string | null;
  answer: {
    content: string;
    imageUrl: string | null;
  } | null;
};

type QuestionReviewCardProps = {
  boxId: string;
  question: ReviewQuestion;
};

export function QuestionReviewCard({
  boxId,
  question,
}: QuestionReviewCardProps) {
  const router = useRouter();
  const [content, setContent] = useState(question.answer?.content ?? "");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const isRejected = question.status === "REJECTED";
  const isDeleted = question.status === "DELETED";
  const isLocked = isRejected || isDeleted;

  async function saveAnswer(formData: FormData) {
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(
        `/api/boxes/${boxId}/questions/${question.id}/answer`,
        {
          method: "POST",
          body: formData,
        },
      );
      const result = await response.json();

      if (!response.ok) {
        setError(result.error ?? "Unable to save answer.");
        return;
      }

      setSuccess("Answer saved.");
      router.refresh();
    } catch {
      setError("Network request failed. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function updateStatus(
    payload:
      | { status: "REJECTED" | "DELETED" }
      | { action: "RESTORE" },
  ) {
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(
        `/api/boxes/${boxId}/questions/${question.id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );
      const result = await response.json();

      if (!response.ok) {
        setError(
          result.error ??
            ("action" in payload
              ? "Unable to restore question."
              : "Unable to update question."),
        );
        return;
      }

      setSuccess(
        "action" in payload
          ? "Question restored."
          : payload.status === "REJECTED"
            ? "Question rejected."
            : "Question deleted.",
      );
      router.refresh();
    } catch {
      setError("Network request failed. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function publishQuestion() {
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(
        `/api/boxes/${boxId}/questions/${question.id}/publish`,
        {
          method: "POST",
        },
      );
      const result = await response.json();

      if (!response.ok) {
        setError(result.error ?? "Unable to publish question.");
        return;
      }

      setSuccess("Question published.");
      router.refresh();
    } catch {
      setError("Network request failed. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card className="motion-enter-soft interactive-panel">
      <CardContent sx={{ p: { xs: 2.25, sm: 3 } }}>
        <Stack spacing={{ xs: 2, sm: 2.5 }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            spacing={1}
          >
            <Stack spacing={0.75}>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1}
                alignItems={{ xs: "flex-start", sm: "center" }}
              >
                <Typography variant="h6">Anonymous question</Typography>
                <StatusChip status={question.status} />
              </Stack>
              <Typography variant="body2" color="text.secondary">
                Submitted {formatDateTime(question.submittedAt)}
                {question.publishedAt
                  ? ` · Published ${formatDateTime(question.publishedAt)}`
                  : ""}
              </Typography>
            </Stack>
          </Stack>

          <Box
            sx={{
              px: { xs: 1.5, sm: 1.75 },
              py: { xs: 1.5, sm: 1.75 },
              borderRadius: 1.5,
              bgcolor: "background.paper",
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Stack spacing={1.25}>
              <Typography variant="overline" color="text.secondary">
                Question
              </Typography>
              <Typography sx={{ whiteSpace: "pre-wrap" }} className="text-break">
                {question.content}
              </Typography>
              {question.imageUrl ? (
                <Box
                  component="img"
                  src={question.imageUrl}
                  alt="Question attachment"
                  sx={{
                    borderRadius: "14px",
                    maxHeight: { xs: 220, sm: 300 },
                    width: "100%",
                    objectFit: "cover",
                  }}
                />
              ) : null}
            </Stack>
          </Box>

          <Divider className="list-divider-soft" />

          <Collapse in={Boolean(error)} unmountOnExit>
            {error ? <Alert severity="error" className="status-feedback">{error}</Alert> : null}
          </Collapse>
          <Collapse in={Boolean(success)} unmountOnExit>
            {success ? <Alert severity="success" className="status-feedback">{success}</Alert> : null}
          </Collapse>

          <Stack component="form" action={saveAnswer} spacing={1.75}>
            <Box
              sx={{
                p: { xs: 1.5, sm: 1.75 },
                borderRadius: 1.5,
                bgcolor: "background.paper",
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Stack spacing={1.5}>
                <Typography variant="overline" color="text.secondary">
                  Draft answer
                </Typography>
                <TextField
                  label="Answer"
                  name="content"
                  multiline
                  minRows={4}
                  fullWidth
                  disabled={isLocked || saving}
                  value={content}
                  onChange={(event) => setContent(event.target.value)}
                />
                <FileUploadField
                  name="image"
                  accept="image/png,image/jpeg,image/webp"
                  disabled={isLocked || saving}
                  helperText="Optional answer image. Uploading a new one replaces the previous image."
                  buttonLabel="Upload answer image"
                />
                {question.answer?.imageUrl ? (
                  <Box
                    component="img"
                    src={question.answer.imageUrl}
                    alt="Answer attachment"
                    sx={{
                      borderRadius: "14px",
                      maxHeight: { xs: 220, sm: 300 },
                      width: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : null}
              </Stack>
            </Box>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25}>
              <Button
                type="submit"
                variant="contained"
                disabled={isLocked || saving}
                sx={{ width: { xs: "100%", sm: "auto" } }}
              >
                Save answer
              </Button>
              <Button
                type="button"
                variant="outlined"
                onClick={publishQuestion}
                disabled={isLocked || saving}
                sx={{ width: { xs: "100%", sm: "auto" } }}
              >
                Publish
              </Button>
            </Stack>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25}>
              <Button
                type="button"
                color={isRejected ? "inherit" : "warning"}
                variant="outlined"
                onClick={() =>
                  updateStatus(
                    isRejected ? { action: "RESTORE" } : { status: "REJECTED" },
                  )
                }
                disabled={isDeleted || saving}
                sx={{ width: { xs: "100%", sm: "auto" } }}
              >
                {isRejected ? "Restore" : "Reject"}
              </Button>
              <Button
                type="button"
                color="error"
                variant="text"
                onClick={() => updateStatus({ status: "DELETED" })}
                disabled={isDeleted || saving}
                sx={{ width: { xs: "100%", sm: "auto" } }}
              >
                Delete
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
