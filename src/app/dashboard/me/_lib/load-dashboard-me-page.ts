import { requireUserPage } from "@/lib/auth/guards";
import { formatDateTime } from "@/lib/format";
import { createTranslator, getRoleLabel } from "@/lib/i18n";
import { getRequestLocale } from "@/lib/i18n/server";

export async function loadDashboardMePageData() {
  const [viewer, locale] = await Promise.all([
    requireUserPage(),
    getRequestLocale(),
  ]);

  const t = createTranslator(locale);

  return {
    viewer,
    locale,
    t,
    accountSummary: {
      phoneLabel: t("dashboard.accountPhone", { phone: viewer.phone }),
      roleLabel: t("dashboard.accountRole", {
        role: getRoleLabel(viewer.role, locale),
      }),
      createdAtLabel: t("dashboard.accountCreatedAt", {
        value: formatDateTime(viewer.createdAt, locale),
      }),
    },
  };
}
