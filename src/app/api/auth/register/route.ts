import { NextResponse } from "next/server";
import { registerUser } from "@/features/auth/service";
import { attachSessionCookie } from "@/lib/auth/session";
import { errorResponse } from "@/lib/http";

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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await registerUser(body);
    const response = NextResponse.json(
      {
        user: serializeUser(result.user),
      },
      { status: 201 },
    );

    attachSessionCookie(
      response,
      result.session.token,
      result.session.expiresAt,
    );

    return response;
  } catch (error) {
    return errorResponse(error);
  }
}
