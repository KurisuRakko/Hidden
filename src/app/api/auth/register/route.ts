import { NextResponse } from "next/server";
import { registerUser } from "@/features/auth/service";
import { withApiHandler } from "@/lib/api";
import { attachSessionCookie } from "@/lib/auth/session";

function serializeUser(user: {
  id: string;
  phone: string;
  role: string;
  status: string;
  createdAt: Date;
}) {
  return {
    id: user.id,
    phone: user.phone,
    role: user.role,
    status: user.status,
    createdAt: user.createdAt,
  };
}

export const POST = withApiHandler(async (request: Request) => {
  const body = await request.json();
  const result = await registerUser(body);
  const response = NextResponse.json(
    {
      user: serializeUser(result.user),
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
