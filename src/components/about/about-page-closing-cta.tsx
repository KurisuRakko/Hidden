import { Stack } from "@mui/material";
import { SectionCard } from "@/components/common/section-card";

type AboutPageClosingCtaProps = {
  title: string;
  description: string;
  primaryAction: React.ReactNode;
  secondaryAction?: React.ReactNode;
};

export function AboutPageClosingCta({
  title,
  description,
  primaryAction,
  secondaryAction,
}: AboutPageClosingCtaProps) {
  return (
    <SectionCard
      title={title}
      description={description}
      className="motion-enter-soft motion-delay-2"
      variant="secondary"
      action={
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25}>
          {primaryAction}
          {secondaryAction}
        </Stack>
      }
    >
      {null}
    </SectionCard>
  );
}
