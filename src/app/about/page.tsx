import type { Metadata } from "next";
import {
  ArrowForwardRounded,
  CodeRounded,
  MailOutlineRounded,
  PublicRounded,
  ShieldRounded,
  StyleRounded,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { AboutDetailCard } from "@/components/about/about-detail-card";
import { AboutPageClosingCta } from "@/components/about/about-page-closing-cta";
import { AboutPageHero } from "@/components/about/about-page-hero";
import { AboutPointList } from "@/components/about/about-point-list";
import { ResourceLinkCard } from "@/components/common/resource-link-card";
import { SectionCard } from "@/components/common/section-card";
import { PublicShell } from "@/components/layout/public-shell";
import { createTranslator } from "@/lib/i18n";
import { getRequestLocale } from "@/lib/i18n/server";
import { buildPublicMetadata } from "@/lib/public-metadata";
import { publicPagePaths, siteConfig, supportEmailHref } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const t = createTranslator(locale);

  return buildPublicMetadata({
    pathname: publicPagePaths.about,
    locale,
    title: t("about.metadataTitle"),
    description: t("about.metadataDescription"),
  });
}

export default async function AboutPage() {
  const t = createTranslator(await getRequestLocale());
  const navigationItems = [
    { key: "about", href: publicPagePaths.about, label: t("common.actions.about") },
    {
      key: "project",
      href: publicPagePaths.project,
      label: t("common.actions.viewProject"),
    },
  ] as const;
  const overviewPoints = [
    t("about.overviewPoints.identity"),
    t("about.overviewPoints.product"),
    t("about.overviewPoints.engineering"),
  ];
  const principles = [
    {
      title: t("about.principles.moderationTitle"),
      description: t("about.principles.moderationDescription"),
      icon: <ShieldRounded color="primary" />,
    },
    {
      title: t("about.principles.inviteTitle"),
      description: t("about.principles.inviteDescription"),
      icon: <PublicRounded color="primary" />,
    },
    {
      title: t("about.principles.md2Title"),
      description: t("about.principles.md2Description"),
      icon: <StyleRounded color="primary" />,
    },
  ];

  return (
    <PublicShell back={{ mode: "history", fallbackHref: publicPagePaths.home }}>
      <Box sx={{ py: { xs: 2.5, sm: 4.5, md: 7 } }}>
        <Stack spacing={{ xs: 2.5, md: 3 }}>
          <AboutPageHero
            currentKey="about"
            navigationItems={navigationItems}
            badge={t("about.badge")}
            title={t("about.title")}
            description={t("about.description")}
            maxWidth={760}
            actions={
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25}>
                <Button
                  component="a"
                  href={siteConfig.officialSiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  variant="contained"
                  endIcon={<ArrowForwardRounded />}
                  sx={{ width: { xs: "100%", sm: "auto" } }}
                >
                  {t("common.actions.visitWebsite")}
                </Button>
                <Button
                  href={publicPagePaths.project}
                  variant="outlined"
                  endIcon={<ArrowForwardRounded />}
                  sx={{ width: { xs: "100%", sm: "auto" } }}
                >
                  {t("common.actions.viewProject")}
                </Button>
              </Stack>
            }
          />

          <Grid container spacing={{ xs: 2, md: 3 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <ResourceLinkCard
                eyebrow={t("about.cards.officialSiteEyebrow")}
                title={t("about.cards.officialSiteTitle")}
                description={t("about.cards.officialSiteDescription")}
                href={siteConfig.officialSiteUrl}
                actionLabel={t("common.actions.visitWebsite")}
                icon={<PublicRounded />}
                external
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <ResourceLinkCard
                eyebrow={t("about.cards.repositoryEyebrow")}
                title={t("about.cards.repositoryTitle")}
                description={t("about.cards.repositoryDescription")}
                href={siteConfig.projectRepositoryUrl}
                actionLabel={t("common.actions.viewRepository")}
                icon={<CodeRounded />}
                external
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <ResourceLinkCard
                eyebrow={t("about.cards.supportEyebrow")}
                title={t("about.cards.supportTitle")}
                description={t("about.cards.supportDescription")}
                href={supportEmailHref}
                actionLabel={t("common.actions.sendEmail")}
                icon={<MailOutlineRounded />}
                external
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <ResourceLinkCard
                eyebrow={t("about.cards.projectEyebrow")}
                title={t("about.cards.projectTitle")}
                description={t("about.cards.projectDescription")}
                href={publicPagePaths.project}
                actionLabel={t("common.actions.viewProject")}
                icon={<StyleRounded />}
              />
            </Grid>
          </Grid>

          <SectionCard
            title={t("about.overviewTitle")}
            description={t("about.overviewDescription")}
            className="motion-enter-soft motion-delay-1"
          >
            <Stack spacing={1.5}>
              <Typography variant="subtitle1" className="text-break">
                {siteConfig.creatorName}
              </Typography>
              <AboutPointList points={overviewPoints} />
            </Stack>
          </SectionCard>

          <SectionCard
            title={t("about.principlesTitle")}
            description={t("about.principlesDescription")}
            action={
              <Button href="/project" variant="contained">
                {t("about.projectCtaAction")}
              </Button>
            }
            className="motion-enter-soft motion-delay-2"
          >
            <Grid container spacing={{ xs: 2, md: 2.5 }}>
              {principles.map((item, index) => (
                <Grid
                  key={item.title}
                  size={{ xs: 12, md: 4 }}
                  className={`motion-enter-soft motion-delay-${Math.min(3, index + 1)}`}
                >
                  <AboutDetailCard
                    title={item.title}
                    description={item.description}
                    icon={item.icon}
                  />
                </Grid>
              ))}
            </Grid>
          </SectionCard>

          <AboutPageClosingCta
            title={t("about.closingTitle")}
            description={t("about.closingDescription")}
            primaryAction={
              <Button href={publicPagePaths.project} variant="contained">
                {t("common.actions.viewProject")}
              </Button>
            }
            secondaryAction={
              <Button
                component="a"
                href={siteConfig.officialSiteUrl}
                target="_blank"
                rel="noreferrer"
                variant="outlined"
              >
                {t("common.actions.visitWebsite")}
              </Button>
            }
          />
        </Stack>
      </Box>
    </PublicShell>
  );
}
