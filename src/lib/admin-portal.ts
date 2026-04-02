import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { getEnvValue } from "@/lib/env";
import { AppError } from "@/lib/http";

export const ADMIN_PORTAL_HEADER = "x-hidden-admin-portal";
export const ADMIN_PORTAL_HEADER_VALUE = "1";

export type AuthPortal = "PUBLIC" | "ADMIN";

const LOOPBACK_HOSTNAMES = new Set(["localhost", "127.0.0.1", "0.0.0.0", "::1"]);

function joinAppUrl(baseUrl: string, pathname: string) {
  return new URL(pathname, `${baseUrl}/`).toString();
}

function isLoopbackHostname(hostname: string) {
  return LOOPBACK_HOSTNAMES.has(hostname.replace(/^\[(.*)\]$/, "$1"));
}

function getRequestOrigin(headerStore: Headers) {
  const host =
    headerStore.get("x-forwarded-host") ??
    headerStore.get("host") ??
    headerStore.get(":authority");

  if (!host) {
    return null;
  }

  const protocol = headerStore.get("x-forwarded-proto") ?? "http";
  return `${protocol}://${host}`;
}

function resolvePortalBaseUrl(baseUrl: string, requestOrigin: string | null) {
  if (!requestOrigin) {
    return baseUrl;
  }

  const resolvedBaseUrl = new URL(baseUrl);
  const resolvedRequestOrigin = new URL(requestOrigin);

  if (!isLoopbackHostname(resolvedBaseUrl.hostname)) {
    return resolvedBaseUrl.toString();
  }

  if (isLoopbackHostname(resolvedRequestOrigin.hostname)) {
    return resolvedBaseUrl.toString();
  }

  // Keep the configured port, but reuse the active LAN host so redirects stay reachable.
  resolvedBaseUrl.protocol = resolvedRequestOrigin.protocol;
  resolvedBaseUrl.hostname = resolvedRequestOrigin.hostname;

  return resolvedBaseUrl.toString();
}

export async function getAdminAppUrl(pathname = "/admin") {
  const headerStore = await headers();
  const requestOrigin = getRequestOrigin(headerStore);
  const isAdminPortalRequest = isAdminPortalHeaderValue(
    headerStore.get(ADMIN_PORTAL_HEADER),
  );
  const baseUrl = isAdminPortalRequest
    ? requestOrigin ?? getEnvValue("ADMIN_APP_URL")
    : resolvePortalBaseUrl(getEnvValue("ADMIN_APP_URL"), requestOrigin);

  return joinAppUrl(baseUrl, pathname);
}

export async function getPublicAppUrl(pathname = "/") {
  const headerStore = await headers();
  const requestOrigin = getRequestOrigin(headerStore);
  const isAdminPortalRequest = isAdminPortalHeaderValue(
    headerStore.get(ADMIN_PORTAL_HEADER),
  );
  const baseUrl = isAdminPortalRequest
    ? resolvePortalBaseUrl(getEnvValue("APP_URL"), requestOrigin)
    : requestOrigin ?? getEnvValue("APP_URL");

  return joinAppUrl(baseUrl, pathname);
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
