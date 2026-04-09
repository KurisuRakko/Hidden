import type { Metadata } from "next";
import {
  AdminPanelSettingsRounded,
  ApartmentRounded,
  ArrowBackRounded,
  CodeRounded,
  ForumRounded,
  Inventory2Rounded,
  PublicRounded,
  RocketLaunchRounded,
  StorageRounded,
  ViewQuiltRounded,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Grid,
  Stack,
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
    pathname: publicPagePaths.project,
    locale,
    title: t("project.metadataTitle"),
    description: t("project.metadataDescription"),
  });
}

export default async function ProjectPage() {
  const t = createTranslator(await getRequestLocale());
  const navigationItems = [
    { key: "about", href: publicPagePaths.about, label: t("common.actions.about") },
    {
      key: "project",
      href: publicPagePaths.project,
      label: t("common.actions.viewProject"),
    },
  ] as const;
  const summaryPoints = [
    t("project.summaryPoints.visitors"),
    t("project.summaryPoints.users"),
    t("project.summaryPoints.admins"),
  ];
  const capabilities = [
    {
      title: t("project.capabilities.registrationTitle"),
      description: t("project.capabilities.registrationDescription"),
      icon: <Inventory2Rounded color="primary" />,
    },
    {
      title: t("project.capabilities.boxesTitle"),
      description: t("project.capabilities.boxesDescription"),
      icon: <ViewQuiltRounded color="primary" />,
    },
    {
      title: t("project.capabilities.moderationTitle"),
      description: t("project.capabilities.moderationDescription"),
      icon: <ForumRounded color="primary" />,
    },
    {
      title: t("project.capabilities.governanceTitle"),
      description: t("project.capabilities.governanceDescription"),
      icon: <AdminPanelSettingsRounded color="primary" />,
    },
  ];
  const stackItems = [
    {
      title: t("project.stack.frontendTitle"),
      description: t("project.stack.frontendDescription"),
      icon: <ViewQuiltRounded color="primary" />,
    },
    {
      title: t("project.stack.uiTitle"),
      description: t("project.stack.uiDescription"),
      icon: <PublicRounded color="primary" />,
    },
    {
      title: t("project.stack.dataTitle"),
      description: t("project.stack.dataDescription"),
      icon: <StorageRounded color="primary" />,
    },
    {
      title: t("project.stack.opsTitle"),
      description: t("project.stack.opsDescription"),
      icon: <ApartmentRounded color="primary" />,
    },
  ];
  const deploymentModes = [
    {
      title: t("project.deployment.localTitle"),
      description: t("project.deployment.localDescription"),
    },
    {
      title: t("project.deployment.lanTitle"),
      description: t("project.deployment.lanDescription"),
    },
    {
      title: t("project.deployment.internetTitle"),
      description: t("project.deployment.internetDescription"),
    },
  ];

  return (
    <PublicShell back={{ mode: "href", href: publicPagePaths.about }}>
      <Box sx={{ py: { xs: 2.5, sm: 4.5, md: 7 } }}>
        <Stack spacing={{ xs: 2.5, md: 3 }}>
          <AboutPageHero
            currentKey="project"
            navigationItems={navigationItems}
            badge={t("project.badge")}
            title={t("project.title")}
            description={t("project.description")}
            actions={
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25}>
                <Button
                  component="a"
                  href={siteConfig.projectRepositoryUrl}
                  target="_blank"
                  rel="noreferrer"
                  variant="contained"
                  endIcon={<RocketLaunchRounded />}
                  sx={{ width: { xs: "100%", sm: "auto" } }}
                >
                  {t("common.actions.viewRepository")}
                </Button>
                <Button
                  href={publicPagePaths.about}
                  variant="outlined"
                  startIcon={<ArrowBackRounded />}
                  sx={{ width: { xs: "100%", sm: "auto" } }}
                >
                  {t("project.ctaAction")}
                </Button>
              </Stack>
            }
          />

          <SectionCard
            title={t("project.summaryTitle")}
            description={t("project.summaryDescription")}
            className="motion-enter-soft motion-delay-1"
          >
            <AboutPointList points={summaryPoints} />
          </SectionCard>

          <SectionCard
            title={t("project.capabilitiesTitle")}
            description={t("project.capabilitiesDescription")}
            className="motion-enter-soft motion-delay-2"
          >
            <Grid container spacing={{ xs: 2, md: 2.5 }}>
              {capabilities.map((item, index) => (
                <Grid
                  key={item.title}
                  size={{ xs: 12, sm: 6 }}
                  className={`motion-enter-soft motion-delay-${Math.min(4, index + 1)}`}
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

          <SectionCard
            title={t("project.stackTitle")}
            description={t("project.stackDescription")}
          >
            <Grid container spacing={{ xs: 2, md: 2.5 }}>
              {stackItems.map((item) => (
                <Grid key={item.title} size={{ xs: 12, sm: 6 }}>
                  <AboutDetailCard
                    title={item.title}
                    description={item.description}
                    icon={item.icon}
                  />
                </Grid>
              ))}
            </Grid>
          </SectionCard>

          <SectionCard
            title={t("project.deploymentTitle")}
            description={t("project.deploymentDescription")}
          >
            <Grid container spacing={{ xs: 2, md: 2.5 }}>
              {deploymentModes.map((item) => (
                <Grid key={item.title} size={{ xs: 12, md: 4 }}>
                  <AboutDetailCard
                    title={item.title}
                    description={item.description}
                  />
                </Grid>
              ))}
            </Grid>
          </SectionCard>

          <SectionCard
            title={t("project.linksTitle")}
            description={t("project.linksDescription")}
          >
            <Grid container spacing={{ xs: 2, md: 2.5 }}>
              <Grid size={{ xs: 12, md: 4 }}>
                <ResourceLinkCard
                  eyebrow={t("project.links.repositoryEyebrow")}
                  title={t("project.links.repositoryTitle")}
                  description={t("project.links.repositoryDescription")}
                  href={siteConfig.projectRepositoryUrl}
                  actionLabel={t("common.actions.viewRepository")}
                  icon={<CodeRounded />}
                  external
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <ResourceLinkCard
                  eyebrow={t("project.links.officialEyebrow")}
                  title={t("project.links.officialTitle")}
                  description={t("project.links.officialDescription")}
                  href={siteConfig.officialSiteUrl}
                  actionLabel={t("common.actions.visitWebsite")}
                  icon={<PublicRounded />}
                  external
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <ResourceLinkCard
                  eyebrow={t("project.links.contactEyebrow")}
                  title={t("project.links.contactTitle")}
                  description={t("project.links.contactDescription")}
                  href={supportEmailHref}
                  actionLabel={t("common.actions.sendEmail")}
                  icon={<ForumRounded />}
                  external
                />
              </Grid>
            </Grid>
          </SectionCard>

          <AboutPageClosingCta
            title={t("project.closingTitle")}
            description={t("project.closingDescription")}
            primaryAction={
              <Button
                component="a"
                href={siteConfig.projectRepositoryUrl}
                target="_blank"
                rel="noreferrer"
                variant="contained"
              >
                {t("common.actions.viewRepository")}
              </Button>
            }
            secondaryAction={
              <Button href={publicPagePaths.about} variant="outlined">
                {t("project.ctaAction")}
              </Button>
            }
          />
        </Stack>
      </Box>
    </PublicShell>
  );
}
