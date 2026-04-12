import clsx from "clsx";
import {
  ArrowForwardRounded,
  OpenInNewRounded,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";
type ResourceLinkCardProps = {
  eyebrow?: string;
  title: string;
  description: string;
  href: string;
  actionLabel: string;
  icon: React.ReactNode;
  external?: boolean;
  className?: string;
};

export function ResourceLinkCard({
  eyebrow,
  title,
  description,
  href,
  actionLabel,
  icon,
  external = false,
  className,
}: ResourceLinkCardProps) {
  const ActionIcon = external ? OpenInNewRounded : ArrowForwardRounded;

  return (
    <Card
      className={clsx("interactive-panel", className)}
      sx={{
        height: "100%",
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <CardContent sx={{ p: { xs: 2.25, sm: 2.5, md: 3 }, height: "100%" }}>
        <Stack spacing={2.5} sx={{ height: "100%" }}>
          <Stack spacing={1.25} sx={{ flex: 1 }}>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: 1.5,
                display: "grid",
                placeItems: "center",
                color: "primary.main",
                bgcolor: "rgba(25, 118, 210, 0.08)",
                border: "1px solid",
                borderColor: "rgba(25, 118, 210, 0.18)",
              }}
            >
              {icon}
            </Box>
            {eyebrow ? (
              <Typography
                variant="overline"
                color="text.secondary"
                sx={{ letterSpacing: "0.08em" }}
              >
                {eyebrow}
              </Typography>
            ) : null}
            <Typography variant="h6" className="text-break">
              {title}
            </Typography>
            <Typography color="text.secondary" className="text-break">
              {description}
            </Typography>
          </Stack>

          <Button
            href={href}
            target={external ? "_blank" : undefined}
            rel={external ? "noreferrer" : undefined}
            variant="outlined"
            endIcon={<ActionIcon />}
            sx={{ alignSelf: "flex-start" }}
          >
            {actionLabel}
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
