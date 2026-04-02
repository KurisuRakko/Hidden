import {
  Grid,
  Stack,
} from "@mui/material";
import { BoxForm } from "@/components/boxes/box-form";
import { DashboardBoxCard } from "@/components/boxes/dashboard-box-card";
import { EmptyState } from "@/components/common/empty-state";
import { SectionCard } from "@/components/common/section-card";
import { UserDashboardShell } from "@/components/layout/user-dashboard-shell";
import { listBoxesForOwner } from "@/features/boxes/service";
import { requireUserPage } from "@/lib/auth/guards";

export default async function DashboardNewBoxPage() {
  const viewer = await requireUserPage();
  const boxes = await listBoxesForOwner(viewer.id);

  return (
    <UserDashboardShell viewer={viewer} pageTitle="新增提问箱">
      <Grid container spacing={{ xs: 2, md: 3 }}>
        <Grid size={{ xs: 12, xl: 6 }}>
          <SectionCard
            className="motion-enter-soft"
            title="发布一个新的提问箱"
            description="填好名称、链接和开关状态，发布后就能马上分享给别人提问。"
          >
            <BoxForm
              createRedirectMode="created"
              submitLabel="发布提问箱"
            />
          </SectionCard>
        </Grid>
        <Grid size={{ xs: 12, xl: 6 }}>
          <SectionCard
            className="motion-enter-soft motion-delay-1"
            title="你已经创建的提问箱"
            description="如果你只是想继续管理已有提问箱，也可以直接从这里进入。"
          >
            <Stack spacing={2}>
              {boxes.length === 0 ? (
                <EmptyState
                  title="这里还没有内容"
                  description="发布第一个提问箱后，这里会开始出现你的历史提问箱。"
                />
              ) : (
                boxes.slice(0, 4).map((box) => <DashboardBoxCard key={box.id} box={box} />)
              )}
            </Stack>
          </SectionCard>
        </Grid>
      </Grid>
    </UserDashboardShell>
  );
}
