# Casdoor IdP Setup for Hidden

This guide explains how to create and configure a Casdoor application so Hidden can use it as an OIDC identity provider for the public site.

## Prerequisites

- A running Casdoor instance with admin access.
- The public URL where Hidden is deployed (the value of `APP_URL` in `.env`).

## 1. Create the Casdoor Application

1. Open the Casdoor admin console and go to **Applications**.
2. Click **Add** to create a new application.
3. Set the application name (suggestion: `hidden` or `hidden-public`).
4. Note the generated **Client ID** and **Client Secret**. You will need both for Hidden's environment variables.

## 2. Configure the Application

### Grant Type and Response Type

- Grant type: `authorization_code` (the standard OIDC code flow).
- Response type: `code`.

### Redirect URI

Add exactly one redirect URI for the current stage:

```
APP_URL/callback
```

Replace `APP_URL` with the actual public URL of your Hidden deployment. Examples:

| Deployment | Redirect URI |
|-----------|-------------|
| Local HTTP | `http://localhost:3000/callback` |
| LAN | `http://192.168.1.20:3000/callback` |
| Production HTTPS | `https://hidden.example.com/callback` |

**Casdoor redirect matching is exact on scheme, host, port, and path.** If any part does not match, the callback will fail with a redirect URI mismatch error.

There is no admin callback URI to configure in the current stage. Admin login uses phone/password only.

### Scopes

Enable these scopes on the application:

- `openid` (required)
- `profile`
- `email`
- `phone`

The default Hidden configuration requests `openid profile email phone`.

### Token and Signing

- Ensure the application issues signed ID tokens (Casdoor does this by default).
- Hidden verifies ID tokens using the JWKS endpoint published in the OIDC discovery document.

## 3. User Attributes and Claims

Hidden reads these claims from the ID token and userinfo endpoint:

| Claim | Usage | Required |
|-------|-------|----------|
| `sub` | Durable identity key for account linking | **Yes** |
| `email` | Stored as the user's email for display | No |
| `phone_number` or `phone` | Stored as external phone for display | No |
| `name` or `preferred_username` | Display name (used in UI helpers) | No |
| `Organization` or `organization` | Preserved for future admin authorization | No |

If neither `email` nor `phone_number`/`phone` is present, the user's display label falls back to a masked version of the `sub` value.

### Future Admin Rule (Not Active Yet)

A future stage may use the Casdoor `groups` field to determine admin access. The intended rule is: if `groups` contains `administrator`, the user may be granted admin privileges. This is **not enforced** in the current codebase. The `organization` value is already stored on the identity record so a later admin rollout does not require schema changes.

## 4. Hidden Environment Variables

Map the Casdoor application settings to these Hidden environment variables in `.env`:

```env
OIDC_ENABLED=true
OIDC_PROVIDER_LABEL=Casdoor
OIDC_ISSUER_URL=https://casdoor.example.com
OIDC_CLIENT_ID=<client-id-from-casdoor>
OIDC_CLIENT_SECRET=<client-secret-from-casdoor>
OIDC_SCOPES=openid profile email phone
OIDC_CALLBACK_PATH=/callback
```

### Variable Reference

| Variable | Description |
|----------|-------------|
| `OIDC_ENABLED` | Set to `true` to show the OIDC sign-in button on the public site |
| `OIDC_PROVIDER_LABEL` | Display name shown on buttons and notices (default: `Casdoor`) |
| `OIDC_ISSUER_URL` | The Casdoor issuer URL; Hidden appends `/.well-known/openid-configuration` automatically |
| `OIDC_CLIENT_ID` | The client ID from the Casdoor application |
| `OIDC_CLIENT_SECRET` | The client secret from the Casdoor application |
| `OIDC_SCOPES` | Space-separated scopes to request (default: `openid profile email phone`) |
| `OIDC_CALLBACK_PATH` | The path portion of the callback URL (default: `/callback`) |

The full callback URL is constructed at runtime as `<request-origin>/callback`. It must match the redirect URI configured in Casdoor exactly.

## 5. Deployment Examples

### Local HTTP Development

```env
APP_URL=http://localhost:3000
OIDC_ENABLED=true
OIDC_ISSUER_URL=http://localhost:8000
OIDC_CLIENT_ID=abc123
OIDC_CLIENT_SECRET=secret123
OIDC_CALLBACK_PATH=/callback
```

