import { NextResponse } from "next/server";
import { withApiHandler } from "@/lib/api";
import { requireUserApi } from "@/lib/auth/guards";
import { normalizeLocale, type Locale } from "@/lib/i18n";
import { applyLocaleCookie } from "@/lib/i18n/server";

export const POST = withApiHandler(async (request: Request) => {
  await requireUserApi();
  const body = await request.json();
  const locale = normalizeLocale(String(body.locale ?? "")) as Locale | null;

  if (!locale) {
    return NextResponse.json(
      {
        error: "Invalid locale.",
        code: "VALIDATION_ERROR",
      },
      { status: 400 },
    );
  }

  const response = NextResponse.json({ success: true, locale });
  applyLocaleCookie(response, locale);
  return response;
}, { localizeErrors: true });
