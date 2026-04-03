"use client";

import { useState } from "react";
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
import { alpha } from "@mui/material/styles";
import {
  BlockRounded,
  ReplyRounded,
  SendRounded,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { FileUploadField } from "@/components/common/file-upload-field";
import { StatusChip } from "@/components/common/status-chip";
import { useI18n } from "@/components/providers/i18n-provider";
import { formatDateTime } from "@/lib/format";
import { getStatusLabel } from "@/lib/i18n";

type OwnerQuestionCardProps = {
  boxId: string;
  question: {
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
};

export function OwnerQuestionCard({
  boxId,
  question,
}: OwnerQuestionCardProps) {
  const router = useRouter();
  const { locale, t } = useI18n();
  const [expanded, setExpanded] = useState(
    Boolean(question.answer?.content || question.answer?.imageUrl),
  );
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
        setError(result.error ?? t("dashboard.ownerQuestion.saveReplyError"));
        return;
      }

      setSuccess(t("dashboard.ownerQuestion.saveReplySuccess"));
      router.refresh();
    } catch {
      setError(t("common.feedback.networkError"));
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
        setError(result.error ?? t("dashboard.ownerQuestion.publishError"));
        return;
      }

      setSuccess(t("dashboard.ownerQuestion.publishSuccess"));
      router.refresh();
    } catch {
      setError(t("common.feedback.networkError"));
    } finally {
      setSaving(false);
    }
  }

  async function updateQuestionStatus(
    payload: { status: "REJECTED" } | { action: "RESTORE" },
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
              ? t("dashboard.ownerQuestion.unblockError")
              : t("dashboard.ownerQuestion.blockError")),
        );
        return;
      }

      setSuccess(
        "action" in payload
          ? t("dashboard.ownerQuestion.unblockedSuccess")
          : t("dashboard.ownerQuestion.blockedSuccess"),
      );
      router.refresh();
    } catch {
      setError(t("common.feedback.networkError"));
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card
      className="motion-enter-soft interactive-panel"
      sx={(theme) => ({
        backgroundColor: alpha(theme.palette.background.paper, 0.9),
      })}
    >
      <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
        <Stack spacing={2}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            spacing={1.25}
          >
            <Stack spacing={0.75}>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1}
                alignItems={{ xs: "flex-start", sm: "center" }}
              >
                <Typography variant="h6">
                  {t("dashboard.ownerQuestion.anonymousQuestion")}
                </Typography>
                <StatusChip
                  status={question.status}
                  label={getStatusLabel(question.status, locale)}
                />
              </Stack>
              <Typography variant="body2" color="text.secondary">
                {t("dashboard.ownerQuestion.submittedAt", {
                  value: formatDateTime(question.submittedAt, locale),
                })}
                {question.publishedAt
                  ? ` · ${t("dashboard.ownerQuestion.publishedAt", {
                      value: formatDateTime(question.publishedAt, locale),
                    })}`
                  : ""}
              </Typography>
            </Stack>
          </Stack>

          <Box
            sx={(theme) => ({
              px: 1.75,
              py: 1.75,
              borderRadius: 1.5,
              border: `1px solid ${theme.palette.divider}`,
              backgroundColor: alpha(theme.palette.primary.main, 0.04),
            })}
          >
            <Stack spacing={1.25}>
              <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
                {question.content}
              </Typography>
              {question.imageUrl ? (
                <Box
                  component="img"
                  src={question.imageUrl}
                  alt={t("publicBox.questionAttachmentAlt")}
                  sx={{
                    borderRadius: 1.5,
                    width: "100%",
                    maxHeight: 300,
                    objectFit: "cover",
                  }}
                />
              ) : null}
              {question.answer && !expanded ? (
                <Typography color="text.secondary" sx={{ fontSize: "0.95rem" }}>
                  {t("dashboard.ownerQuestion.draftHint")}
                </Typography>
              ) : null}
            </Stack>
          </Box>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25}>
            <Button
              type="button"
              variant={expanded ? "outlined" : "contained"}
              startIcon={<ReplyRounded />}
              disabled={isLocked || saving}
              onClick={() => setExpanded((value) => !value)}
              sx={{ width: { xs: "100%", sm: "auto" } }}
            >
              {expanded
                ? t("dashboard.ownerQuestion.collapseReply")
                : t("common.actions.reply")}
            </Button>
            <Button
              type="button"
              color={isRejected ? "inherit" : "warning"}
              variant={isRejected ? "outlined" : "text"}
              startIcon={<BlockRounded />}
              disabled={isDeleted || saving}
              onClick={() =>
                updateQuestionStatus(
                  isRejected ? { action: "RESTORE" } : { status: "REJECTED" },
                )
              }
              sx={{ width: { xs: "100%", sm: "auto" } }}
            >
              {isRejected
                ? t("dashboard.ownerQuestion.unblock")
                : t("dashboard.ownerQuestion.block")}
            </Button>
          </Stack>

          <Collapse in={Boolean(error)} unmountOnExit>
            {error ? <Alert severity="error">{error}</Alert> : null}
          </Collapse>
          <Collapse in={Boolean(success)} unmountOnExit>
            {success ? <Alert severity="success">{success}</Alert> : null}
          </Collapse>

          <Collapse in={expanded} unmountOnExit>
            <Stack component="form" action={saveAnswer} spacing={1.75}>
              <Divider className="list-divider-soft" />
              <TextField
                label={t("dashboard.ownerQuestion.replyContent")}
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
                helperText={t("dashboard.ownerQuestion.replyImageHelper")}
                buttonLabel={t("dashboard.ownerQuestion.uploadReplyImage")}
              />
              {question.answer?.imageUrl ? (
                <Box
                  component="img"
                  src={question.answer.imageUrl}
                  alt={t("publicBox.answerAttachmentAlt")}
                  sx={{
                    borderRadius: 1.5,
                    width: "100%",
                    maxHeight: 300,
                    objectFit: "cover",
                  }}
                />
              ) : null}
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isLocked || saving}
                  startIcon={<SendRounded />}
                  sx={{ width: { xs: "100%", sm: "auto" } }}
                >
                  {t("dashboard.ownerQuestion.saveReply")}
                </Button>
                <Button
                  type="button"
                  variant="outlined"
                  disabled={isLocked || saving}
                  onClick={publishQuestion}
                  sx={{ width: { xs: "100%", sm: "auto" } }}
                >
                  {t("dashboard.ownerQuestion.publishQuestion")}
                </Button>
              </Stack>
            </Stack>
          </Collapse>
        </Stack>
      </CardContent>
    </Card>
  );
}
