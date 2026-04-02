import { NextResponse } from "next/server";
import {
  clearSessionCookieOnResponse,
  destroyCurrentSession,
} from "@/lib/auth/session";
import { errorResponse } from "@/lib/http";

export async function POST() {
  try {
    await destroyCurrentSession();
    const response = NextResponse.json({ success: true });
    clearSessionCookieOnResponse(response);
    return response;
  } catch (error) {
    return errorResponse(error);
  }
}
