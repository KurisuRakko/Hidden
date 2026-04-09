"use client";

import {
  Box,
  Button,
  Card,
  CardContent,
  CssBaseline,
  Link,
  Stack,
  ThemeProvider,
  Typography,
  createTheme,
} from "@mui/material";
import { siteConfig, supportEmailHref } from "@/lib/site";

type ErrorLike = Error & {
  digest?: string;
};

type StandaloneErrorScreenProps = {
  error: ErrorLike;
  homeHref: string;
  officialHref: string;
};

const standaloneErrorTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2",
    },
    background: {
      default: "#fafafa",
      paper: "#ffffff",
    },
    text: {
      primary: "rgba(0, 0, 0, 0.87)",
      secondary: "rgba(0, 0, 0, 0.6)",
    },
    error: {
      main: "#d32f2f",
    },
  },
  shape: {
    borderRadius: 8,
  },
  typography: {
    fontFamily:
      "var(--font-noto-sans-sc), var(--font-roboto), Roboto, sans-serif",
    h5: {
      fontWeight: 500,
      lineHeight: 1.3,
    },
    button: {
      fontWeight: 500,
      textTransform: "none",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          minHeight: 40,
          borderRadius: 4,
          paddingInline: 16,
        },
      },
    },
    MuiCard: {
      defaultProps: {
        elevation: 1,
      },
      styleOverrides: {
        root: {
          borderRadius: 8,
          backgroundImage: "none",
        },
      },
    },
  },
});

function resolveErrorCode(error: ErrorLike) {
  const message = error.message?.trim() || "Unknown error";
  const digest = error.digest?.trim();

  return digest ? `${message} (${digest})` : message;
}

export function StandaloneErrorScreen({
  error,
  homeHref,
  officialHref,
}: StandaloneErrorScreenProps) {
  const errorCode = resolveErrorCode(error);

  return (
    <ThemeProvider theme={standaloneErrorTheme}>
      <CssBaseline />
      <Stack
        component="main"
        alignItems="center"
        justifyContent="center"
        sx={{
          minHeight: "100dvh",
          px: 2,
          py: 3,
          bgcolor: "background.default",
        }}
      >
        <Card sx={{ width: "100%", maxWidth: 560 }}>
          <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
            <Stack spacing={2}>
              <Stack spacing={0.75}>
                <Typography variant="h5">
                  诶，Hidden 不小心挂掉了.......
                </Typography>
                <Typography color="text.secondary">
                  Oops, Hidden crashed unexpectedly.
                </Typography>
              </Stack>

              <Box
                sx={{
                  p: 1.5,
                  bgcolor: "rgba(211, 47, 47, 0.06)",
                  border: "1px solid",
                  borderColor: "rgba(211, 47, 47, 0.24)",
                  borderRadius: 1,
                }}
              >
                <Typography
                  component="p"
                  sx={{ mb: 0.75, fontSize: "0.9rem", color: "error.main" }}
                >
                  错误代码是： / Error code:
                </Typography>
                <Typography
                  component="pre"
                  sx={{
                    m: 0,
                    fontSize: "0.82rem",
                    lineHeight: 1.5,
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    fontFamily:
                      "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                  }}
                >
                  {errorCode}
                </Typography>
              </Box>

              <Stack spacing={0.5}>
                <Typography>
                  您可以联系 {siteConfig.creatorName} 获得协助 / Contact{" "}
                  {siteConfig.creatorName} for help
                </Typography>
                <Typography color="text.secondary">
                  邮箱 / Email:{" "}
                  <Link href={supportEmailHref} underline="hover">
                    {siteConfig.supportEmail}
                  </Link>
                </Typography>
              </Stack>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25}>
                <Button
                  component="a"
                  href={homeHref}
                  variant="contained"
                  fullWidth
                >
                  返回 Hidden 首页 / Go to Hidden Home
                </Button>
                <Button
                  component="a"
                  href={officialHref}
                  variant="outlined"
                  fullWidth
                >
                  前往 {siteConfig.creatorName} 官网 / Visit{" "}
                  {siteConfig.creatorName}
                </Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </ThemeProvider>
  );
}
