import { NextResponse } from "next/server";
import { attachSessionCookie } from "@/lib/auth/session";
import { getOidcEnv } from "@/lib/env";
import {
  OIDC_STATE_COOKIE_NAME,
} from "@/lib/constants";
import {
  buildLoginRedirectUrl,
  clearOidcStateCookie,
  exchangeOidcCode,
  fetchOidcUserInfo,
  getOidcDiscovery,
  parseCookieHeader,
  parseOidcStateCookieValue,
  safeIssuerHost,
  verifyOidcIdToken,
} from "@/lib/auth/oidc";
import { AppError } from "@/lib/http";
import { logOidcEvent } from "@/lib/logger";
import { signInWithOidcClaims } from "@/features/auth/oidc-service";

type OidcCallbackDependencies = {
  getOidcEnv?: typeof getOidcEnv;
  getOidcDiscovery?: typeof getOidcDiscovery;
  exchangeOidcCode?: typeof exchangeOidcCode;
  verifyOidcIdToken?: typeof verifyOidcIdToken;
  fetchOidcUserInfo?: typeof fetchOidcUserInfo;
  signInWithOidcClaims?: typeof signInWithOidcClaims;
  now?: () => number;
};

function buildFailureResponse(
  request: Request,
  reason: "failed" | "unavailable" | "disabled",
) {
  const response = NextResponse.redirect(buildLoginRedirectUrl(request, reason));
  clearOidcStateCookie(response);
  return response;
}

export async function handleOidcCallback(
  request: Request,
  dependencies: OidcCallbackDependencies = {},
) {
  const oidcEnv = (dependencies.getOidcEnv ?? getOidcEnv)();

  if (!oidcEnv) {
    return buildFailureResponse(request, "unavailable");
  }

  try {
    const requestUrl = new URL(request.url);
    const state = requestUrl.searchParams.get("state");
    const code = requestUrl.searchParams.get("code");

    if (!state || !code) {
      throw new AppError(400, "OIDC callback is missing required parameters.", "OIDC_CALLBACK_INVALID");
    }

    const flowState = parseOidcStateCookieValue(
      parseCookieHeader(request.headers.get("cookie"), OIDC_STATE_COOKIE_NAME),
      dependencies.now?.(),
    );

    if (flowState.portal !== "PUBLIC") {
      throw new AppError(400, "OIDC portal state is invalid.", "OIDC_STATE_INVALID");
    }

    if (flowState.state !== state) {
      throw new AppError(400, "OIDC sign-in state does not match.", "OIDC_STATE_INVALID");
    }

    const discovery = await (dependencies.getOidcDiscovery ?? getOidcDiscovery)(
      oidcEnv,
    );
    const tokens = await (dependencies.exchangeOidcCode ?? exchangeOidcCode)({
      env: oidcEnv,
      discovery,
      code,
      redirectUri: flowState.redirectUri,
      codeVerifier: flowState.codeVerifier,
    });
    const idTokenClaims = await (
      dependencies.verifyOidcIdToken ?? verifyOidcIdToken
    )({
      env: oidcEnv,
      discovery,
      idToken: tokens.id_token!,
      nonce: flowState.nonce,
    });
    const userInfo =
      tokens.access_token && discovery.userinfo_endpoint
        ? await (dependencies.fetchOidcUserInfo ?? fetchOidcUserInfo)({
            discovery,
            accessToken: tokens.access_token,
          })
        : null;

    if (userInfo?.sub && userInfo.sub !== idTokenClaims.sub) {
      throw new AppError(400, "OIDC user identity mismatch.", "OIDC_PROFILE_INVALID");
    }

    const result = await (
      dependencies.signInWithOidcClaims ?? signInWithOidcClaims
    )({
      issuer: discovery.issuer,
      claims: {
        ...idTokenClaims,
        ...(userInfo ?? {}),
      },
    });
    const response = NextResponse.redirect(
      new URL(flowState.returnTo, requestUrl.origin),
    );

    attachSessionCookie(
      response,
      result.session.token,
      result.session.expiresAt,
    );
    clearOidcStateCookie(response);

    logOidcEvent({
      portal: "PUBLIC",
      stage: "callback.success",
      issuerHost: safeIssuerHost(oidcEnv.issuerUrl),
    });

    return response;
  } catch (error) {
    const errorCode =
      error instanceof AppError ? error.code : "OIDC_CALLBACK_UNKNOWN";

    logOidcEvent({
      portal: "PUBLIC",
      stage: "callback.failure",
      issuerHost: safeIssuerHost(oidcEnv.issuerUrl),
      errorCode,
      failureStage: "callback",
    });

    if (error instanceof AppError && error.code === "USER_DISABLED") {
      return buildFailureResponse(request, "disabled");
    }

    return buildFailureResponse(request, "failed");
  }
}

export async function GET(request: Request) {
  return handleOidcCallback(request);
}
