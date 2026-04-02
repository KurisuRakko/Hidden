import { NextResponse } from "next/server";
import {
  clearSessionCookieOnResponse,
  destroyCurrentSession,
} from "@/lib/auth/session";
import { withApiHandler } from "@/lib/api";

export const POST = withApiHandler(async () => {
  await destroyCurrentSession();
  const response = NextResponse.json({ success: true });
  clearSessionCookieOnResponse(response);
  return response;
});
