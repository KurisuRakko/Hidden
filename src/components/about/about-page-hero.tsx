import { Box, Chip, Stack, type SxProps, type Theme, Typography } from "@mui/material";
import { AboutSubnav, type AboutSubnavItem } from "@/components/about/about-subnav";

type AboutPageHeroProps = {
  currentKey: string;
  navigationItems: readonly AboutSubnavItem[];
  badge: string;
  title: string;
  description: string;
  actions: React.ReactNode;
  maxWidth?: number;
  sx?: SxProps<Theme>;
};

export function AboutPageHero({
  currentKey,
  navigationItems,
  badge,
  title,
  description,
  actions,
  maxWidth = 780,
  sx,
}: AboutPageHeroProps) {
  return (
    <Box
      className="motion-pop"
      sx={[
        {
          overflow: "hidden",
          position: "relative",
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
          boxShadow: 1,
          px: { xs: 2.25, sm: 3.5, md: 5 },
          py: { xs: 2.75, sm: 4.5, md: 6 },
          backgroundImage:
            "linear-gradient(140deg, rgba(25, 118, 210, 0.14) 0%, rgba(25, 118, 210, 0.04) 45%, rgba(255, 255, 255, 0.96) 100%)",
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
    >
      <Stack spacing={{ xs: 2, sm: 2.5 }} maxWidth={maxWidth}>
        <AboutSubnav currentKey={currentKey} items={navigationItems} />
        <Chip
          label={badge}
          color="primary"
          sx={{ width: "fit-content", fontWeight: 600 }}
        />
        <Stack spacing={1.25}>
          <Typography
            variant="h3"
            className="text-break"
            sx={{ fontSize: { xs: 28, sm: 38, md: 46 }, lineHeight: 1.12 }}
          >
            {title}
          </Typography>
          <Typography
            color="text.secondary"
            sx={{ fontSize: { xs: "0.98rem", sm: "1.08rem", md: "1.18rem" } }}
          >
            {description}
          </Typography>
        </Stack>
        {actions}
      </Stack>
    </Box>
  );
}
