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
import { PublicShell } from "@/components/layout/public-shell";
import { PublicQuestionForm } from "@/components/questions/public-question-form";
import { getPublicBoxBySlug } from "@/features/boxes/service";
import { formatDateTime } from "@/lib/format";

type PublicBoxPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function PublicBoxPage({ params }: PublicBoxPageProps) {
  const { slug } = await params;
  const box = await getPublicBoxBySlug(slug);

  return (
    <PublicShell>
      <Stack spacing={3} sx={{ py: { xs: 4, md: 6 } }}>
        <Card className="motion-enter">
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Stack spacing={2}>
              <Typography variant="h3" className="text-break">
                {box.title}
              </Typography>
              <Typography color="text.secondary" className="text-break">
                {box.description || "Ask something thoughtful and keep it anonymous."}
              </Typography>
              {!box.acceptingQuestions ? (
                <Alert severity="warning">
                  This box is visible, but the owner has paused new submissions.
                </Alert>
              ) : null}
              <PublicQuestionForm
                slug={box.slug}
                disabled={!box.acceptingQuestions}
              />
            </Stack>
          </CardContent>
        </Card>

        <Card className="motion-enter motion-delay-1">
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Stack spacing={3}>
              <Stack spacing={1}>
                <Typography variant="h4">Published answers</Typography>
                <Typography color="text.secondary">
                  Only questions the owner has chosen to publish appear here.
                </Typography>
              </Stack>
              {box.questions.length === 0 ? (
                <Typography color="text.secondary">
                  No public answers yet.
                </Typography>
              ) : (
                box.questions.map((question, index) => (
                  <Stack key={question.id} spacing={2.5} className="interactive-panel">
                    {index > 0 ? <Divider /> : null}
                    <Stack spacing={1.25}>
                      <Typography variant="overline" color="text.secondary">
                        Published {formatDateTime(question.publishedAt)}
                      </Typography>
                      <Typography variant="h6">Question</Typography>
                      <Typography sx={{ whiteSpace: "pre-wrap" }} className="text-break">
                        {question.content}
                      </Typography>
                      {question.imageUrl ? (
                        <Box
                          component="img"
                          src={question.imageUrl}
                          alt="Question attachment"
                          sx={{
                            borderRadius: "14px",
                            maxHeight: 360,
                            width: "100%",
                            objectFit: "cover",
                          }}
                        />
                      ) : null}
                    </Stack>
                    {question.answer ? (
                      <Stack spacing={1.25}>
                        <Typography variant="h6">Answer</Typography>
                        <Typography sx={{ whiteSpace: "pre-wrap" }} className="text-break">
                          {question.answer.content}
                        </Typography>
                        {question.answer.imageUrl ? (
                          <Box
                            component="img"
                            src={question.answer.imageUrl}
                            alt="Answer attachment"
                            sx={{
                              borderRadius: "14px",
                              maxHeight: 360,
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
