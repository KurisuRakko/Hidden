import type { Metadata } from "next";
import { type Locale } from "@/lib/i18n";
import { buildPublicPageUrl, siteConfig } from "@/lib/site";

const OPEN_GRAPH_LOCALE: Record<Locale, string> = {
  "zh-CN": "zh_CN",
  en: "en_US",
};

type BuildPublicMetadataInput = {
  pathname: string;
  locale: Locale;
  title: string;
  description: string;
};

export function buildPublicMetadata({
  pathname,
  locale,
  title,
  description,
}: BuildPublicMetadataInput): Metadata {
  const canonicalUrl = buildPublicPageUrl(pathname);

  return {
    title,
    description,
    applicationName: siteConfig.appName,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: "website",
      url: canonicalUrl,
      title,
      description,
      siteName: siteConfig.appName,
      locale: OPEN_GRAPH_LOCALE[locale],
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}
