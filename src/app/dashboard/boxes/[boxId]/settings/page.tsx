import Link from "next/link";
import {
  Button,
  Grid,
  Stack,
} from "@mui/material";
import { ArrowBackRounded, OpenInNewRounded } from "@mui/icons-material";
import { BoxForm } from "@/components/boxes/box-form";
import { BoxShareActions } from "@/components/boxes/box-share-actions";
import { SectionCard } from "@/components/common/section-card";
import { UserDashboardShell } from "@/components/layout/user-dashboard-shell";
import {
  getBoxDetailForOwner,
  getBoxSummaryForOwner,
} from "@/features/boxes/service";
import { getPublicAppUrl } from "@/lib/admin-portal";
import { requireUserPage } from "@/lib/auth/guards";

type BoxSettingsPageProps = {
  params: Promise<{
    boxId: string;
  }>;
};

export default async function BoxSettingsPage({
  params,
}: BoxSettingsPageProps) {
  const viewer = await requireUserPage();
  const { boxId } = await params;
  const [box, boxSummary] = await Promise.all([
    getBoxDetailForOwner(boxId, viewer.id),
    getBoxSummaryForOwner(boxId, viewer.id),
  ]);
  const shareUrl = await getPublicAppUrl(`/b/${box.slug}`);

  return (
    <UserDashboardShell viewer={viewer} pageTitle={box.title}>
      <Grid container spacing={{ xs: 2, md: 3 }}>
        <Grid size={{ xs: 12, xl: 7 }}>
          <SectionCard
            className="motion-enter-soft"
            title="提问箱设置"
            description="这里可以更新标题、简介、链接、可见性和接收提问状态。"
          >
            <Stack spacing={2}>
              <Button
                component={Link}
                href={`/dashboard/boxes/${box.id}`}
                startIcon={<ArrowBackRounded />}
                variant="text"
                sx={{ width: { xs: "100%", sm: "auto" } }}
              >
                返回提问列表
              </Button>
              <BoxForm
                initialValues={{
                  id: box.id,
                  title: box.title,
                  description: box.description,
                  slug: box.slug,
                  acceptingQuestions: box.acceptingQuestions,
                  status: box.status === "DISABLED" ? "HIDDEN" : box.status,
                }}
              />
            </Stack>
          </SectionCard>
        </Grid>
        <Grid size={{ xs: 12, xl: 5 }}>
          <Stack spacing={3}>
            <SectionCard
              className="motion-enter-soft motion-delay-1"
              title="公开页"
              description="这个链接就是别人看到并提交提问的页面。"
            >
              <Stack spacing={2}>
                <Button
                  component={Link}
                  href={`/b/${box.slug}`}
                  target="_blank"
                  startIcon={<OpenInNewRounded />}
                  variant="outlined"
                  sx={{ width: { xs: "100%", sm: "auto" } }}
                >
                  打开公开页
                </Button>
                <BoxShareActions shareUrl={shareUrl} />
              </Stack>
            </SectionCard>
            <SectionCard
              className="motion-enter-soft motion-delay-2"
              title="当前概况"
              description="让你快速确认这个提问箱现在的状态。"
            >
              <Stack spacing={1}>
                <div>状态：{boxSummary.status}</div>
                <div>接收提问：{boxSummary.acceptingQuestions ? "开启" : "关闭"}</div>
                <div>累计问题：{boxSummary._count.questions}</div>
              </Stack>
            </SectionCard>
          </Stack>
        </Grid>
      </Grid>
    </UserDashboardShell>
  );
}
