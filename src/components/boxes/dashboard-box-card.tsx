import Link from "next/link";
import {
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { StatusChip } from "@/components/common/status-chip";

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
              <StatusChip status={box.status} />
            </Stack>
            <Typography color="text.secondary" className="text-break">
              /b/{box.slug}
            </Typography>
            <Typography color="text.secondary" className="text-break">
              {box.description || "还没有写简介。"}
            </Typography>
          </Stack>

          <Typography variant="body2" color="text.secondary">
            {box.acceptingQuestions ? "正在接收提问" : "已暂停接收提问"} ·{" "}
            {box._count.questions} 个问题
          </Typography>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25}>
            <Button
              component={Link}
              href={`/dashboard/boxes/${box.id}`}
              variant="contained"
              sx={{ width: { xs: "100%", sm: "auto" } }}
            >
              进入
            </Button>
            <Button
              component={Link}
              href={`/b/${box.slug}`}
              target="_blank"
              variant="text"
              sx={{ width: { xs: "100%", sm: "auto" } }}
            >
              分享页
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
