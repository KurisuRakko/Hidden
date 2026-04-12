import { NextResponse } from "next/server";
import { getOidcEnv } from "@/lib/env";
import {
  OIDC_STATE_COOKIE_NAME,
} from "@/lib/constants";
import {
  buildLoginRedirectUrl,
  buildOidcAuthorizationUrl,
  buildOidcStateCookieOptions,
  createOidcStateCookieValue,
  getOidcDiscovery,
  safeIssuerHost,
  sanitizePostAuthRedirect,
} from "@/lib/auth/oidc";
import { logOidcEvent } from "@/lib/logger";

type OidcStartDependencies = {
  getOidcEnv?: typeof getOidcEnv;
  getOidcDiscovery?: typeof getOidcDiscovery;
  now?: () => number;
};

export async function handleOidcStart(
  request: Request,
  dependencies: OidcStartDependencies = {},
) {
  const oidcEnv = (dependencies.getOidcEnv ?? getOidcEnv)();

  if (!oidcEnv) {
    return NextResponse.redirect(buildLoginRedirectUrl(request, "unavailable"));
  }

  try {
    const requestUrl = new URL(request.url);
    const redirectUri = new URL(oidcEnv.callbackPath, requestUrl.origin).toString();
    const state = createOidcStateCookieValue({
      portal: "PUBLIC",
      redirectUri,
      returnTo: sanitizePostAuthRedirect(
        requestUrl.searchParams.get("returnTo"),
      ),
      now: dependencies.now?.(),
    });
    const discovery = await (dependencies.getOidcDiscovery ?? getOidcDiscovery)(
      oidcEnv,
    );
    const authorizeUrl = buildOidcAuthorizationUrl({
      discovery,
      clientId: oidcEnv.clientId,
      redirectUri,
      scope: oidcEnv.scopes,
      state: state.state,
      nonce: state.nonce,
      codeChallenge: state.codeChallenge,
    });
    const response = NextResponse.redirect(authorizeUrl);

    response.cookies.set(
      OIDC_STATE_COOKIE_NAME,
      state.cookieValue,
      buildOidcStateCookieOptions(state.expiresAt),
    );

    logOidcEvent({
      portal: "PUBLIC",
      stage: "start",
      issuerHost: safeIssuerHost(oidcEnv.issuerUrl),
    });

    return response;
  } catch {
    logOidcEvent({
      portal: "PUBLIC",
      stage: "callback.failure",
      issuerHost: safeIssuerHost(oidcEnv.issuerUrl),
      failureStage: "start",
    });
    return NextResponse.redirect(buildLoginRedirectUrl(request, "failed"));
  }
}

export async function GET(request: Request) {
  return handleOidcStart(request);
}
