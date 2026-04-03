"use client";

import { useState } from "react";
import {
  Alert,
  Button,
  Card,
  CardContent,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { StatusChip } from "@/components/common/status-chip";
import { useI18n } from "@/components/providers/i18n-provider";
import { getStatusLabel } from "@/lib/i18n";
import { getPublicBoxPath } from "@/lib/url";

type DashboardBoxCardProps = {
  box: {
    id: string;
    title: string;
    slug: string;
    description: string | null;
    status: string;
    acceptingQuestions: boolean;
    _count: {
      questions: number;
    };
  };
  shareUrl: string;
};

export function DashboardBoxCard({ box, shareUrl }: DashboardBoxCardProps) {
  const { locale, t } = useI18n();
  const publicPath = getPublicBoxPath(box.slug);
  const [feedback, setFeedback] = useState<{
    severity: "success" | "error";
    message: string;
  } | null>(null);

  async function handleCopyShareUrl() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setFeedback({
        severity: "success",
        message: t("dashboard.share.copied"),
      });
    } catch {
      setFeedback({
        severity: "error",
        message: t("dashboard.share.copyFailed"),
      });
    }
  }

  return (
    <Card
      className="interactive-panel"
      sx={(theme) => ({
        backgroundColor: alpha(theme.palette.background.paper, 0.88),
      })}
    >
      <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
        <Stack spacing={2}>
          {feedback ? (
            <Alert severity={feedback.severity}>{feedback.message}</Alert>
          ) : null}

          <Stack spacing={1}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1}
              alignItems={{ xs: "flex-start", sm: "center" }}
            >
              <Typography variant="h6">{box.title}</Typography>
              <StatusChip
                status={box.status}
                label={getStatusLabel(box.status, locale)}
              />
            </Stack>
            <Typography color="text.secondary" className="text-break">
              {publicPath}
            </Typography>
            <Typography color="text.secondary" className="text-break">
              {box.description || t("dashboard.boxCard.noDescription")}
            </Typography>
          </Stack>

          <Stack spacing={0.5}>
            <Typography variant="body2" color="text.secondary">
              {box.acceptingQuestions
                ? t("dashboard.boxCard.accepting")
                : t("dashboard.boxCard.paused")}{" "}
              · {t("dashboard.boxCard.questionCount", { count: box._count.questions })}
            </Typography>
            <Link
              href={publicPath}
              target="_blank"
              underline="hover"
              color="text.secondary"
              className="text-break"
              sx={{ fontSize: "0.875rem", opacity: 0.84 }}
            >
              {publicPath}
            </Link>
          </Stack>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25}>
            <Button
              href={`/dashboard/boxes/${box.id}`}
              variant="contained"
              sx={{ width: { xs: "100%", sm: "auto" } }}
            >
              {t("dashboard.boxCard.open")}
            </Button>
            <Button
              type="button"
              onClick={handleCopyShareUrl}
              variant="outlined"
              sx={{ width: { xs: "100%", sm: "auto" } }}
            >
              {t("common.actions.copyLink")}
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
