import {
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { ChangePasswordForm } from "@/components/auth/change-password-form";
import { LogoutButton } from "@/components/common/logout-button";
import { SectionCard } from "@/components/common/section-card";
import { DashboardThemeSettingsCard } from "@/components/layout/dashboard-theme-settings-card";
import { UserDashboardShell } from "@/components/layout/user-dashboard-shell";
import { requireUserPage } from "@/lib/auth/guards";
import { formatDateTime } from "@/lib/format";

export default async function DashboardMePage() {
  const viewer = await requireUserPage();

  return (
    <UserDashboardShell viewer={viewer} pageTitle="我的">
      <Grid container spacing={{ xs: 2, md: 3 }}>
        <Grid size={{ xs: 12, xl: 5 }}>
          <Stack spacing={3}>
            <SectionCard
              className="motion-enter-soft"
              title="账号信息"
              description="这里放的是当前登录账号的基础信息。"
            >
              <Stack spacing={1.25}>
                <Typography>手机号：{viewer.phone}</Typography>
                <Typography color="text.secondary">角色：{viewer.role}</Typography>
                <Typography color="text.secondary">
                  注册时间：{formatDateTime(viewer.createdAt)}
                </Typography>
              </Stack>
            </SectionCard>

            <SectionCard
              className="motion-enter-soft motion-delay-1"
              title="主题"
              description="你可以随时在白天和夜间之间切换用户中心。"
            >
              <DashboardThemeSettingsCard />
            </SectionCard>
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, xl: 7 }}>
          <Stack spacing={3}>
            <SectionCard
              className="motion-enter-soft motion-delay-1"
              title="修改密码"
              description="更新密码后，其他设备上的旧会话会被登出。"
            >
              <ChangePasswordForm />
            </SectionCard>

            <SectionCard
              className="motion-enter-soft motion-delay-2"
              title="退出登录"
              description="如果你要离开当前设备，可以在这里安全退出。"
            >
              <LogoutButton
                variant="outlined"
                redirectTo="/"
                sx={{ width: { xs: "100%", sm: "auto" } }}
              />
            </SectionCard>
          </Stack>
        </Grid>
      </Grid>
    </UserDashboardShell>
  );
}
