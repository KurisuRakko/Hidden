export const dynamic = "force-dynamic";

import {
  Alert,
  Box,
  Stack,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { PublicShell } from "@/components/layout/public-shell";
import { PublicQuestionForm } from "@/components/questions/public-question-form";
import { getPublicBoxPath } from "@/lib/url";
import { PublicBoxWallpaperCard } from "../_components/public-box-wallpaper-card";
import { loadPublicBoxPageData } from "../_lib/load-public-box-page";

type PublicAskPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function PublicAskPage({ params }: PublicAskPageProps) {
  const { slug } = await params;
  const { box, t } = await loadPublicBoxPageData(slug);
  const boxHref = getPublicBoxPath(box.slug);

  return (
    <PublicShell
      back={{
        mode: "href",
        href: boxHref,
        transitionTypes: ["public-ask-back"],
      }}
    >
      <Stack spacing={{ xs: 2.5, md: 3 }} sx={{ py: { xs: 2.75, md: 5 } }}>
        <PublicBoxWallpaperCard wallpaperUrl={box.wallpaperUrl} className="motion-pop">
          <Box sx={{ maxWidth: 720 }}>
            <Box
              sx={(theme) => ({
                p: { xs: 2, sm: 2.5, md: 3 },
                borderRadius: 2,
                border: `1px solid ${
                  box.wallpaperUrl
                    ? "rgba(255, 255, 255, 0.22)"
                    : theme.palette.divider
                }`,
                backgroundColor: box.wallpaperUrl
                  ? alpha("#ffffff", 0.94)
                  : alpha(theme.palette.background.paper, 0.94),
                boxShadow: theme.shadows[4],
              })}
            >
              <Stack spacing={{ xs: 2.25, md: 2.5 }}>
                <Stack spacing={1}>
                  <Typography variant="overline" color="text.secondary">
                    {t("publicAsk.eyebrow")}
                  </Typography>
                  <Typography variant="h4" className="text-break">
                    {t("publicAsk.title")}
                  </Typography>
                  <Typography color="text.secondary" className="text-break">
                    {t("publicAsk.description", {
                      title: box.title,
                    })}
                  </Typography>
                </Stack>

                {!box.acceptingQuestions ? (
                  <Alert severity="warning" className="status-feedback">
                    {t("publicAsk.pausedDescription")}
                  </Alert>
                ) : null}

                <PublicQuestionForm
                  slug={box.slug}
                  disabled={!box.acceptingQuestions}
                  returnHref={boxHref}
                  returnTransitionTypes={["public-ask-back"]}
                />
              </Stack>
            </Box>
          </Box>
        </PublicBoxWallpaperCard>
      </Stack>
    </PublicShell>
  );
}
