import { redirect } from "next/navigation";
import { Box } from "@mui/material";
import { AuthForm } from "@/components/auth/auth-form";
import { PublicShell } from "@/components/layout/public-shell";
import { getViewer } from "@/lib/auth/guards";
import { getAdminAppUrl } from "@/lib/admin-portal";

type LoginPageProps = {
  searchParams: Promise<{
    disabled?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const viewer = await getViewer();

  if (viewer) {
    redirect(viewer.role === "ADMIN" ? getAdminAppUrl("/admin") : "/dashboard");
  }

  const params = await searchParams;

  return (
    <PublicShell>
      <Box sx={{ py: { xs: 3.5, sm: 5, md: 8 } }}>
        <AuthForm
          mode="login"
          portal="PUBLIC"
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
