import { NextResponse } from "next/server";
import {
  assertAdminPortalHeaders,
  getAdminAppUrl,
  type AuthPortal,
} from "@/lib/admin-portal";
import { loginUser } from "@/features/auth/service";
import { withApiHandler } from "@/lib/api";
import { attachSessionCookie } from "@/lib/auth/session";
import { serializeUserForClient } from "@/lib/auth/user";

export const POST = withApiHandler(async (request: Request) => {
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
    result.user.role === "ADMIN"
      ? await getAdminAppUrl("/admin")
      : "/dashboard";
  const response = NextResponse.json({
    user: serializeUserForClient(result.user),
    redirectTo,
  });

  attachSessionCookie(
    response,
    result.session.token,
    result.session.expiresAt,
  );

  return response;
});
