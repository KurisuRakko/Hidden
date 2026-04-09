import { Box, Stack, Typography } from "@mui/material";

type AboutPointListProps = {
  points: readonly string[];
};

export function AboutPointList({ points }: AboutPointListProps) {
  return (
    <Stack spacing={1.5}>
      {points.map((point) => (
        <Stack key={point} direction="row" spacing={1.25} alignItems="flex-start">
          <Box
            sx={{
              mt: 0.75,
              width: 8,
              height: 8,
              borderRadius: 999,
              flexShrink: 0,
              bgcolor: "primary.main",
            }}
          />
          <Typography color="text.secondary" className="text-break">
            {point}
          </Typography>
        </Stack>
      ))}
    </Stack>
  );
}
