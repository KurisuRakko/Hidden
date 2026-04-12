import Link from "next/link";
import {
  InfoOutlined,
  SendRounded,
} from "@mui/icons-material";
import {
  AppBar,
  Box,
  Container,
  IconButton,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import { getViewer } from "@/lib/auth/guards";
import {
  HeaderLeadingBackAction,
  type HeaderBackAction,
} from "@/components/layout/header-leading-back-action";
import { PublicHeaderActions } from "@/components/layout/public-header-actions";
import { createTranslator } from "@/lib/i18n";
import { getRequestLocale } from "@/lib/i18n/server";
import { publicPagePaths } from "@/lib/site";

type PublicShellProps = {
  children: React.ReactNode;
  hideGuestActions?: boolean;
  homeHref?: string;
  back?: HeaderBackAction;
  contentViewTransitionName?: string;
  showAboutEntry?: boolean;
};

export async function PublicShell({
  children,
  hideGuestActions = false,
  homeHref = "/",
  back,
  contentViewTransitionName,
  showAboutEntry = false,
}: PublicShellProps) {
  const viewer = await getViewer();
  const locale = await getRequestLocale();
  const t = createTranslator(locale);
  const headerIdentity = (
    <Stack
      direction="row"
      spacing={{ xs: 1.25, sm: 1.5 }}
      alignItems="center"
      sx={{
        minWidth: 0,
      }}
    >
      {back ? (
        <HeaderLeadingBackAction back={back} variant="public" />
      ) : (
        <Box
          sx={{
            width: { xs: 36, md: 38 },
            height: { xs: 36, md: 38 },
            borderRadius: 1.5,
            display: "grid",
            placeItems: "center",
            bgcolor: "primary.main",
            color: "primary.contrastText",
            boxShadow: 2,
          }}
        >
          <SendRounded fontSize="small" />
        </Box>
      )}
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="h6" sx={{ fontSize: { xs: "1.05rem", md: "1.25rem" } }}>
          Hidden
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ display: { xs: "none", md: "block" }, pr: 2 }}
        >
          {t("site.tagline")}
        </Typography>
      </Box>
    </Stack>
  );

  return (
    <Box className="safe-shell" sx={{ minHeight: "100dvh" }}>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: "background.paper",
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
              <Box sx={{ flex: "1 1 auto", minWidth: 0 }}>
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={{ xs: 1, md: 1.25 }}
                  sx={{ minWidth: 0 }}
                >
                  {showAboutEntry && !back ? (
                    <IconButton
                      href={publicPagePaths.about}
                      aria-label={t("common.actions.about")}
                      size="small"
                      sx={{
                        flexShrink: 0,
                        width: { xs: 36, md: 38 },
                        height: { xs: 36, md: 38 },
                        borderRadius: 999,
                        border: 1,
                        borderColor: "divider",
                        bgcolor: "background.paper",
                        boxShadow: 1,
                      }}
                    >
                      <InfoOutlined fontSize="small" />
                    </IconButton>
                  ) : null}
                  <Box sx={{ flex: "1 1 auto", minWidth: 0 }}>
                    {back ? (
                      headerIdentity
                    ) : (
                      <Link
                        href={homeHref}
                        style={{
                          color: "inherit",
                          display: "block",
                          minWidth: 0,
                          textDecoration: "none",
                        }}
                      >
                        {headerIdentity}
                      </Link>
                    )}
                  </Box>
                </Stack>
              </Box>
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
        <Box
          style={
            contentViewTransitionName
              ? { viewTransitionName: contentViewTransitionName }
              : undefined
          }
        >
          {children}
        </Box>
      </Container>
    </Box>
  );
}
