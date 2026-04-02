import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { Box } from "@mui/material";
import {
  getAdminAppUrl,
  getPublicAppUrl,
  requireAdminPortalPage,
} from "@/lib/admin-portal";
import { getViewer } from "@/lib/auth/guards";
import { AuthForm } from "@/components/auth/auth-form";
import { PublicShell } from "@/components/layout/public-shell";
import { getDefaultDialCodeFromAcceptLanguage } from "@/lib/phone";

type AdminLoginPageProps = {
  searchParams: Promise<{
    disabled?: string;
  }>;
};

export default async function AdminLoginPage({
  searchParams,
}: AdminLoginPageProps) {
  await requireAdminPortalPage();
  const viewer = await getViewer();
  const headerStore = await headers();
  const defaultDialCode = getDefaultDialCodeFromAcceptLanguage(
    headerStore.get("accept-language"),
  );

  if (viewer?.role === "ADMIN") {
    redirect(getAdminAppUrl("/admin"));
  }

  if (viewer?.role === "USER") {
    redirect(getPublicAppUrl("/dashboard"));
  }

  const params = await searchParams;

  return (
    <PublicShell hideGuestActions homeHref="/admin-login">
      <Box sx={{ py: { xs: 3.5, sm: 5, md: 8 } }}>
        <AuthForm
          mode="login"
          portal="ADMIN"
          defaultDialCode={defaultDialCode}
          notice={
            params.disabled
              ? "This admin account is not active right now. Please contact another administrator."
              : "This sign-in is only available through the internal admin portal."
          }
        />
      </Box>
    </PublicShell>
  );
}
