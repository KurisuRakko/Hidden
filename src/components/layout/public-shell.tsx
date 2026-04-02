import Link from "next/link";
import {
  SendRounded,
} from "@mui/icons-material";
import {
  AppBar,
  Box,
  Container,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import { getViewer } from "@/lib/auth/guards";
import { PublicHeaderActions } from "@/components/layout/public-header-actions";

type PublicShellProps = {
  children: React.ReactNode;
  hideGuestActions?: boolean;
  homeHref?: string;
};

export async function PublicShell({
  children,
  hideGuestActions = false,
  homeHref = "/",
}: PublicShellProps) {
  const viewer = await getViewer();

  return (
    <Box className="safe-shell" sx={{ minHeight: "100dvh" }}>
      <AppBar position="static" elevation={0}>
        <Toolbar
          sx={{
            minHeight: { xs: 70, md: 72 },
            px: 0,
            py: { xs: 1.25, md: 0 },
          }}
        >
          <Container
            maxWidth="lg"
            sx={{ px: { xs: "16px !important", sm: "24px !important" } }}
          >
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              spacing={2}
            >
              <Stack
                component={Link}
                href={homeHref}
                direction="row"
                spacing={1.5}
                alignItems="center"
                sx={{ minWidth: 0, flex: "1 1 auto" }}
              >
                <Box
                  sx={{
                    width: 38,
                    height: 38,
                    borderRadius: "12px",
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
              <PublicHeaderActions
                viewer={viewer ? { role: viewer.role } : null}
                hideGuestActions={hideGuestActions}
              />
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
