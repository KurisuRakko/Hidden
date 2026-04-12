import enMessages from "@/lib/i18n/messages/en";
import zhCNMessages from "@/lib/i18n/messages/zh-CN";

export const SUPPORTED_LOCALES = ["zh-CN", "en"] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";
export const LOCALE_COOKIE_NAME = "hidden_locale";

export interface Messages {
  [key: string]: string | Messages;
}

type MessageValue = string | Messages;

const messagesByLocale: Record<Locale, Messages> = {
  "zh-CN": zhCNMessages,
  en: enMessages,
};

const validationMessageKeyMap: Record<string, string> = {
  "Enter a valid phone number.": "validation.phoneInvalid",
  "Password is required.": "validation.passwordRequired",
  "Invite code is required.": "validation.inviteCodeRequired",
  "Invite code is too long.": "validation.inviteCodeTooLong",
  "Slug must use lowercase letters, numbers, and hyphens only.":
    "validation.slugInvalid",
  "Title is too short.": "validation.titleTooShort",
  "Title is too long.": "validation.titleTooLong",
  "Description is too long.": "validation.descriptionTooLong",
  "Question is too short.": "validation.questionTooShort",
  "Question is too long.": "validation.questionTooLong",
  "Answer cannot be empty.": "validation.answerEmpty",
  "Answer is too long.": "validation.answerTooLong",
  "Request validation failed": "validation.requestFailed",
};

export function normalizeLocale(value: string | null | undefined): Locale | null {
  if (!value) {
    return null;
  }

  const normalized = value.trim().toLowerCase();

  if (normalized.startsWith("zh")) {
    return "zh-CN";
  }

  if (normalized.startsWith("en")) {
    return "en";
  }

  return null;
}

export function resolveLocaleFromAcceptLanguage(
  acceptLanguage: string | null | undefined,
) {
  if (!acceptLanguage) {
    return DEFAULT_LOCALE;
  }

  const tokens = acceptLanguage.split(",");

  for (const token of tokens) {
    const [localeToken] = token.trim().split(";");
    const locale = normalizeLocale(localeToken);

    if (locale) {
      return locale;
    }
  }

  return DEFAULT_LOCALE;
}

export function resolveLocale(input: {
  cookieValue?: string | null;
  acceptLanguage?: string | null;
}) {
  return (
    normalizeLocale(input.cookieValue) ??
    resolveLocaleFromAcceptLanguage(input.acceptLanguage)
  );
}

export function getMessages(locale: Locale) {
  return messagesByLocale[locale];
}

function getValueByPath(messages: Messages, key: string): MessageValue | null {
  const parts = key.split(".");
  let current: MessageValue = messages;

  for (const part of parts) {
    if (
      typeof current !== "object" ||
      current === null ||
      !(part in current)
    ) {
      return null;
    }

    current = current[part as keyof typeof current];
  }

  return current;
}

function interpolate(template: string, values?: Record<string, string | number>) {
  if (!values) {
    return template;
  }

  return template.replace(/\{(\w+)\}/g, (_, key) => {
    const value = values[key];
    return value === undefined ? `{${key}}` : String(value);
  });
}

export function translate(
  locale: Locale,
  key: string,
  values?: Record<string, string | number>,
) {
  const message =
    getValueByPath(getMessages(locale), key) ??
    getValueByPath(getMessages(DEFAULT_LOCALE), key);

  if (typeof message !== "string") {
    return key;
  }

  return interpolate(message, values);
}

export function createTranslator(locale: Locale) {
  return (key: string, values?: Record<string, string | number>) =>
    translate(locale, key, values);
}

export function getLocalizedErrorMessage(input: {
  locale: Locale;
  code?: string | null;
  message?: string | null;
}) {
  if (input.code) {
    const errorKey = `errors.${input.code}`;
    const translatedError = translate(input.locale, errorKey);

    if (translatedError !== errorKey) {
      return translatedError;
    }
  }

  if (input.message) {
    const validationKey = validationMessageKeyMap[input.message];

    if (validationKey) {
      return translate(input.locale, validationKey);
    }
  }

  return input.message ?? translate(input.locale, "errors.INTERNAL_SERVER_ERROR");
}

export function getStatusLabel(status: string, locale: Locale) {
  const key = `common.status.${status}`;
  const label = translate(locale, key);
  return label === key ? status.replaceAll("_", " ") : label;
}

export function getRoleLabel(role: string, locale: Locale) {
  const key = `common.role.${role}`;
  const label = translate(locale, key);
  return label === key ? role : label;
}

export function getDialCodeOptions(locale: Locale) {
  const chinese = locale === "zh-CN";

  return [
    {
      value: "+86",
      label: chinese ? "中国大陆 (+86)" : "China Mainland (+86)",
    },
    {
      value: "+1",
      label: chinese ? "美国 / 加拿大 (+1)" : "United States / Canada (+1)",
    },
    {
      value: "+44",
      label: chinese ? "英国 (+44)" : "United Kingdom (+44)",
    },
    {
      value: "+81",
      label: chinese ? "日本 (+81)" : "Japan (+81)",
    },
    {
      value: "+65",
      label: chinese ? "新加坡 (+65)" : "Singapore (+65)",
    },
  ] as const;
}
