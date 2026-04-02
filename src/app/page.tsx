import {
  ArrowForwardRounded,
  LockOpenRounded,
  PublicRounded,
  SecurityRounded,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { PublicShell } from "@/components/layout/public-shell";
import { createTranslator } from "@/lib/i18n";
import { getRequestLocale } from "@/lib/i18n/server";

export default async function Home() {
  const locale = await getRequestLocale();
  const t = createTranslator(locale);

  return (
    <PublicShell>
      <Box sx={{ py: { xs: 2.25, sm: 5.5, md: 9 } }}>
        <Stack spacing={{ xs: 3.25, sm: 5, md: 6 }}>
          <Box
            className="motion-pop surface-glass"
            sx={{
              borderRadius: { xs: "20px", sm: "24px" },
              px: { xs: 2.1, sm: 3.5, md: 6 },
              py: { xs: 2.5, sm: 5, md: 7 },
              border: "1px solid rgba(30, 31, 36, 0.06)",
            }}
          >
            <Stack spacing={{ xs: 2, sm: 3 }}>
              <Chip
                label={t("home.badge")}
                color="primary"
                className="motion-fade"
                sx={{ width: "fit-content", fontWeight: 600 }}
              />
              <Stack spacing={1.25} maxWidth={{ xs: 560, md: 760 }}>
                <Typography
                  variant="h2"
                  sx={{
                    fontSize: { xs: 26, sm: 40, md: 54 },
                    lineHeight: { xs: 1.14, md: 1.05 },
                  }}
                  className="text-break"
                >
                  {t("home.title")}
                </Typography>
                <Typography
                  variant="h6"
                  color="text.secondary"
                  sx={{
                    fontSize: { xs: "0.95rem", sm: "1.1rem", md: "1.25rem" },
                    maxWidth: 640,
                  }}
                >
                  {t("home.description")}
                </Typography>
              </Stack>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={{ xs: 1.25, sm: 2 }}>
                <Button
                  href="/register"
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForwardRounded />}
                  className="motion-enter-soft motion-delay-1"
                  sx={{ width: { xs: "100%", sm: "auto" } }}
                >
                  {t("common.actions.createAccount")}
                </Button>
                <Button
                  href="/login"
                  variant="outlined"
                  size="large"
                  startIcon={<LockOpenRounded />}
                  className="motion-enter-soft motion-delay-2"
                  sx={{ width: { xs: "100%", sm: "auto" } }}
                >
                  {t("common.actions.signIn")}
                </Button>
              </Stack>
            </Stack>
          </Box>

          <Grid container spacing={{ xs: 2, md: 3 }}>
            {[
              {
                title: t("home.features.publicBoxesTitle"),
                description: t("home.features.publicBoxesDescription"),
                icon: <PublicRounded color="primary" />,
              },
              {
                title: t("home.features.moderationTitle"),
                description: t("home.features.moderationDescription"),
                icon: <SecurityRounded color="primary" />,
              },
              {
                title: t("home.features.inviteOnlyTitle"),
                description: t("home.features.inviteOnlyDescription"),
                icon: <LockOpenRounded color="primary" />,
              },
            ].map((item, index) => (
              <Grid
                key={item.title}
                size={{ xs: 12, md: 4 }}
                className={`motion-enter-soft motion-delay-${Math.min(3, index + 1)}`}
              >
                <Card
                  sx={{ height: "100%" }}
                  className="interactive-panel surface-glass"
                >
                  <CardContent sx={{ p: { xs: 2.5, sm: 3, md: 3.5 } }}>
                    <Stack spacing={{ xs: 1.25, sm: 1.75 }}>
                      {item.icon}
                      <Typography variant="h5">{item.title}</Typography>
                      <Typography color="text.secondary">
                        {item.description}
                      </Typography>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Stack>
      </Box>
    </PublicShell>
  );
}
