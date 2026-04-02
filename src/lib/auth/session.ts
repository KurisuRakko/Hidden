import { User } from "@prisma/client";
import { addDays } from "date-fns";
import { cookies } from "next/headers";
import { createHash, randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getEnvValue } from "@/lib/env";
import { AppError } from "@/lib/http";
import { SESSION_COOKIE_NAME, SESSION_TTL_DAYS } from "@/lib/constants";

export type SessionUser = Pick<
  User,
  "id" | "phone" | "role" | "status" | "createdAt"
>;

export type SessionPayload = {
  id: string;
  userId: string;
  tokenHash: string;
  expiresAt: Date;
  createdAt: Date;
  user: SessionUser;
};

function hashToken(token: string) {
  return createHash("sha256")
    .update(token)
    .update(getEnvValue("SESSION_SECRET"))
    .digest("hex");
}

export function buildSessionCookieOptions(expires: Date) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires,
  };
}

export async function createSession(userId: string) {
  const token = randomBytes(32).toString("hex");
  const tokenHash = hashToken(token);
  const expiresAt = addDays(new Date(), SESSION_TTL_DAYS);

  await prisma.session.create({
    data: {
      userId,
      tokenHash,
      expiresAt,
    },
  });

  return { token, expiresAt };
}

export function attachSessionCookie(
  response: NextResponse,
  token: string,
  expiresAt: Date,
) {
  response.cookies.set(SESSION_COOKIE_NAME, token, buildSessionCookieOptions(expiresAt));
}

export function clearSessionCookieOnResponse(response: NextResponse) {
  response.cookies.set(SESSION_COOKIE_NAME, "", buildSessionCookieOptions(new Date(0)));
}

export async function destroyCurrentSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return;
  }

  await prisma.session.deleteMany({
    where: {
      tokenHash: hashToken(token),
    },
  });

  cookieStore.set(SESSION_COOKIE_NAME, "", buildSessionCookieOptions(new Date(0)));
}

export async function getCurrentSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  const payload = await prisma.session.findUnique({
    where: {
      tokenHash: hashToken(token),
    },
    include: {
      user: {
        select: {
          id: true,
          phone: true,
          role: true,
          status: true,
          createdAt: true,
        },
      },
    },
  });

  if (!payload) {
    return null;
  }

  if (payload.expiresAt <= new Date()) {
    await prisma.session.delete({
      where: {
        id: payload.id,
      },
    });

    cookieStore.set(SESSION_COOKIE_NAME, "", buildSessionCookieOptions(new Date(0)));

    return null;
  }

  return payload;
}

export async function requireActiveSession() {
  const payload = await getCurrentSession();

  if (!payload) {
    throw new AppError(401, "Authentication required", "UNAUTHORIZED");
  }

  if (payload.user.status !== "ACTIVE") {
    throw new AppError(
      403,
      "This account is not allowed to use Hidden right now.",
      "USER_DISABLED",
    );
  }

  return payload;
}

export async function requireSessionUser() {
  const payload = await requireActiveSession();

  return payload.user;
}
