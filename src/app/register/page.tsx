import { redirect } from "next/navigation";
import { Box } from "@mui/material";
import { AuthForm } from "@/components/auth/auth-form";
import { PublicShell } from "@/components/layout/public-shell";
import { getViewer } from "@/lib/auth/guards";
import { getAdminAppUrl } from "@/lib/admin-portal";

export default async function RegisterPage() {
  const viewer = await getViewer();

  if (viewer) {
    redirect(viewer.role === "ADMIN" ? getAdminAppUrl("/admin") : "/dashboard");
  }

  return (
    <PublicShell>
      <Box sx={{ py: { xs: 3.5, sm: 5, md: 8 } }}>
        <AuthForm mode="register" />
      </Box>
    </PublicShell>
  );
}
