import { errorResponse, getErrorCode } from "@/lib/http";
import { getRequestLocaleFromRequest } from "@/lib/i18n/server";
import { logApiRequest } from "@/lib/logger";
import { getClientIp, getRequestId, hashIpAddress } from "@/lib/request";

type RouteHandler<TContext> = (
  request: Request,
  context: TContext,
) => Promise<Response> | Response;

type WrappedRouteHandler<TContext> = (
  request: Request,
  context: TContext,
) => Promise<Response>;

export function withApiHandler(
  handler: (request: Request) => Promise<Response> | Response,
  options?: { localizeErrors?: boolean },
): (request: Request) => Promise<Response>;
export function withApiHandler<TContext>(
  handler: RouteHandler<TContext>,
  options?: { localizeErrors?: boolean },
): WrappedRouteHandler<TContext>;
export function withApiHandler<TContext>(
  handler: RouteHandler<TContext>,
  options?: { localizeErrors?: boolean },
) {
  return async function wrappedHandler(request: Request, context: TContext) {
    const startedAt = Date.now();
    const requestId = getRequestId(request);
    const path = new URL(request.url).pathname;
    const ipHash = hashIpAddress(getClientIp(request));
    const isAnonymous = path.startsWith("/api/public/");

    let response: Response;
    let errorCode: string | undefined;

    try {
      response = await handler(request, context);
    } catch (error) {
      errorCode = getErrorCode(error);
      response = errorResponse(error, {
        requestId,
        method: request.method,
        path,
      }, options?.localizeErrors
        ? {
            locale: getRequestLocaleFromRequest(request),
          }
        : undefined);
    }

    response.headers.set("x-request-id", requestId);

    logApiRequest({
      requestId,
      method: request.method,
      path,
      status: response.status,
      durationMs: Date.now() - startedAt,
      ipHash,
      isAnonymous,
      errorCode,
    });

    return response;
  };
}
