import { Card, CardContent, Stack, Typography } from "@mui/material";

type MetricCardProps = {
  label: string;
  value: string | number;
  supporting?: string;
  className?: string;
};

export function MetricCard({ label, value, supporting, className }: MetricCardProps) {
  return (
    <Card
      className={className}
      sx={{
        bgcolor: "rgba(255, 255, 255, 0.62)",
        border: "1px solid rgba(32, 34, 39, 0.05)",
      }}
    >
      <CardContent sx={{ p: { xs: 2.25, sm: 2.75, md: 3 } }}>
        <Stack spacing={0.75}>
          <Typography variant="overline" color="text.secondary">
            {label}
          </Typography>
          <Typography
            variant="h4"
            sx={{ fontSize: { xs: "1.6rem", sm: "1.95rem" }, overflowWrap: "anywhere" }}
          >
            {value}
          </Typography>
          {supporting ? (
            <Typography color="text.secondary" className="text-break">
              {supporting}
            </Typography>
          ) : null}
        </Stack>
      </CardContent>
    </Card>
  );
}
