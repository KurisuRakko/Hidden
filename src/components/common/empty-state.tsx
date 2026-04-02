import { Box, Typography } from "@mui/material";

type EmptyStateProps = {
  title: string;
  description: string;
  className?: string;
};

export function EmptyState({ title, description, className }: EmptyStateProps) {
  return (
    <Box
      className={className}
      sx={{
        px: { xs: 2.25, sm: 3 },
        py: { xs: 3.5, sm: 5.5 },
        textAlign: "center",
        border: "1px dashed rgba(32, 34, 39, 0.18)",
        borderRadius: "16px",
        bgcolor: "rgba(255, 255, 255, 0.6)",
      }}
    >
      <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: "1.15rem", sm: "1.25rem" } }}>
        {title}
      </Typography>
      <Typography color="text.secondary" className="text-break">
        {description}
      </Typography>
    </Box>
  );
}
