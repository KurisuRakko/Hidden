import { type Locale, translate } from "@/lib/i18n";

export function formatDateTime(
  value: Date | string | null | undefined,
  locale: Locale = "en",
) {
  if (!value) {
    return translate(locale, "common.notSet");
  }

  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(value));
}

export function formatRelativeState(value: boolean, locale: Locale = "en") {
  return value
    ? translate(locale, "common.enabled")
    : translate(locale, "common.disabled");
}
