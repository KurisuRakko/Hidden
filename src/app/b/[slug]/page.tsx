export const dynamic = "force-dynamic";

import {
  Alert,
  Box,
  Card,
  CardContent,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { PublicShell } from "@/components/layout/public-shell";
import { PublicQuestionForm } from "@/components/questions/public-question-form";
import { getPublicBoxBySlug } from "@/features/boxes/service";
import { formatDateTime } from "@/lib/format";
import { createTranslator } from "@/lib/i18n";
import { getRequestLocale } from "@/lib/i18n/server";

type PublicBoxPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function PublicBoxPage({ params }: PublicBoxPageProps) {
  const { slug } = await params;
  const box = await getPublicBoxBySlug(slug);
  const locale = await getRequestLocale();
  const t = createTranslator(locale);

  return (
    <PublicShell>
      <Stack spacing={{ xs: 2.5, md: 3 }} sx={{ py: { xs: 2.75, md: 5 } }}>
        <Card
          className={`motion-pop${box.wallpaperUrl ? "" : " surface-glass"}`}
          sx={{
            position: "relative",
            overflow: "hidden",
          }}
        >
          {box.wallpaperUrl ? (
            <>
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  backgroundImage: `url("${box.wallpaperUrl}")`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(180deg, rgba(18, 22, 28, 0.2) 0%, rgba(18, 22, 28, 0.52) 100%)",
                }}
              />
            </>
          ) : null}

          <CardContent
            sx={{
              position: "relative",
              p: { xs: 2.25, sm: 3, md: 4 },
            }}
          >
            <Box
              sx={{
                p: { xs: 2, sm: 2.5, md: 3 },
                borderRadius: "24px",
                bgcolor: box.wallpaperUrl ? alpha("#ffffff", 0.82) : "transparent",
                backdropFilter: box.wallpaperUrl ? "blur(14px)" : "none",
                WebkitBackdropFilter: box.wallpaperUrl ? "blur(14px)" : "none",
              }}
            >
              <Stack spacing={{ xs: 1.75, md: 2 }}>
                <Typography variant="h3" className="text-break">
                  {box.title}
                </Typography>
                <Typography color="text.secondary" className="text-break">
                  {box.description || t("publicBox.defaultDescription")}
                </Typography>
                {!box.acceptingQuestions ? (
                  <Alert severity="warning" className="status-feedback">
                    {t("publicBox.pausedNotice")}
                  </Alert>
                ) : null}
                <PublicQuestionForm
                  slug={box.slug}
                  disabled={!box.acceptingQuestions}
                />
              </Stack>
            </Box>
          </CardContent>
        </Card>

        <Card className="motion-enter-soft motion-delay-1 surface-glass">
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
                <Alert severity="info" className="status-feedback">
                  {t("publicBox.noAnswers")}
                </Alert>
              ) : (
                box.questions.map((question, index) => (
                  <Stack
                    key={question.id}
                    spacing={2}
                    className={`interactive-panel motion-enter-soft motion-delay-${Math.min(
                      4,
                      index + 1,
                    )}`}
                    sx={{
                      p: { xs: 2, sm: 2.5 },
                      borderRadius: "18px",
                      bgcolor: "rgba(255, 255, 255, 0.52)",
                      border: "1px solid rgba(32, 34, 39, 0.06)",
                    }}
                  >
                    {index > 0 ? <Divider className="list-divider-soft" /> : null}
                    <Stack spacing={1}>
                      <Typography variant="overline" color="text.secondary">
                        {t("publicBox.publishedAt", {
                          value: formatDateTime(question.publishedAt, locale),
                        })}
                      </Typography>
                      <Typography variant="h6">
                        {t("publicBox.questionTitle")}
                      </Typography>
                      <Typography sx={{ whiteSpace: "pre-wrap" }} className="text-break">
                        {question.content}
                      </Typography>
                      {question.imageUrl ? (
                        <Box
                          component="img"
                          src={question.imageUrl}
                          alt={t("publicBox.questionAttachmentAlt")}
                          sx={{
                            borderRadius: "14px",
                            maxHeight: { xs: 220, sm: 300, md: 360 },
                            width: "100%",
                            objectFit: "cover",
                          }}
                        />
                      ) : null}
                    </Stack>
                    {question.answer ? (
                      <Stack
                        spacing={1}
                        sx={{
                          pt: 0.5,
                          borderTop: "1px solid rgba(32, 34, 39, 0.06)",
                        }}
                      >
                        <Typography variant="h6">
                          {t("publicBox.answerTitle")}
                        </Typography>
                        <Typography sx={{ whiteSpace: "pre-wrap" }} className="text-break">
                          {question.answer.content}
                        </Typography>
                        {question.answer.imageUrl ? (
                          <Box
                            component="img"
                            src={question.answer.imageUrl}
                            alt={t("publicBox.answerAttachmentAlt")}
                            sx={{
                              borderRadius: "14px",
                              maxHeight: { xs: 220, sm: 300, md: 360 },
                              width: "100%",
                              objectFit: "cover",
                            }}
                          />
                        ) : null}
                      </Stack>
                    ) : null}
                  </Stack>
                ))
              )}
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </PublicShell>
  );
}
