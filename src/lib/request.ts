import { createHash, randomUUID } from "node:crypto";
import { isIP } from "node:net";
import { getEnv } from "@/lib/env";

const REQUEST_ID_PATTERN = /^[A-Za-z0-9._:-]{1,128}$/;

function normalizeIpCandidate(value: string | null | undefined) {
  if (!value) {
    return null;
  }

  let candidate = value.trim();

  if (!candidate) {
    return null;
  }

  candidate = candidate.replace(/^for=/i, "").replace(/^"+|"+$/g, "");

  if (candidate.startsWith("[")) {
    const closingBracketIndex = candidate.indexOf("]");

    if (closingBracketIndex > 0) {
      candidate = candidate.slice(1, closingBracketIndex);
    }
  }

  const ipv4WithPort = candidate.match(/^(\d{1,3}(?:\.\d{1,3}){3})(?::\d+)?$/);

  if (ipv4WithPort) {
    candidate = ipv4WithPort[1];
  }

  if (candidate.toLowerCase() === "unknown") {
    return null;
  }

  return isIP(candidate) ? candidate : null;
}

export function getClientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");

  if (forwardedFor) {
    for (const part of forwardedFor.split(",")) {
      const normalizedIp = normalizeIpCandidate(part);

      if (normalizedIp) {
        return normalizedIp;
      }
    }
  }

  return normalizeIpCandidate(request.headers.get("x-real-ip")) ?? "unknown";
}

export function getClientUserAgent(request: Request) {
  return request.headers.get("user-agent")?.trim() ?? "";
}

export function hashIpAddress(ipAddress: string) {
  if (!ipAddress || ipAddress === "unknown") {
    return null;
  }

  return createHash("sha256")
    .update(ipAddress)
    .update(getEnv().IP_HASH_SECRET)
    .digest("hex");
}

export function getRequestId(request: Request) {
  const existingRequestId = request.headers.get("x-request-id")?.trim();

  if (existingRequestId && REQUEST_ID_PATTERN.test(existingRequestId)) {
    return existingRequestId;
  }

  return randomUUID();
}

export function getStringFromFormData(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

export function getBooleanFromFormData(formData: FormData, key: string) {
  const value = formData.get(key);

  if (typeof value !== "string") {
    return false;
  }

  return value === "true" || value === "1" || value === "on";
}

export function getOptionalFileFromFormData(formData: FormData, key: string) {
  const value = formData.get(key);

  if (!(value instanceof File) || value.size === 0) {
    return null;
  }

  return value;
}
