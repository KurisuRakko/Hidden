import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { Box } from "@mui/material";
import { AuthForm } from "@/components/auth/auth-form";
import { PublicShell } from "@/components/layout/public-shell";
import { getViewer } from "@/lib/auth/guards";
import { getAdminAppUrl } from "@/lib/admin-portal";
import { getDefaultDialCodeFromAcceptLanguage } from "@/lib/phone";

export default async function RegisterPage() {
  const viewer = await getViewer();
  const headerStore = await headers();
  const defaultDialCode = getDefaultDialCodeFromAcceptLanguage(
    headerStore.get("accept-language"),
  );

  if (viewer) {
    redirect(viewer.role === "ADMIN" ? getAdminAppUrl("/admin") : "/dashboard");
  }

  return (
    <PublicShell>
      <Box sx={{ py: { xs: 3.5, sm: 5, md: 8 } }}>
        <AuthForm mode="register" defaultDialCode={defaultDialCode} />
      </Box>
    </PublicShell>
  );
}
