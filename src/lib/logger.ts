import { ZodError } from "zod";

type LogLevel = "info" | "warn" | "error";

function writeLog(level: LogLevel, event: string, data: Record<string, unknown>) {
  const payload = JSON.stringify({
    timestamp: new Date().toISOString(),
    level,
    event,
    ...data,
  });

  switch (level) {
    case "error":
      console.error(payload);
      return;
    case "warn":
      console.warn(payload);
      return;
    default:
      console.info(payload);
  }
}

function serializeError(error: unknown) {
  if (error instanceof ZodError) {
    return {
      name: error.name,
      message: error.message,
      issues: error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      })),
    };
  }

  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      details:
        "details" in error ? (error as Error & { details?: unknown }).details : undefined,
      stack: error.stack,
    };
  }

  return {
    message: String(error),
  };
}

export function logApiRequest(data: {
  requestId: string;
  method: string;
  path: string;
  status: number;
  durationMs: number;
  ipHash: string | null;
  isAnonymous: boolean;
  errorCode?: string;
}) {
  const level: LogLevel =
    data.status >= 500 ? "error" : data.status >= 400 ? "warn" : "info";

  writeLog(level, "api.request", data);
}

export function logOidcEvent(data: {
  requestId?: string;
  portal: "PUBLIC" | "ADMIN";
  stage: "start" | "callback.success" | "callback.failure";
  issuerHost?: string;
  errorCode?: string;
  failureStage?: string;
}) {
  const level: LogLevel = data.stage === "callback.failure" ? "warn" : "info";

  writeLog(level, "oidc.auth", {
    requestId: data.requestId ?? null,
    portal: data.portal,
    stage: data.stage,
    issuerHost: data.issuerHost ?? null,
    errorCode: data.errorCode ?? null,
    failureStage: data.failureStage ?? null,
  });
}

export function logApiError(data: {
  requestId: string;
  method: string;
  path: string;
  status: number;
  errorCode: string;
  error: unknown;
}) {
  const level: LogLevel = data.status >= 500 ? "error" : "warn";

  writeLog(level, "api.error", {
    requestId: data.requestId,
    method: data.method,
    path: data.path,
    status: data.status,
    errorCode: data.errorCode,
    error: serializeError(data.error),
  });
}