Casdoor redirect URI: `http://localhost:3000/callback`

### LAN or Private Network

```env
APP_URL=http://192.168.1.20:3000
OIDC_ENABLED=true
OIDC_ISSUER_URL=http://192.168.1.20:8000
OIDC_CLIENT_ID=abc123
OIDC_CLIENT_SECRET=secret123
OIDC_CALLBACK_PATH=/callback
```

Casdoor redirect URI: `http://192.168.1.20:3000/callback`

### Production HTTPS

```env
APP_URL=https://hidden.example.com
OIDC_ENABLED=true
OIDC_ISSUER_URL=https://casdoor.example.com
OIDC_CLIENT_ID=abc123
OIDC_CLIENT_SECRET=secret123
OIDC_CALLBACK_PATH=/callback
```

Casdoor redirect URI: `https://hidden.example.com/callback`

## 6. Operations Guidance

### Secret Handling

- **Rotate the client secret** before any non-local deployment. Do not use the default or development secret in production.
- **Never commit secrets** to the repository, issue trackers, or documentation files. Store them in `.env` (which is gitignored) or a dedicated secret manager.
- After rotating the secret in Casdoor, update `OIDC_CLIENT_SECRET` in `.env` and restart the Hidden stack.

### Redirect URI Maintenance

- When moving from HTTP to HTTPS, update the redirect URI in Casdoor **and** update `APP_URL` in `.env`.
- After any domain, port, or reverse-proxy change, verify that the Casdoor redirect URI matches the actual public callback URL.
- The redirect URI check is exact. A trailing slash difference, port mismatch, or scheme mismatch will cause the flow to fail.

### Discovery Cache

Hidden caches the OIDC discovery document in process memory after the first successful fetch. If the Casdoor instance changes its discovery metadata (for example, after key rotation), restart the Hidden web container to clear the cache:

```bash
docker compose restart web
```

## 7. Troubleshooting

### Callback redirect URI mismatch

**Symptom**: Casdoor shows "redirect URI mismatch" or the callback redirects to `/login?oidc=failed`.

**Check**:
1. The redirect URI in the Casdoor application settings matches `APP_URL/callback` exactly.
2. Scheme (`http` vs `https`), host, and port all match.
3. There is no trailing slash difference.

### Missing issuer or client configuration

**Symptom**: clicking "Continue with Casdoor" redirects to `/login?oidc=unavailable`.

**Check**:
1. `OIDC_ENABLED=true` is set in `.env`.
2. `OIDC_ISSUER_URL`, `OIDC_CLIENT_ID`, and `OIDC_CLIENT_SECRET` are all set and non-empty.
3. The Hidden stack was restarted after changing these values.

### Token exchange failure

**Symptom**: the callback redirects to `/login?oidc=failed`. Server logs show `oidc.auth` with `errorCode: "OIDC_TOKEN_EXCHANGE_FAILED"`.

**Check**:
1. The `OIDC_CLIENT_SECRET` matches the secret configured in Casdoor.
2. The Casdoor instance is reachable from the Hidden web container.
3. The Casdoor application has `authorization_code` as an allowed grant type.

### Missing `sub` claim

**Symptom**: the callback redirects to `/login?oidc=failed`. Server logs show `errorCode: "OIDC_PROFILE_INVALID"`.

**Check**:
1. The Casdoor application is configured to include the `sub` claim in the ID token.
2. The `openid` scope is enabled.

### User display shows "OIDC ..." or "Unknown account"

**Symptom**: the dashboard or admin panel shows a masked subject ID instead of a readable identifier.

**Explanation**: this happens when the Casdoor user has neither an email address nor a phone number configured. Hidden falls back to displaying a masked version of the OIDC subject.

**Fix**: ensure the Casdoor user has an email or phone number set, and that the `email` and `phone` scopes are enabled on the application.

### OIDC state expired

**Symptom**: the callback redirects to `/login?oidc=failed`. Server logs show `errorCode: "OIDC_STATE_EXPIRED"`.

**Explanation**: the user took more than 10 minutes between clicking "Continue with Casdoor" and completing authentication.

**Fix**: the user should retry the sign-in flow.
