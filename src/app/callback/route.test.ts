import assert from "node:assert/strict";
import test from "node:test";
import { handleOidcCallback } from "@/app/callback/route";
import { createOidcStateCookieValue } from "@/lib/auth/oidc";

process.env.SESSION_SECRET = "test-session-secret-value-123456";

const oidcEnv = {
  enabled: true as const,
  providerLabel: "Casdoor",
  issuerUrl: "https://casdoor.example.com",
  clientId: "client-id",
  clientSecret: "client-secret",
  scopes: "openid profile email phone",
  callbackPath: "/callback",
};

const discovery = {
  issuer: "https://casdoor.example.com",
  authorization_endpoint: "https://casdoor.example.com/login/oauth/authorize",
  token_endpoint: "https://casdoor.example.com/api/login/oauth/access_token",
  userinfo_endpoint: "https://casdoor.example.com/api/userinfo",
  jwks_uri: "https://casdoor.example.com/.well-known/jwks",
};

function buildCallbackRequest(input: {
  state: string;
  cookieValue?: string;
}) {
  return new Request(
    `http://hidden.rakko.cn/callback?code=sample-code&state=${encodeURIComponent(input.state)}`,
    {
      headers: input.cookieValue
        ? {
            cookie: `hidden_oidc_state=${encodeURIComponent(input.cookieValue)}`,
          }
        : undefined,
    },
  );
}

test("OIDC callback rejects invalid state by redirecting back to login", async () => {
  const response = await handleOidcCallback(
    buildCallbackRequest({
      state: "missing-cookie",
    }),
    {
      getOidcEnv: () => oidcEnv,
      now: () => 1_000,
    },
  );

  assert.equal(response.status, 307);
  assert.equal(
    response.headers.get("location"),
    "http://hidden.rakko.cn/login?oidc=failed",
  );
});

test("OIDC callback handles discovery or token failures cleanly", async () => {
  const flowState = createOidcStateCookieValue({
    portal: "PUBLIC",
    redirectUri: "http://hidden.rakko.cn/callback",
    returnTo: "/dashboard",
    now: 1_000,
  });
  const response = await handleOidcCallback(
    buildCallbackRequest({
      state: flowState.state,
      cookieValue: flowState.cookieValue,
    }),
    {
      getOidcEnv: () => oidcEnv,
      getOidcDiscovery: async () => {
        throw new Error("network down");
      },
      now: () => 1_000,
    },
  );

  assert.equal(response.status, 307);
  assert.equal(
    response.headers.get("location"),
    "http://hidden.rakko.cn/login?oidc=failed",
  );
  assert.match(
    response.headers.get("set-cookie") ?? "",
    /hidden_oidc_state=;/,
  );
});

test("OIDC callback creates a local session and redirects to the dashboard", async () => {
  const flowState = createOidcStateCookieValue({
    portal: "PUBLIC",
    redirectUri: "http://hidden.rakko.cn/callback",
    returnTo: "/dashboard",
    now: 1_000,
  });
  const response = await handleOidcCallback(
    buildCallbackRequest({
      state: flowState.state,
      cookieValue: flowState.cookieValue,
    }),
    {
      getOidcEnv: () => oidcEnv,
      getOidcDiscovery: async () => discovery,
      exchangeOidcCode: async () => ({
        id_token: "id-token",
        access_token: "access-token",
      }),
      verifyOidcIdToken: async () => ({
        sub: "casdoor-user-1",
        email: "hello@example.com",
        nonce: flowState.nonce,
      }),
      fetchOidcUserInfo: async () => ({
        sub: "casdoor-user-1",
        email: "hello@example.com",
      }),
      signInWithOidcClaims: async () => ({
        profile: {
          provider: "CASDOOR",
          issuer: discovery.issuer,
          subject: "casdoor-user-1",
          email: "hello@example.com",
          externalPhone: null,
          displayName: null,
          organization: null,
        },
        user: {
          id: "user-1",
          phone: null,
          email: "hello@example.com",
          externalPhone: null,
          role: "USER",
          status: "ACTIVE",
          createdAt: new Date("2026-04-12T00:00:00.000Z"),
          displayLabel: "hello@example.com",
          hasPassword: false,
          hasOidcIdentity: true,
        },
        session: {
          token: "session-token",
          expiresAt: new Date("2030-01-01T00:00:00.000Z"),
        },
      }),
      now: () => 1_000,
    },
  );

  assert.equal(response.status, 307);
  assert.equal(response.headers.get("location"), "http://hidden.rakko.cn/dashboard");

  const setCookie = response.headers.get("set-cookie") ?? "";

  assert.match(setCookie, /hidden_session=session-token/);
  assert.match(setCookie, /hidden_oidc_state=;/);
});
