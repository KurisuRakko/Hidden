import { type Locale, translate } from "@/lib/i18n";

function createStableDateFallback(date: Date) {
  return date.toISOString().slice(0, 16).replace("T", " ");
}

export function formatDateTime(
  value: Date | string | null | undefined,
  locale: Locale = "en",
) {
  if (!value) {
    return translate(locale, "common.notSet");
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return translate(locale, "common.notSet");
  }

  try {
    if (Intl.DateTimeFormat.supportedLocalesOf([locale]).length === 0) {
      return createStableDateFallback(date);
    }

    return new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(date);
  } catch {
    return createStableDateFallback(date);
  }
}

export function formatRelativeState(value: boolean, locale: Locale = "en") {
  return value
    ? translate(locale, "common.enabled")
    : translate(locale, "common.disabled");
}
