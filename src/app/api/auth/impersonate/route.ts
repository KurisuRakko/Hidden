import { NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { prisma } from "@/lib/db";
import { getEnvValue } from "@/lib/env";
import { SESSION_COOKIE_NAME } from "@/lib/constants";
import { buildSessionCookieOptions } from "@/lib/auth/session";

function hashToken(token: string) {
  return createHash("sha256")
    .update(token)
    .update(getEnvValue("SESSION_SECRET"))
    .digest("hex");
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const tokenHash = hashToken(token);
  const session = await prisma.session.findUnique({
    where: { tokenHash },
    include: {
      user: {
        select: { id: true, status: true },
      },
    },
  });

  if (!session || session.expiresAt <= new Date() || session.user.status !== "ACTIVE") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const response = NextResponse.redirect(new URL("/dashboard", request.url));
  response.cookies.set(SESSION_COOKIE_NAME, token, buildSessionCookieOptions(session.expiresAt));
  return response;
}
