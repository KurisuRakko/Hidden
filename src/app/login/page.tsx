import { redirect } from "next/navigation";
import { Box } from "@mui/material";
import { AuthForm } from "@/components/auth/auth-form";
import { PublicShell } from "@/components/layout/public-shell";
import { getViewer } from "@/lib/auth/guards";

type LoginPageProps = {
  searchParams: Promise<{
    disabled?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const viewer = await getViewer();

  if (viewer) {
    redirect(viewer.role === "ADMIN" ? "/admin" : "/dashboard");
  }

  const params = await searchParams;

  return (
    <PublicShell>
      <Box sx={{ py: { xs: 4.5, md: 8 } }}>
        <AuthForm
          mode="login"
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
