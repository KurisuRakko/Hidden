import { redirect } from "next/navigation";
import { Box } from "@mui/material";
import { AuthForm } from "@/components/auth/auth-form";
import { PublicShell } from "@/components/layout/public-shell";
import { getViewer } from "@/lib/auth/guards";

export default async function RegisterPage() {
  const viewer = await getViewer();

  if (viewer) {
    redirect(viewer.role === "ADMIN" ? "/admin" : "/dashboard");
  }

  return (
    <PublicShell>
      <Box sx={{ py: { xs: 4.5, md: 8 } }}>
        <AuthForm mode="register" />
      </Box>
    </PublicShell>
  );
}
