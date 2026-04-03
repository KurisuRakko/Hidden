import {
  Card,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";

type SectionCardProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
  variant?: "primary" | "secondary";
};

export function SectionCard({
  title,
  description,
  children,
  className,
  action,
  variant = "primary",
}: SectionCardProps) {
  const isSecondary = variant === "secondary";

  return (
    <Card className={className}>
      <CardContent
        sx={{
          p: isSecondary
            ? { xs: 2, sm: 2.25, md: 2.5 }
            : { xs: 2.25, sm: 3, md: 3.5 },
        }}
      >
        <Stack spacing={isSecondary ? { xs: 2, sm: 2.25 } : { xs: 2.5, sm: 3 }}>
          <Stack
            direction={{ xs: "column", sm: action ? "row" : "column" }}
            spacing={isSecondary ? 1.25 : 1.5}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: action ? "flex-start" : "stretch" }}
          >
            <Stack spacing={0.75} sx={{ minWidth: 0, flex: 1 }}>
              <Typography
                variant={isSecondary ? "h6" : "h5"}
                sx={{
                  fontSize: isSecondary
                    ? { xs: "1.1rem", sm: "1.2rem" }
                    : { xs: "1.35rem", sm: "1.5rem" },
                }}
              >
                {title}
              </Typography>
              {description ? (
                <Typography color="text.secondary" sx={{ maxWidth: 720 }}>
                  {description}
                </Typography>
              ) : null}
            </Stack>
            {action ? (
              <Stack sx={{ width: { xs: "100%", sm: "auto" }, flexShrink: 0 }}>
                {action}
              </Stack>
            ) : null}
          </Stack>
          {children}
        </Stack>
      </CardContent>
    </Card>
  );
}
