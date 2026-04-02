import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { logApiError } from "@/lib/logger";

export class AppError extends Error {
  status: number;
  code: string;
  details?: unknown;

  constructor(
    status: number,
    message: string,
    code = "APP_ERROR",
    details?: unknown,
  ) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export function ok<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}

export type ErrorResponseContext = {
  requestId: string;
  method: string;
  path: string;
};

export function getErrorCode(error: unknown) {
  if (error instanceof AppError) {
    return error.code;
  }

  if (error instanceof ZodError) {
    return "VALIDATION_ERROR";
  }

  return "INTERNAL_SERVER_ERROR";
}

function getErrorStatus(error: unknown) {
  if (error instanceof AppError) {
    return error.status;
  }

  if (error instanceof ZodError) {
    return 400;
  }

  return 500;
}

function getErrorBody(error: unknown) {
  if (error instanceof AppError) {
    return {
      error: error.message,
      code: error.code,
      details: error.details,
    };
  }

  if (error instanceof ZodError) {
    return {
      error: "Request validation failed",
      code: "VALIDATION_ERROR",
      details: error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      })),
    };
  }

  return { error: "Internal server error", code: "INTERNAL_SERVER_ERROR" };
}

export function errorResponse(error: unknown, context?: ErrorResponseContext) {
  const status = getErrorStatus(error);
  const code = getErrorCode(error);

  if (context) {
    logApiError({
      requestId: context.requestId,
      method: context.method,
      path: context.path,
      status,
      errorCode: code,
      error,
    });
  } else if (status >= 500) {
    console.error(error);
  }

  return NextResponse.json(getErrorBody(error), { status });
}

export function getPageFromSearchParams(
  value: string | undefined,
  fallback = 1,
) {
  const page = Number.parseInt(value ?? "", 10);

  if (Number.isNaN(page) || page < 1) {
    return fallback;
  }

  return page;
}
