import Link from "next/link";
import {
  ArrowForwardRounded,
  DashboardRounded,
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

export default function Home() {
  return (
    <PublicShell>
      <Box sx={{ py: { xs: 6, md: 10 } }}>
        <Stack spacing={6}>
          <Box
            className="motion-enter"
            sx={{
              borderRadius: 7,
              px: { xs: 3, md: 6 },
              py: { xs: 4, md: 7 },
              bgcolor: "rgba(255, 255, 255, 0.9)",
              boxShadow: 4,
              border: "1px solid rgba(30, 31, 36, 0.06)",
            }}
          >
            <Stack spacing={3}>
              <Chip
                label="Invite-only anonymous Q&A"
                color="primary"
                sx={{ width: "fit-content", fontWeight: 600 }}
              />
              <Stack spacing={2} maxWidth={760}>
                <Typography variant="h2" sx={{ fontSize: { xs: 34, md: 54 } }} className="text-break">
                  Hidden gives every creator a calm, moderated anonymous inbox.
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  Visitors ask freely. Owners review first, answer on their own
                  pace, and publish only what deserves a place on the public page.
                </Typography>
              </Stack>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <Button
                  component={Link}
                  href="/register"
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForwardRounded />}
                  sx={{ width: { xs: "100%", sm: "auto" } }}
                >
                  Create account
                </Button>
                <Button
                  component={Link}
                  href="/login"
                  variant="outlined"
                  size="large"
                  startIcon={<LockOpenRounded />}
                  sx={{ width: { xs: "100%", sm: "auto" } }}
                >
                  Sign in
                </Button>
                <Button
                  component={Link}
                  href="/dashboard"
                  variant="text"
                  size="large"
                  startIcon={<DashboardRounded />}
                  sx={{ width: { xs: "100%", sm: "auto" } }}
                >
                  Open dashboard
                </Button>
              </Stack>
            </Stack>
          </Box>

          <Grid container spacing={3}>
            {[
              {
                title: "Public question boxes",
                description:
                  "Each box gets a clean public page at /b/[slug] with published answers and a one-image anonymous submission form.",
                icon: <PublicRounded color="primary" />,
              },
              {
                title: "Moderation-first workflow",
                description:
                  "Every new question starts pending. Users can reject, delete, answer, and publish without exposing drafts.",
                icon: <SecurityRounded color="primary" />,
              },
              {
                title: "Invite-only growth",
                description:
                  "Registration uses phone number, password, and invite code so the first version stays controlled and operable.",
                icon: <LockOpenRounded color="primary" />,
              },
            ].map((item, index) => (
              <Grid
                key={item.title}
                size={{ xs: 12, md: 4 }}
                className={`motion-enter motion-delay-${Math.min(4, index + 1)}`}
              >
                <Card sx={{ height: "100%" }} className="interactive-panel">
                  <CardContent sx={{ p: 3.5 }}>
                    <Stack spacing={2}>
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
