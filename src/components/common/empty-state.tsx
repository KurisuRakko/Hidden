import { Box, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";

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
        border: (theme) => `1px dashed ${alpha(theme.palette.text.primary, 0.2)}`,
        borderRadius: "16px",
        bgcolor: (theme) => alpha(theme.palette.background.paper, 0.72),
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
