import { createHmac, createHash, randomBytes } from "node:crypto";
import { createRemoteJWKSet, customFetch, jwtVerify } from "jose";
import { AppError } from "@/lib/http";
import { getEnvValue, getOidcEnv } from "@/lib/env";
import {
  OIDC_STATE_COOKIE_NAME,
  OIDC_STATE_TTL_SECONDS,
} from "@/lib/constants";

type OidcEnv = NonNullable<ReturnType<typeof getOidcEnv>>;

type OidcDiscoveryDocument = {
  issuer: string;
  authorization_endpoint: string;
  token_endpoint: string;
  userinfo_endpoint?: string;
  jwks_uri: string;
};

type OidcTokenResponse = {
  access_token?: string;
  id_token?: string;
  token_type?: string;
};

type OidcStateCookiePayload = {
  state: string;
  nonce: string;
  codeVerifier: string;
  portal: "PUBLIC" | "ADMIN";
  returnTo: string;
  redirectUri: string;
  expiresAt: number;
};

const discoveryCache = new Map<string, Promise<OidcDiscoveryDocument>>();

function normalizeOptionalString(value: unknown) {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim();
  return normalized ? normalized : null;
}

function signOidcStatePayload(payload: string) {
  return createHmac("sha256", getEnvValue("SESSION_SECRET"))
    .update(payload)
    .digest("base64url");
}

function getDiscoveryCacheKey(env: OidcEnv) {
  return env.issuerUrl;
}

function getDiscoveryUrl(issuerUrl: string) {
  if (issuerUrl.includes("/.well-known/")) {
    return issuerUrl;
  }

  return new URL(
    ".well-known/openid-configuration",
    issuerUrl.endsWith("/") ? issuerUrl : `${issuerUrl}/`,
  ).toString();
}

function createRandomToken(size = 32) {
  return randomBytes(size).toString("base64url");
}

export function safeIssuerHost(issuerUrl: string) {
  try {
    return new URL(issuerUrl).host;
  } catch {
    return "unknown";
  }
}

export function sanitizePostAuthRedirect(value: string | null | undefined) {
  if (!value) {
    return "/dashboard";
  }

  const normalized = value.trim();

  if (!normalized.startsWith("/") || normalized.startsWith("//")) {
    return "/dashboard";
  }

  return normalized;
}

export function buildOidcStateCookieOptions(expiresAt: number) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(expiresAt),
  };
}

export function createOidcStateCookieValue(input: {
  portal: "PUBLIC" | "ADMIN";
  returnTo: string;
  redirectUri: string;
  now?: number;
}) {
  const now = input.now ?? Date.now();
  const codeVerifier = createRandomToken(48);
  const payload: OidcStateCookiePayload = {
    state: createRandomToken(24),
    nonce: createRandomToken(24),
    codeVerifier,
    portal: input.portal,
    returnTo: sanitizePostAuthRedirect(input.returnTo),
    redirectUri: input.redirectUri,
    expiresAt: now + OIDC_STATE_TTL_SECONDS * 1000,
  };
  const encodedPayload = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  const signature = signOidcStatePayload(encodedPayload);

  return {
    ...payload,
    codeChallenge: createHash("sha256").update(codeVerifier).digest("base64url"),
    cookieValue: `${encodedPayload}.${signature}`,
  };
}

export function parseCookieHeader(cookieHeader: string | null, name: string) {
  if (!cookieHeader) {
    return null;
  }

  for (const part of cookieHeader.split(";")) {
    const [rawName, ...valueParts] = part.trim().split("=");

    if (rawName !== name) {
      continue;
    }

    return decodeURIComponent(valueParts.join("="));
  }

  return null;
}

export function parseOidcStateCookieValue(
  cookieValue: string | null | undefined,
  now = Date.now(),
) {
  if (!cookieValue) {
    throw new AppError(400, "OIDC sign-in state is missing.", "OIDC_STATE_INVALID");
  }

  const [encodedPayload, signature] = cookieValue.split(".");

  if (!encodedPayload || !signature) {
    throw new AppError(400, "OIDC sign-in state is invalid.", "OIDC_STATE_INVALID");
  }

  const expectedSignature = signOidcStatePayload(encodedPayload);

  if (signature !== expectedSignature) {
    throw new AppError(400, "OIDC sign-in state is invalid.", "OIDC_STATE_INVALID");
  }

  let payload: OidcStateCookiePayload;

  try {
    payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8"));
  } catch {
    throw new AppError(400, "OIDC sign-in state is invalid.", "OIDC_STATE_INVALID");
  }

  if (payload.expiresAt <= now) {
    throw new AppError(400, "OIDC sign-in state has expired.", "OIDC_STATE_EXPIRED");
  }

  return payload;
}

export function clearOidcStateCookie(response: Response & {
  cookies: {
    set: (
      name: string,
      value: string,
      options: ReturnType<typeof buildOidcStateCookieOptions>,
    ) => void;
  };
}) {
  response.cookies.set(
    OIDC_STATE_COOKIE_NAME,
    "",
    buildOidcStateCookieOptions(0),
  );
}

