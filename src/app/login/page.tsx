import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { Box } from "@mui/material";
import { AuthForm } from "@/components/auth/auth-form";
import { PublicShell } from "@/components/layout/public-shell";
import { getViewer } from "@/lib/auth/guards";
import { getAdminAppUrl } from "@/lib/admin-portal";
import { getOidcPublicConfig } from "@/lib/env";
import { createTranslator } from "@/lib/i18n";
import { getRequestLocale } from "@/lib/i18n/server";
import { getDefaultDialCodeFromAcceptLanguage } from "@/lib/phone";

type LoginPageProps = {
  searchParams: Promise<{
    disabled?: string;
    oidc?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const viewer = await getViewer();
  const locale = await getRequestLocale();
  const t = createTranslator(locale);
  const oidc = getOidcPublicConfig();
  const headerStore = await headers();
  const defaultDialCode = getDefaultDialCodeFromAcceptLanguage(
    headerStore.get("accept-language"),
  );

  if (viewer) {
    redirect(
      viewer.role === "ADMIN" ? await getAdminAppUrl("/admin") : "/dashboard",
    );
  }

  const params = await searchParams;
  const notice = params.disabled
    ? t("auth.disabledNotice")
    : params.oidc === "unavailable"
      ? t("auth.oidcUnavailableNotice", {
          provider: oidc.providerLabel,
        })
      : params.oidc === "failed"
        ? t("auth.oidcFailedNotice", {
            provider: oidc.providerLabel,
          })
        : undefined;

  return (
    <PublicShell showAboutEntry>
      <Box sx={{ py: { xs: 2.5, sm: 4.5, md: 7 } }}>
        <AuthForm
          mode="login"
          portal="PUBLIC"
          defaultDialCode={defaultDialCode}
          oidcEnabled={oidc.enabled}
          oidcProviderLabel={oidc.providerLabel}
          notice={notice}
        />
      </Box>
    </PublicShell>
  );
}
