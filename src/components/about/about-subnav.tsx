import { Box, Button, Stack } from "@mui/material";

export type AboutSubnavItem = {
  key: string;
  href: string;
  label: string;
};

type AboutSubnavProps = {
  currentKey: string;
  items: readonly AboutSubnavItem[];
};

export function AboutSubnav({ currentKey, items }: AboutSubnavProps) {
  return (
    <Box
      sx={{
        width: "fit-content",
        maxWidth: "100%",
        p: 0.5,
        borderRadius: 999,
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "rgba(255, 255, 255, 0.82)",
      }}
    >
      <Stack direction="row" spacing={0.5} useFlexGap sx={{ flexWrap: "wrap" }}>
        {items.map((item) => {
          const active = item.key === currentKey;

          return (
            <Button
              key={item.key}
              href={item.href}
              aria-current={active ? "page" : undefined}
              variant={active ? "contained" : "text"}
              size="small"
              sx={{ borderRadius: 999, px: 1.5 }}
            >
              {item.label}
            </Button>
          );
        })}
      </Stack>
    </Box>
  );
}
