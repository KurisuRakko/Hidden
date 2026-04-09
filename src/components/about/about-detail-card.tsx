import { Box, Stack, Typography } from "@mui/material";

type AboutDetailCardProps = {
  title: string;
  description: string;
  icon?: React.ReactNode;
  className?: string;
};

export function AboutDetailCard({
  title,
  description,
  icon,
  className,
}: AboutDetailCardProps) {
  return (
    <Box
      className={className}
      sx={{
        height: "100%",
        p: { xs: 2, sm: 2.25, md: 2.5 },
        borderRadius: 2,
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
      }}
    >
      <Stack spacing={1.25}>
        {icon}
        <Typography variant="h6">{title}</Typography>
        <Typography color="text.secondary" className="text-break">
          {description}
        </Typography>
      </Stack>
    </Box>
  );
}
