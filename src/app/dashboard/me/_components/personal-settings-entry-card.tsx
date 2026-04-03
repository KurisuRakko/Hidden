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
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 2,
                  display: "grid",
                  placeItems: "center",
                  flexShrink: 0,
                  color: "primary.main",
                  bgcolor: "rgba(25, 118, 210, 0.08)",
                }}
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
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: 999,
                  display: "grid",
                  placeItems: "center",
                  flexShrink: 0,
                  color: "text.secondary",
                  bgcolor: "action.hover",
                }}
              >
                <ChevronRightRounded fontSize="small" />
              </Box>
            </Stack>

            <Box
              sx={{
                px: 1.5,
                py: 1.25,
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
                bgcolor: "action.hover",
              }}
            >
              {summary}
            </Box>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
