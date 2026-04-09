"use client";

import { useEffect } from "react";
import { StandaloneErrorScreen } from "@/components/errors/standalone-error-screen";
import { siteConfig } from "@/lib/site";

type ErrorPageProps = {
  error: Error & { digest?: string };
};

export default function ErrorPage({ error }: ErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <StandaloneErrorScreen
      error={error}
      homeHref={siteConfig.publicHomeUrl}
      officialHref={siteConfig.officialSiteUrl}
    />
  );
}
