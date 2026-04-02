import Link from "next/link";
import {
  DashboardRounded,
  SecurityRounded,
  SendRounded,
} from "@mui/icons-material";
import {
  AppBar,
  Box,
  Button,
  Container,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import { getViewer } from "@/lib/auth/guards";
import { LogoutButton } from "@/components/common/logout-button";

type PublicShellProps = {
  children: React.ReactNode;
};

export async function PublicShell({ children }: PublicShellProps) {
  const viewer = await getViewer();

  return (
    <Box className="safe-shell" sx={{ minHeight: "100dvh" }}>
      <AppBar position="static" elevation={0}>
        <Toolbar
          sx={{
            minHeight: { xs: "auto", sm: 72 },
            px: 0,
            py: { xs: 1.5, sm: 0 },
          }}
        >
          <Container maxWidth="lg" sx={{ px: { xs: "16px !important", sm: "0 !important" } }}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              alignItems={{ xs: "stretch", sm: "center" }}
              justifyContent="space-between"
              spacing={{ xs: 2.25, sm: 2 }}
            >
              <Stack
                component={Link}
                href="/"
                direction="row"
                spacing={1.5}
                alignItems="center"
                sx={{ minWidth: 0, width: { xs: "100%", sm: "auto" } }}
              >
                <Box
                  sx={{
                    width: 38,
                    height: 38,
                    borderRadius: 2.5,
                    display: "grid",
                    placeItems: "center",
                    bgcolor: "primary.main",
                    color: "primary.contrastText",
                    boxShadow: 2,
                  }}
                >
                  <SendRounded fontSize="small" />
                </Box>
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="h6">Hidden</Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ display: { xs: "none", md: "block" } }}
                  >
                    Anonymous inboxes with moderation
                  </Typography>
                </Box>
              </Stack>

              <Stack
                direction="row"
                spacing={1.25}
                alignItems="center"
                flexWrap="wrap"
                justifyContent={{ xs: "stretch", sm: "flex-end" }}
                sx={{ width: { xs: "100%", sm: "auto" } }}
              >
                {viewer ? (
                  <>
                    <Button
                      component={Link}
                      href={viewer.role === "ADMIN" ? "/admin" : "/dashboard"}
                      startIcon={
                        viewer.role === "ADMIN" ? (
                          <SecurityRounded />
                        ) : (
                          <DashboardRounded />
                        )
                      }
                      size="small"
                      sx={{ flex: { xs: "1 1 160px", sm: "0 0 auto" } }}
                    >
                      {viewer.role === "ADMIN" ? "Admin" : "Dashboard"}
                    </Button>
                    <LogoutButton
                      size="small"
                      sx={{ flex: { xs: "1 1 140px", sm: "0 0 auto" } }}
                    />
                  </>
                ) : (
                  <>
                    <Button
                      component={Link}
                      href="/login"
                      size="small"
                      sx={{ flex: { xs: "1 1 120px", sm: "0 0 auto" } }}
                    >
                      Sign in
                    </Button>
                    <Button
                      component={Link}
                      href="/register"
                      variant="contained"
                      size="small"
                      sx={{ flex: { xs: "1 1 140px", sm: "0 0 auto" } }}
                    >
                      Register
                    </Button>
                  </>
                )}
              </Stack>
            </Stack>
          </Container>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ px: { xs: "16px !important", sm: "24px !important" } }}>
        {children}
      </Container>
    </Box>
  );
}
