import { Card, CardContent, Stack, Typography } from "@mui/material";

type SectionCardProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
};

export function SectionCard({
  title,
  description,
  children,
  className,
}: SectionCardProps) {
  return (
    <Card className={className}>
      <CardContent sx={{ p: { xs: 2.25, sm: 3, md: 3.5 } }}>
        <Stack spacing={{ xs: 2.5, sm: 3 }}>
          <Stack spacing={0.75}>
            <Typography variant="h5" sx={{ fontSize: { xs: "1.35rem", sm: "1.5rem" } }}>
              {title}
            </Typography>
            {description ? (
              <Typography color="text.secondary">{description}</Typography>
            ) : null}
          </Stack>
          {children}
        </Stack>
      </CardContent>
    </Card>
  );
}
