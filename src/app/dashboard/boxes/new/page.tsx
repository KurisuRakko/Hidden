import { BoxForm } from "@/components/boxes/box-form";
import { SectionCard } from "@/components/common/section-card";
import { UserDashboardShell } from "@/components/layout/user-dashboard-shell";
import { requireUserPage } from "@/lib/auth/guards";
import { createTranslator } from "@/lib/i18n";
import { getRequestLocale } from "@/lib/i18n/server";

export default async function DashboardNewBoxPage() {
  const viewer = await requireUserPage();
  const locale = await getRequestLocale();
  const t = createTranslator(locale);

  return (
    <UserDashboardShell
      viewer={viewer}
      pageTitle={t("dashboard.newBoxPageTitle")}
      backHref="/dashboard/questions"
    >
      <SectionCard
        className="motion-enter-soft"
        title={t("dashboard.newBoxTitle")}
      >
        <BoxForm
          createRedirectMode="created"
          submitLabel={t("dashboard.boxForm.publish")}
        />
      </SectionCard>
    </UserDashboardShell>
  );
}
