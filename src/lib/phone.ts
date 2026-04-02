import { normalizePhone } from "@/lib/validation/common";
import { type Locale } from "@/lib/i18n";

export const DIAL_CODE_OPTIONS = [
  {
    value: "+86",
    label: "China Mainland (+86)",
  },
  {
    value: "+1",
    label: "United States / Canada (+1)",
  },
  {
    value: "+44",
    label: "United Kingdom (+44)",
  },
  {
    value: "+81",
    label: "Japan (+81)",
  },
  {
    value: "+65",
    label: "Singapore (+65)",
  },
] as const;

export type DialCode = (typeof DIAL_CODE_OPTIONS)[number]["value"];

const DEFAULT_DIAL_CODE: DialCode = "+1";

export function getDefaultDialCodeFromAcceptLanguage(
  acceptLanguage: string | null | undefined,
): DialCode {
  const locale = acceptLanguage
    ?.split(",")[0]
    ?.trim()
    .toLowerCase();

  if (locale?.startsWith("zh")) {
    return "+86";
  }

  if (locale?.startsWith("en")) {
    return "+1";
  }

  return DEFAULT_DIAL_CODE;
}

export function normalizeLocalPhoneNumber(value: string) {
  return normalizePhone(value).replace(/^\+/, "");
}

export function getDialCodeOptions(locale: Locale) {
  const chinese = locale === "zh-CN";

  return DIAL_CODE_OPTIONS.map((option) => {
    if (option.value === "+86") {
      return {
        ...option,
        label: chinese ? "中国大陆 (+86)" : "China Mainland (+86)",
      };
    }

    if (option.value === "+1") {
      return {
        ...option,
        label: chinese ? "美国 / 加拿大 (+1)" : "United States / Canada (+1)",
      };
    }

    if (option.value === "+44") {
      return {
        ...option,
        label: chinese ? "英国 (+44)" : "United Kingdom (+44)",
      };
    }

    if (option.value === "+81") {
      return {
        ...option,
        label: chinese ? "日本 (+81)" : "Japan (+81)",
      };
    }

    return {
      ...option,
      label: chinese ? "新加坡 (+65)" : "Singapore (+65)",
    };
  });
}
