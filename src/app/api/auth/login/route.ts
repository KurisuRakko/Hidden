import { NextResponse } from "next/server";
import {
  assertAdminPortalHeaders,
  getAdminAppUrl,
  type AuthPortal,
} from "@/lib/admin-portal";
import { loginUser } from "@/features/auth/service";
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
    const portal: AuthPortal = body.portal === "ADMIN" ? "ADMIN" : "PUBLIC";

    if (portal === "ADMIN") {
      assertAdminPortalHeaders(request.headers);
    }

    const result = await loginUser({
      phone: String(body.phone ?? ""),
      password: String(body.password ?? ""),
      portal,
    });
    const redirectTo =
      result.user.role === "ADMIN" ? getAdminAppUrl("/admin") : "/dashboard";
    const response = NextResponse.json({
      user: serializeUser(result.user),
      redirectTo,
    });

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
