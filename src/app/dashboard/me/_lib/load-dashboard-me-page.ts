import { requireUserPage } from "@/lib/auth/guards";
import { formatDateTime } from "@/lib/format";
import { createTranslator, getRoleLabel } from "@/lib/i18n";
import { getRequestLocale } from "@/lib/i18n/server";
import { getOidcPublicConfig } from "@/lib/env";

export async function loadDashboardMePageData() {
  const [viewer, locale] = await Promise.all([
    requireUserPage(),
    getRequestLocale(),
  ]);

  const t = createTranslator(locale);
  const oidc = getOidcPublicConfig();

  return {
    viewer,
    locale,
    t,
    oidcProviderLabel: oidc.providerLabel,
    accountSummary: {
      identifierLabel: t("dashboard.accountIdentifier", {
        value: viewer.displayLabel,
      }),
      roleLabel: t("dashboard.accountRole", {
        role: getRoleLabel(viewer.role, locale),
      }),
      createdAtLabel: t("dashboard.accountCreatedAt", {
        value: formatDateTime(viewer.createdAt, locale),
      }),
    },
  };
}
