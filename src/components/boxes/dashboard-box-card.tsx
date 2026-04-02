import {
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { StatusChip } from "@/components/common/status-chip";
import { useI18n } from "@/components/providers/i18n-provider";
import { getStatusLabel } from "@/lib/i18n";

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
};

export function DashboardBoxCard({ box }: DashboardBoxCardProps) {
  const { locale, t } = useI18n();

  return (
    <Card
      className="interactive-panel"
      sx={(theme) => ({
        backgroundColor: alpha(theme.palette.background.paper, 0.88),
      })}
    >
      <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
        <Stack spacing={2}>
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
              /b/{box.slug}
            </Typography>
            <Typography color="text.secondary" className="text-break">
              {box.description || t("dashboard.boxCard.noDescription")}
            </Typography>
          </Stack>

          <Typography variant="body2" color="text.secondary">
            {box.acceptingQuestions
              ? t("dashboard.boxCard.accepting")
              : t("dashboard.boxCard.paused")}{" "}
            · {t("dashboard.boxCard.questionCount", { count: box._count.questions })}
          </Typography>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25}>
            <Button
              href={`/dashboard/boxes/${box.id}`}
              variant="contained"
              sx={{ width: { xs: "100%", sm: "auto" } }}
            >
              {t("dashboard.boxCard.open")}
            </Button>
            <Button
              href={`/b/${box.slug}`}
              target="_blank"
              variant="text"
              sx={{ width: { xs: "100%", sm: "auto" } }}
            >
              {t("dashboard.boxCard.sharePage")}
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
