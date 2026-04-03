import { Box, Card, CardContent } from "@mui/material";

type PublicBoxWallpaperCardProps = {
  wallpaperUrl: string | null;
  children: React.ReactNode;
  className?: string;
};

export function PublicBoxWallpaperCard({
  wallpaperUrl,
  children,
  className,
}: PublicBoxWallpaperCardProps) {
  return (
    <Card
      className={className}
      sx={{
        position: "relative",
        overflow: "hidden",
      }}
    >
      {wallpaperUrl ? (
        <>
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url("${wallpaperUrl}")`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(180deg, rgba(18, 22, 28, 0.14) 0%, rgba(18, 22, 28, 0.58) 100%)",
            }}
          />
        </>
      ) : null}

      <CardContent
        sx={{
          position: "relative",
          p: { xs: 2.25, sm: 3, md: 4 },
        }}
      >
        {children}
      </CardContent>
    </Card>
  );
}
