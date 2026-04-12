import assert from "node:assert/strict";
import test from "node:test";
import { handleOidcStart } from "@/app/api/auth/oidc/start/route";

process.env.SESSION_SECRET = "test-session-secret-value-123456";

test("OIDC start builds the authorize redirect and state cookie", async () => {
  const response = await handleOidcStart(
    new Request("http://hidden.rakko.cn/api/auth/oidc/start?returnTo=%2Fdashboard%3Ftab%3Dme"),
    {
      getOidcEnv: () => ({
        enabled: true,
        providerLabel: "Casdoor",
        issuerUrl: "https://casdoor.example.com",
        clientId: "client-id",
        clientSecret: "client-secret",
        scopes: "openid profile email phone",
        callbackPath: "/callback",
      }),
      getOidcDiscovery: async () => ({
        issuer: "https://casdoor.example.com",
        authorization_endpoint: "https://casdoor.example.com/login/oauth/authorize",
        token_endpoint: "https://casdoor.example.com/api/login/oauth/access_token",
        jwks_uri: "https://casdoor.example.com/.well-known/jwks",
      }),
      now: () => 1_000,
    },
  );

  assert.equal(response.status, 307);

  const location = response.headers.get("location");

  assert.ok(location);

  const authorizationUrl = new URL(location);

  assert.equal(
    authorizationUrl.origin + authorizationUrl.pathname,
    "https://casdoor.example.com/login/oauth/authorize",
  );
  assert.equal(authorizationUrl.searchParams.get("response_type"), "code");
  assert.equal(authorizationUrl.searchParams.get("client_id"), "client-id");
  assert.equal(
    authorizationUrl.searchParams.get("redirect_uri"),
    "http://hidden.rakko.cn/callback",
  );
  assert.equal(
    authorizationUrl.searchParams.get("scope"),
    "openid profile email phone",
  );
  assert.ok(authorizationUrl.searchParams.get("state"));
  assert.ok(authorizationUrl.searchParams.get("nonce"));
  assert.equal(
    authorizationUrl.searchParams.get("code_challenge_method"),
    "S256",
  );
  assert.match(
    response.headers.get("set-cookie") ?? "",
    /hidden_oidc_state=/,
  );
});
