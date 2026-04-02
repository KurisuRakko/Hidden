import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { Box } from "@mui/material";
import { AuthForm } from "@/components/auth/auth-form";
import { PublicShell } from "@/components/layout/public-shell";
import { getViewer } from "@/lib/auth/guards";
import { getAdminAppUrl } from "@/lib/admin-portal";
import { getDefaultDialCodeFromAcceptLanguage } from "@/lib/phone";

type LoginPageProps = {
  searchParams: Promise<{
    disabled?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const viewer = await getViewer();
  const headerStore = await headers();
  const defaultDialCode = getDefaultDialCodeFromAcceptLanguage(
    headerStore.get("accept-language"),
  );

  if (viewer) {
    redirect(viewer.role === "ADMIN" ? getAdminAppUrl("/admin") : "/dashboard");
  }

  const params = await searchParams;

  return (
    <PublicShell>
      <Box sx={{ py: { xs: 2.5, sm: 4.5, md: 7 } }}>
        <AuthForm
          mode="login"
          portal="PUBLIC"
          defaultDialCode={defaultDialCode}
          notice={
            params.disabled
              ? "Your account is not active right now. Please contact an administrator."
              : undefined
          }
        />
      </Box>
    </PublicShell>
  );
}
