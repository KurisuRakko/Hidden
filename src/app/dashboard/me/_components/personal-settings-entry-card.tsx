import Link from "next/link";
import { ChevronRightRounded } from "@mui/icons-material";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";

type PersonalSettingsEntryCardProps = {
  href: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  summary: React.ReactNode;
  transitionTypes?: string[];
  className?: string;
};

export function PersonalSettingsEntryCard({
  href,
  title,
  description,
  icon,
  summary,
  transitionTypes,
  className,
}: PersonalSettingsEntryCardProps) {
  return (
    <Card className={className}>
      <CardActionArea
        component={Link}
        href={href}
        transitionTypes={transitionTypes}
        sx={{ height: "100%" }}
      >
        <CardContent sx={{ p: { xs: 2.25, sm: 2.75 } }}>
          <Stack spacing={2.25}>
            <Stack direction="row" spacing={1.5} alignItems="flex-start">
              <Box
                sx={(theme) => ({
                  width: 48,
                  height: 48,
                  borderRadius: 2,
                  display: "grid",
                  placeItems: "center",
                  flexShrink: 0,
                  color: theme.palette.primary.main,
                  bgcolor: alpha(theme.palette.primary.main, 0.08),
                })}
              >
                {icon}
              </Box>

              <Stack spacing={0.5} sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="h6">{title}</Typography>
                <Typography color="text.secondary">
                  {description}
                </Typography>
              </Stack>

              <Box
                sx={(theme) => ({
                  width: 36,
                  height: 36,
                  borderRadius: 999,
                  display: "grid",
                  placeItems: "center",
                  flexShrink: 0,
                  color: theme.palette.text.secondary,
                  bgcolor: alpha(theme.palette.action.active, 0.06),
                })}
              >
                <ChevronRightRounded fontSize="small" />
              </Box>
            </Stack>

            <Box
              sx={(theme) => ({
                px: 1.5,
                py: 1.25,
                borderRadius: 2,
                border: `1px solid ${theme.palette.divider}`,
                bgcolor: alpha(theme.palette.action.active, 0.035),
              })}
            >
              {summary}
            </Box>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
