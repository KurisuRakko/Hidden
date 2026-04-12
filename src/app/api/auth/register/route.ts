import { NextResponse } from "next/server";
import { registerUser } from "@/features/auth/service";
import { withApiHandler } from "@/lib/api";
import { attachSessionCookie } from "@/lib/auth/session";
import { serializeUserForClient } from "@/lib/auth/user";

export const POST = withApiHandler(async (request: Request) => {
  const body = await request.json();
  const result = await registerUser(body);
  const response = NextResponse.json(
    {
      user: serializeUserForClient(result.user),
      redirectTo: "/dashboard",
    },
    { status: 201 },
  );

  attachSessionCookie(
    response,
    result.session.token,
    result.session.expiresAt,
  );

  return response;
});