export async function getOidcDiscovery(env: OidcEnv, fetchImpl: typeof fetch = fetch) {
  const cacheKey = getDiscoveryCacheKey(env);
  const existing = discoveryCache.get(cacheKey);

  if (existing) {
    return existing;
  }

  const loader = (async () => {
    const response = await fetchImpl(getDiscoveryUrl(env.issuerUrl), {
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new AppError(
        502,
        "Unable to load OIDC configuration.",
        "OIDC_DISCOVERY_FAILED",
      );
    }

    const data = await response.json();
    const discovery: OidcDiscoveryDocument = {
      issuer: normalizeOptionalString(data.issuer) ?? "",
      authorization_endpoint:
        normalizeOptionalString(data.authorization_endpoint) ?? "",
      token_endpoint: normalizeOptionalString(data.token_endpoint) ?? "",
      userinfo_endpoint: normalizeOptionalString(data.userinfo_endpoint) ?? undefined,
      jwks_uri: normalizeOptionalString(data.jwks_uri) ?? "",
    };

    if (
      !discovery.issuer ||
      !discovery.authorization_endpoint ||
      !discovery.token_endpoint ||
      !discovery.jwks_uri
    ) {
      throw new AppError(
        502,
        "OIDC configuration is incomplete.",
        "OIDC_DISCOVERY_FAILED",
      );
    }

    return discovery;
  })();

  discoveryCache.set(cacheKey, loader);

  try {
    return await loader;
  } catch (error) {
    discoveryCache.delete(cacheKey);
    throw error;
  }
}

export function buildOidcAuthorizationUrl(input: {
  discovery: OidcDiscoveryDocument;
  clientId: string;
  redirectUri: string;
  scope: string;
  state: string;
  nonce: string;
  codeChallenge: string;
}) {
  const url = new URL(input.discovery.authorization_endpoint);

  url.searchParams.set("response_type", "code");
  url.searchParams.set("client_id", input.clientId);
  url.searchParams.set("redirect_uri", input.redirectUri);
  url.searchParams.set("scope", input.scope);
  url.searchParams.set("state", input.state);
  url.searchParams.set("nonce", input.nonce);
  url.searchParams.set("code_challenge", input.codeChallenge);
  url.searchParams.set("code_challenge_method", "S256");

  return url.toString();
}

export async function exchangeOidcCode(input: {
  env: OidcEnv;
  discovery: OidcDiscoveryDocument;
  code: string;
  redirectUri: string;
  codeVerifier: string;
  fetchImpl?: typeof fetch;
}) {
  const response = await (input.fetchImpl ?? fetch)(input.discovery.token_endpoint, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    cache: "no-store",
    body: new URLSearchParams({
      grant_type: "authorization_code",
      client_id: input.env.clientId,
      client_secret: input.env.clientSecret,
      code: input.code,
      redirect_uri: input.redirectUri,
      code_verifier: input.codeVerifier,
    }),
  });

  if (!response.ok) {
    throw new AppError(
      502,
      "OIDC token exchange failed.",
      "OIDC_TOKEN_EXCHANGE_FAILED",
    );
  }

  const tokens = (await response.json()) as OidcTokenResponse;

  if (!tokens.id_token) {
    throw new AppError(
      502,
      "OIDC response did not include an ID token.",
      "OIDC_TOKEN_EXCHANGE_FAILED",
    );
  }

  return tokens;
}

export async function verifyOidcIdToken(input: {
  env: OidcEnv;
  discovery: OidcDiscoveryDocument;
  idToken: string;
  nonce: string;
  fetchImpl?: typeof fetch;
}) {
  const jwks = createRemoteJWKSet(new URL(input.discovery.jwks_uri), {
    [customFetch]: input.fetchImpl ?? fetch,
  });
  const result = await jwtVerify(input.idToken, jwks, {
    issuer: input.discovery.issuer,
    audience: input.env.clientId,
  });
  const nonce = normalizeOptionalString(result.payload.nonce);

  if (nonce !== input.nonce) {
    throw new AppError(400, "OIDC nonce validation failed.", "OIDC_NONCE_INVALID");
  }

  return result.payload;
}

export async function fetchOidcUserInfo(input: {
  discovery: OidcDiscoveryDocument;
  accessToken: string;
  fetchImpl?: typeof fetch;
}) {
  if (!input.discovery.userinfo_endpoint) {
    return null;
  }

  const response = await (input.fetchImpl ?? fetch)(input.discovery.userinfo_endpoint, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${input.accessToken}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new AppError(
      502,
      "Unable to load OIDC user information.",
      "OIDC_USERINFO_FAILED",
    );
  }

  const userInfo = await response.json();

  if (typeof userInfo !== "object" || userInfo === null) {
    throw new AppError(
      502,
      "OIDC user information is invalid.",
      "OIDC_USERINFO_FAILED",
    );
  }

  return userInfo as Record<string, unknown>;
}

export function buildLoginRedirectUrl(
  request: Request,
  reason: "failed" | "unavailable" | "disabled",
) {
  const url = new URL("/login", request.url);

  if (reason === "disabled") {
    url.searchParams.set("disabled", "1");
    return url;
  }

  url.searchParams.set("oidc", reason);
  return url;
}
