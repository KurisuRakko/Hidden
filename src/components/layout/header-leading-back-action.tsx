"use client";

import Link from "next/link";
import { ArrowBackRounded } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { type Theme } from "@mui/material/styles";
import { useRouter } from "next/navigation";
import { useI18n } from "@/components/providers/i18n-provider";

export type HeaderBackAction =
  | {
      mode: "history";
      fallbackHref: string;
    }
  | {
      mode: "href";
      href: string;
      transitionTypes?: string[];
    };

type HeaderLeadingBackActionProps = {
  back: HeaderBackAction;
  variant: "dashboard" | "public";
};

export function HeaderLeadingBackAction({
  back,
  variant,
}: HeaderLeadingBackActionProps) {
  const router = useRouter();
  const { t } = useI18n();
  const buttonSx = (theme: Theme) => ({
    flexShrink: 0,
    width: variant === "dashboard" ? { xs: 36, sm: 40 } : { xs: 36, md: 38 },
    height: variant === "dashboard" ? { xs: 36, sm: 40 } : { xs: 36, md: 38 },
    borderRadius: variant === "dashboard" ? 1.25 : 1.5,
    bgcolor: "primary.main",
    color: theme.palette.primary.contrastText,
    boxShadow: variant === "dashboard" ? theme.shadows[3] : theme.shadows[2],
    "&:hover": {
      bgcolor: "primary.dark",
    },
  });

  function handleHistoryBack(fallbackHref: string) {
    // When the page is opened directly in a fresh tab, use the configured fallback.
    if (window.history.length > 1) {
      router.back();
      return;
    }

    router.push(fallbackHref);
  }

  if (back.mode === "href") {
    return (
      <IconButton
        component={Link}
        href={back.href}
        transitionTypes={back.transitionTypes}
        aria-label={t("common.actions.back")}
        sx={buttonSx}
      >
        <ArrowBackRounded fontSize="small" />
      </IconButton>
    );
  }

  return (
    <IconButton
      aria-label={t("common.actions.back")}
      onClick={() => handleHistoryBack(back.fallbackHref)}
      sx={buttonSx}
    >
      <ArrowBackRounded fontSize="small" />
    </IconButton>
  );
}
