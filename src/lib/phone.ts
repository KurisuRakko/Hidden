import { normalizePhone } from "@/lib/validation/common";

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
