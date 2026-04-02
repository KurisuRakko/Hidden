import Link from "next/link";
import {
  Button,
  Stack,
} from "@mui/material";
import { AddRounded } from "@mui/icons-material";
import { DashboardBoxCard } from "@/components/boxes/dashboard-box-card";
import { EmptyState } from "@/components/common/empty-state";
import { SectionCard } from "@/components/common/section-card";
import { UserDashboardShell } from "@/components/layout/user-dashboard-shell";
import { listBoxesForOwner } from "@/features/boxes/service";
import { requireUserPage } from "@/lib/auth/guards";

export default async function DashboardQuestionsPage() {
  const viewer = await requireUserPage();
  const boxes = await listBoxesForOwner(viewer.id);

  return (
    <UserDashboardShell viewer={viewer}>
      <Stack spacing={3}>
        <SectionCard
          className="motion-enter-soft"
          title="我的提问箱"
          description="从这里进入每一个提问箱，查看现在收到的问题并继续管理。"
        >
          <Stack spacing={2}>
            <Button
              component={Link}
              href="/dashboard/boxes/new"
              startIcon={<AddRounded />}
              variant="contained"
              sx={{ width: { xs: "100%", sm: "auto" } }}
            >
              新增提问箱
            </Button>

            {boxes.length === 0 ? (
              <EmptyState
                title="还没有提问箱"
                description="先创建第一个提问箱，之后这里会展示你的所有提问箱。"
              />
            ) : (
              boxes.map((box) => <DashboardBoxCard key={box.id} box={box} />)
            )}
          </Stack>
        </SectionCard>
      </Stack>
    </UserDashboardShell>
  );
}
