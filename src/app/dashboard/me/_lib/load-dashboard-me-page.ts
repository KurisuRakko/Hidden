import { requireUserPage } from "@/lib/auth/guards";
import { createTranslator } from "@/lib/i18n";
import { getRequestLocale } from "@/lib/i18n/server";

export async function loadDashboardMePageData() {
  const [viewer, locale] = await Promise.all([
    requireUserPage(),
    getRequestLocale(),
  ]);

  return {
    viewer,
    locale,
    t: createTranslator(locale),
  };
}
