import {
  Stack,
} from "@mui/material";
import { CheckCircleRounded } from "@mui/icons-material";
import { BoxShareActions } from "@/components/boxes/box-share-actions";
import { SectionCard } from "@/components/common/section-card";
import { UserDashboardShell } from "@/components/layout/user-dashboard-shell";
import { getBoxSummaryForOwner } from "@/features/boxes/service";
import { getPublicAppUrl } from "@/lib/admin-portal";
import { requireUserPage } from "@/lib/auth/guards";

type CreatedPageProps = {
  params: Promise<{
    boxId: string;
  }>;
};

export default async function BoxCreatedPage({ params }: CreatedPageProps) {
  const viewer = await requireUserPage();
  const { boxId } = await params;
  const box = await getBoxSummaryForOwner(boxId, viewer.id);
  const shareUrl = await getPublicAppUrl(`/b/${box.slug}`);

  return (
    <UserDashboardShell viewer={viewer} pageTitle="提问箱创建成功">
      <SectionCard
        className="motion-enter-soft"
        title={box.title}
        description="提问箱已经准备好了。现在你可以把链接分享出去，或者继续进入后台管理。"
      >
        <Stack spacing={2.5}>
          <Stack direction="row" spacing={1.25} alignItems="center">
            <CheckCircleRounded color="success" />
            <span>创建成功</span>
          </Stack>
          <BoxShareActions
            shareUrl={shareUrl}
            manageHref={`/dashboard/boxes/${box.id}`}
          />
        </Stack>
      </SectionCard>
    </UserDashboardShell>
  );
}
