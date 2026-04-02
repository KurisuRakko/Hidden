import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { getEnv } from "@/lib/env";
import { AppError } from "@/lib/http";

export const ADMIN_PORTAL_HEADER = "x-hidden-admin-portal";
export const ADMIN_PORTAL_HEADER_VALUE = "1";

export type AuthPortal = "PUBLIC" | "ADMIN";

function joinAppUrl(baseUrl: string, pathname: string) {
  return new URL(pathname, `${baseUrl}/`).toString();
}

export function getAdminAppUrl(pathname = "/admin") {
  return joinAppUrl(getEnv().ADMIN_APP_URL, pathname);
}

export function getPublicAppUrl(pathname = "/") {
  return joinAppUrl(getEnv().APP_URL, pathname);
}

export function isAdminPortalHeaderValue(value: string | null) {
  return value === ADMIN_PORTAL_HEADER_VALUE;
}

export function assertAdminPortalHeaders(headerStore: Headers) {
  if (!isAdminPortalHeaderValue(headerStore.get(ADMIN_PORTAL_HEADER))) {
    throw new AppError(404, "Not found", "NOT_FOUND");
  }
}

export async function requireAdminPortalPage() {
  const headerStore = await headers();

  if (!isAdminPortalHeaderValue(headerStore.get(ADMIN_PORTAL_HEADER))) {
    notFound();
  }
}
