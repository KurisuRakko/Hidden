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
      <CardContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
        <Stack spacing={3}>
          <Stack spacing={1}>
            <Typography variant="h5">{title}</Typography>
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
