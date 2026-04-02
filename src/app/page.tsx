import Link from "next/link";
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

export default function Home() {
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
                label="Invite-only anonymous Q&A"
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
                  Hidden gives every creator a calm, moderated anonymous inbox.
                </Typography>
                <Typography
                  variant="h6"
                  color="text.secondary"
                  sx={{
                    fontSize: { xs: "0.95rem", sm: "1.1rem", md: "1.25rem" },
                    maxWidth: 640,
                  }}
                >
                  Visitors ask freely. Owners review first, answer on their own
                  pace, and publish only what deserves a place on the public page.
                </Typography>
              </Stack>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={{ xs: 1.25, sm: 2 }}>
                <Button
                  component={Link}
                  href="/register"
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForwardRounded />}
                  className="motion-enter-soft motion-delay-1"
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
                  className="motion-enter-soft motion-delay-2"
                  sx={{ width: { xs: "100%", sm: "auto" } }}
                >
                  Sign in
                </Button>
              </Stack>
            </Stack>
          </Box>

          <Grid container spacing={{ xs: 2, md: 3 }}>
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
