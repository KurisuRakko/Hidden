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
      <AppBar
        position="sticky"
        elevation={0}
        className="surface-glass motion-fade"
        sx={{
          borderBottom: "1px solid rgba(32, 34, 39, 0.05)",
          color: "text.primary",
        }}
      >
        <Toolbar
          sx={{
            minHeight: { xs: 64, md: 72 },
            px: 0,
            py: { xs: 0.75, md: 0 },
          }}
        >
          <Container
            maxWidth="lg"
            sx={{ px: { xs: "14px !important", sm: "24px !important" } }}
          >
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              spacing={{ xs: 1.5, md: 2 }}
            >
              <Stack
                component={Link}
                href={homeHref}
                direction="row"
                spacing={{ xs: 1.25, sm: 1.5 }}
                alignItems="center"
                sx={{ minWidth: 0, flex: "1 1 auto", maxWidth: { xs: "calc(100% - 52px)", md: "none" } }}
              >
                <Box
                  sx={{
                    width: { xs: 36, md: 38 },
                    height: { xs: 36, md: 38 },
                    borderRadius: { xs: "11px", md: "12px" },
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
                  <Typography variant="h6" sx={{ fontSize: { xs: "1.05rem", md: "1.25rem" } }}>
                    Hidden
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ display: { xs: "none", md: "block" }, pr: 2 }}
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

      <Container
        maxWidth="lg"
        sx={{
          px: { xs: "14px !important", sm: "24px !important" },
          pb: { xs: 5, md: 6 },
        }}
      >
        <Box className="motion-enter-soft motion-delay-1">{children}</Box>
      </Container>
    </Box>
  );
}
