export const dynamic = "force-dynamic";

import Link from "next/link";
import { EditRounded } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { EmptyState } from "@/components/common/empty-state";
import { PublicShell } from "@/components/layout/public-shell";
import { formatDateTime } from "@/lib/format";
import { getPublicBoxAskPath } from "@/lib/url";
import { loadPublicBoxPageData } from "./_lib/load-public-box-page";
import { PublicBoxWallpaperCard } from "./_components/public-box-wallpaper-card";

const PUBLIC_SURFACE_BACKGROUND = alpha("#ffffff", 0.94);
const PUBLIC_PANEL_BACKGROUND = alpha("#ffffff", 0.9);
const PUBLIC_BORDER_COLOR = "rgba(0, 0, 0, 0.12)";
const PUBLIC_ANSWER_BACKGROUND = alpha("#1976d2", 0.05);
const PUBLIC_ANSWER_BORDER_COLOR = alpha("#1976d2", 0.16);

type PublicBoxPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function PublicBoxPage({ params }: PublicBoxPageProps) {
  const { slug } = await params;
  const { box, locale, t } = await loadPublicBoxPageData(slug);
  const askHref = getPublicBoxAskPath(box.slug);

  return (
    <PublicShell
      back={{ mode: "history", fallbackHref: "/" }}
      contentViewTransitionName="public-page-content"
    >
      <Stack spacing={{ xs: 2.5, md: 3 }} sx={{ py: { xs: 2.75, md: 5 } }}>
        <PublicBoxWallpaperCard wallpaperUrl={box.wallpaperUrl}>
          <Grid container spacing={{ xs: 2, md: 3 }} alignItems="stretch">
            <Grid size={{ xs: 12, md: 7 }}>
              <Stack
                spacing={{ xs: 1.75, md: 2 }}
                sx={{
                  height: "100%",
                  justifyContent: "center",
                }}
              >
                <Typography
                  variant="overline"
                  sx={{
                    letterSpacing: "0.08em",
                    color: box.wallpaperUrl ? "rgba(255, 255, 255, 0.82)" : "text.secondary",
                  }}
                >
                  {t("publicBox.heroEyebrow")}
                </Typography>
                <Typography
                  variant="h3"
                  className="text-break"
                  sx={{
                    color: box.wallpaperUrl ? "#ffffff" : "text.primary",
                    textShadow: box.wallpaperUrl
                      ? "0 10px 24px rgba(18, 22, 28, 0.28)"
                      : "none",
                  }}
                >
                  {box.title}
                </Typography>
                <Typography
                  color={box.wallpaperUrl ? "rgba(255, 255, 255, 0.82)" : "text.secondary"}
                  className="text-break"
                  sx={{ maxWidth: 720 }}
                >
                  {box.description || t("publicBox.defaultDescription")}
                </Typography>
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, md: 5 }}>
              <Box
                sx={{
                  height: "100%",
                  p: { xs: 2, sm: 2.5 },
                  borderRadius: 2,
                  display: "flex",
                  border: `1px solid ${
                    box.wallpaperUrl
                      ? "rgba(255, 255, 255, 0.22)"
                      : PUBLIC_BORDER_COLOR
                  }`,
                  backgroundColor: PUBLIC_SURFACE_BACKGROUND,
                  boxShadow: 4,
                }}
              >
                <Stack spacing={2.5} justifyContent="space-between">
                  <Stack spacing={1}>
                    <Typography variant="h6">{t("publicBox.askTitle")}</Typography>
                    <Typography color="text.secondary">
                      {t("publicBox.askDescription")}
                    </Typography>
                    {!box.acceptingQuestions ? (
                      <Typography color="warning.main" variant="body2">
                        {t("publicBox.pausedNotice")}
                      </Typography>
                    ) : null}
                  </Stack>

                  <Button
                    component={Link}
                    href={askHref}
                    transitionTypes={["public-ask-forward"]}
                    startIcon={<EditRounded />}
                    variant="contained"
                    size="large"
                    disabled={!box.acceptingQuestions}
                    sx={{ width: { xs: "100%", sm: "auto" } }}
                  >
                    {t("publicBox.askAction")}
                  </Button>
                </Stack>
              </Box>
            </Grid>
          </Grid>
        </PublicBoxWallpaperCard>

        <Card>
          <CardContent sx={{ p: { xs: 2.25, sm: 3, md: 4 } }}>
            <Stack spacing={{ xs: 2.5, md: 3 }}>
              <Stack spacing={1}>
                <Typography variant="h4">
                  {t("publicBox.publishedAnswersTitle")}
                </Typography>
                <Typography color="text.secondary">
                  {t("publicBox.publishedAnswersDescription")}
                </Typography>
              </Stack>

              {box.questions.length === 0 ? (
                <EmptyState
                  title={t("publicBox.noAnswers")}
                  description={t("publicBox.noAnswersDescription")}
                />
              ) : (
                box.questions.map((question) => (
                  <Card
                    key={question.id}
                    className="interactive-panel"
                    sx={{
                      border: `1px solid ${PUBLIC_BORDER_COLOR}`,
                      backgroundColor: PUBLIC_PANEL_BACKGROUND,
                    }}
                  >
                    <CardContent sx={{ p: { xs: 2, sm: 2.5, md: 3 } }}>
                      <Stack spacing={2.25}>
                        <Stack spacing={0.75}>
                          <Typography variant="overline" color="text.secondary">
                            {t("publicBox.publishedAt", {
                              value: formatDateTime(question.publishedAt, locale),
                            })}
                          </Typography>
                          <Typography variant="h6">
                            {t("publicBox.questionTitle")}
                          </Typography>
                        </Stack>

                        <Stack spacing={1.25}>
                          <Typography
                            sx={{ whiteSpace: "pre-wrap" }}
                            className="text-break"
                          >
                            {question.content}
                          </Typography>
                          {question.imageUrl ? (
                            <Box
                              component="img"
                              src={question.imageUrl}
                              alt={t("publicBox.questionAttachmentAlt")}
                              sx={{
                                borderRadius: 1.5,
                                maxHeight: { xs: 220, sm: 300, md: 360 },
                                width: "100%",
                                objectFit: "cover",
                              }}
                            />
                          ) : null}
                        </Stack>

                        {question.answer ? (
                          <Box
                            sx={{
                              p: { xs: 1.5, sm: 1.75, md: 2 },
                              borderRadius: 1.75,
                              backgroundColor: PUBLIC_ANSWER_BACKGROUND,
                              border: `1px solid ${PUBLIC_ANSWER_BORDER_COLOR}`,
                            }}
                          >
                            <Stack spacing={1.25}>
                              <Typography variant="h6">
                                {t("publicBox.answerTitle")}
                              </Typography>
                              <Typography
                                sx={{ whiteSpace: "pre-wrap" }}
                                className="text-break"
                              >
                                {question.answer.content}
                              </Typography>
                              {question.answer.imageUrl ? (
                                <Box
                                  component="img"
                                  src={question.answer.imageUrl}
                                  alt={t("publicBox.answerAttachmentAlt")}
                                  sx={{
                                    borderRadius: 1.5,
                                    maxHeight: { xs: 220, sm: 300, md: 360 },
                                    width: "100%",
                                    objectFit: "cover",
                                  }}
                                />
                              ) : null}
                            </Stack>
                          </Box>
                        ) : null}
                      </Stack>
                    </CardContent>
                  </Card>
                ))
              )}
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </PublicShell>
  );
}
