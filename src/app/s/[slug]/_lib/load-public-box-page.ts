import { notFound } from "next/navigation";
import { getPublicBoxBySlug } from "@/features/boxes/service";
import { AppError } from "@/lib/http";
import { createTranslator } from "@/lib/i18n";
import { getRequestLocale } from "@/lib/i18n/server";

async function loadPublicBoxOrNotFound(slug: string) {
  try {
    return await getPublicBoxBySlug(slug);
  } catch (error) {
    if (error instanceof AppError && error.status === 404) {
      notFound();
    }

    throw error;
  }
}

export async function loadPublicBoxPageData(slug: string) {
  const [locale, box] = await Promise.all([
    getRequestLocale(),
    loadPublicBoxOrNotFound(slug),
  ]);

  return {
    box,
    locale,
    t: createTranslator(locale),
  };
}
