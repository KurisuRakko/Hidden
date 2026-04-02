import type { NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import {
  LOCALE_COOKIE_NAME,
  resolveLocale,
  type Locale,
} from "@/lib/i18n";

function parseCookieValue(cookieHeader: string | null | undefined, key: string) {
  if (!cookieHeader) {
    return null;
  }

  const parts = cookieHeader.split(";");

  for (const part of parts) {
    const [cookieKey, ...rest] = part.trim().split("=");

    if (cookieKey === key) {
      return decodeURIComponent(rest.join("="));
    }
  }

  return null;
}

export async function getRequestLocale() {
  const cookieStore = await cookies();
  const headerStore = await headers();

  return resolveLocale({
    cookieValue: cookieStore.get(LOCALE_COOKIE_NAME)?.value,
    acceptLanguage: headerStore.get("accept-language"),
  });
}

export function getRequestLocaleFromRequest(request: Request) {
  return resolveLocale({
    cookieValue: parseCookieValue(
      request.headers.get("cookie"),
      LOCALE_COOKIE_NAME,
    ),
    acceptLanguage: request.headers.get("accept-language"),
  });
}

export function applyLocaleCookie(response: NextResponse, locale: Locale) {
  response.cookies.set(LOCALE_COOKIE_NAME, locale, {
    httpOnly: false,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
}
