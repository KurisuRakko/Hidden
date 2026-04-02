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
  const isLocked = ["REJECTED", "DELETED"].includes(question.status);

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

  async function updateStatus(status: "REJECTED" | "DELETED") {
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
          body: JSON.stringify({ status }),
        },
      );
      const result = await response.json();

      if (!response.ok) {
        setError(result.error ?? "Unable to update question.");
        return;
      }

      setSuccess(status === "REJECTED" ? "Question rejected." : "Question deleted.");
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
    <Card className="motion-enter interactive-panel">
      <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
        <Stack spacing={2.5}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            spacing={1}
          >
            <Stack spacing={0.75}>
              <Stack direction="row" spacing={1} alignItems="center">
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

          <Typography sx={{ whiteSpace: "pre-wrap" }} className="text-break">
            {question.content}
          </Typography>
          {question.imageUrl ? (
            <Box
              component="img"
              src={question.imageUrl}
              alt="Question attachment"
              sx={{
                borderRadius: 3,
                maxHeight: 320,
                width: "100%",
                objectFit: "cover",
              }}
            />
          ) : null}

          <Divider />

          <Collapse in={Boolean(error)} unmountOnExit>
            {error ? <Alert severity="error">{error}</Alert> : null}
          </Collapse>
          <Collapse in={Boolean(success)} unmountOnExit>
            {success ? <Alert severity="success">{success}</Alert> : null}
          </Collapse>

          <Stack component="form" action={saveAnswer} spacing={2}>
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
                  borderRadius: 3,
                  maxHeight: 320,
                  width: "100%",
                  objectFit: "cover",
                }}
              />
            ) : null}
            <Stack direction={{ xs: "column", md: "row" }} spacing={1.5}>
              <Button
                type="submit"
                variant="contained"
                disabled={isLocked || saving}
                sx={{ width: { xs: "100%", md: "auto" } }}
              >
                Save answer
              </Button>
              <Button
                type="button"
                variant="outlined"
                onClick={publishQuestion}
                disabled={isLocked || saving}
                sx={{ width: { xs: "100%", md: "auto" } }}
              >
                Publish
              </Button>
              <Button
                type="button"
                color="warning"
                variant="outlined"
                onClick={() => updateStatus("REJECTED")}
                disabled={isLocked || saving}
                sx={{ width: { xs: "100%", md: "auto" } }}
              >
                Reject
              </Button>
              <Button
                type="button"
                color="error"
                variant="outlined"
                onClick={() => updateStatus("DELETED")}
                disabled={question.status === "DELETED" || saving}
                sx={{ width: { xs: "100%", md: "auto" } }}
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
