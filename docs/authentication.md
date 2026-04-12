# Hidden Authentication

This document describes the current authentication model as implemented in the codebase.

## Auth Model Overview

Hidden supports two authentication paths for the public site and one for the admin portal:

| Path | Entry point | Method |
|------|-------------|--------|
| Public OIDC (primary) | `/api/auth/oidc/start` | Casdoor authorization code flow |
| Public legacy (secondary) | `/api/auth/login`, `/api/auth/register` | Phone + password + invite code |
| Admin login | `/admin-login` | Phone + password only |

All three paths finish by issuing the same local session cookie (`hidden_session`). There is no third-party session dependency at runtime after the initial OIDC exchange completes.

## Public OIDC Flow

This is the recommended sign-in path for the public site when `OIDC_ENABLED=true`.

### Sequence

1. User clicks "Continue with Casdoor" on `/login` or `/register`.
2. Browser navigates to `GET /api/auth/oidc/start`.
3. The start handler:
   - loads OIDC discovery from the issuer URL
   - generates `state`, `nonce`, and a PKCE `code_verifier`
   - signs these into an HTTP-only cookie (`hidden_oidc_state`)
   - redirects to the Casdoor authorization endpoint
4. User authenticates at Casdoor and is redirected to `APP_URL/callback?code=...&state=...`.
5. The callback handler at `GET /callback`:
   - parses and validates the signed state cookie
   - verifies the `state` parameter matches
   - exchanges the authorization code for tokens at the token endpoint (with PKCE `code_verifier` and `client_secret`)
   - verifies the ID token signature against the JWKS, checks `issuer`, `audience`, and `nonce`
   - optionally fetches the userinfo endpoint if an access token and userinfo URL are available
   - merges ID token and userinfo claims (userinfo takes precedence for overlapping fields)
   - verifies that the `sub` claim is consistent between ID token and userinfo
6. The callback handler provisions or updates the local account:
   - looks up `UserIdentity` by `(provider, issuer, subject)`
   - if found, updates profile fields (email, external phone, organization) and signs in
   - if not found, creates a new `User` and `UserIdentity` record
7. The handler creates a local session, sets the `hidden_session` cookie, clears the OIDC state cookie, and redirects to `/dashboard`.

### Security Properties

- **PKCE S256**: protects the authorization code exchange against interception.
- **Signed state cookie**: HMAC-SHA256 with `SESSION_SECRET` prevents state forgery.
- **Nonce validation**: prevents ID token replay.
- **Subject consistency check**: rejects responses where the userinfo `sub` differs from the ID token `sub`.
- **Post-auth redirect sanitization**: only relative paths starting with `/` are allowed; all others fall back to `/dashboard`.
- **State TTL**: the OIDC state cookie expires after 10 minutes.

## Legacy Phone/Password Flow

The legacy path remains fully functional for backward compatibility.

### Login

`POST /api/auth/login` accepts `{ phone, password, portal }`. The handler verifies the password against the stored hash, checks the user's portal eligibility and account status, creates a session, and returns the session cookie.

### Registration

`POST /api/auth/register` accepts `{ phone, password, inviteCode }`. The handler validates the invite code (existence, status, usage count, expiration), creates the user inside a serializable transaction, increments the invite usage counter, creates a session, and returns the session cookie.

### Admin Login

Admin login uses the same `POST /api/auth/login` endpoint with `portal: "ADMIN"`. The request must arrive through the admin Nginx listener which injects the `x-hidden-admin-portal: 1` header. Non-admin users are rejected at this portal.

## Account Model

### Users

- `phone`: nullable, unique. Set for legacy accounts; null for OIDC-only accounts.
- `passwordHash`: nullable. Set for legacy accounts; null for OIDC-only accounts.
- `email`: nullable. Populated from OIDC claims when available.
- `externalPhone`: nullable. Populated from OIDC `phone_number` or `phone` claims; stored as a display field, not used for login.
- `role`: `USER` or `ADMIN`.
- `status`: `ACTIVE`, `DISABLED`, or `BANNED`.

### Identity Mapping

The `UserIdentity` table links external identities to local users:

- `provider`: currently only `CASDOOR`.
- `issuer`: the OIDC issuer URL.
- `subject`: the `sub` claim, used as the durable identity key.
- `organization`: preserved from Casdoor claims for future admin authorization.
- Unique constraint on `(provider, issuer, subject)`.

### Account Behavior

- First OIDC sign-in creates a new local `USER` account when no identity mapping exists.
- Existing local phone/password accounts are **not** auto-linked to OIDC identities in the current design.
- OIDC-only accounts may have email, external phone, both, or neither. The UI uses a fallback display chain: `phone` → `externalPhone` → `email` → masked OIDC subject.
- Password changes are unavailable for accounts without a local password hash. The security settings page shows an informational notice instead.

## Session Management

All authentication paths produce the same session structure:

- A random 32-byte token is generated and its SHA-256 hash (salted with `SESSION_SECRET`) is stored in the `Session` table.
- The raw token is set as the `hidden_session` HTTP-only cookie with a 30-day TTL.
- Session lookup on each request finds the session by token hash and includes the user's display data, identity information, and password presence flag.

Logout clears the session cookie and deletes the session record. In the current design, logout is local-only and does not call any upstream OIDC logout endpoint.

## OIDC Claim Normalization

Claims from the ID token and userinfo are normalized as follows:

| Hidden field | Claim priority |
|-------------|----------------|
| `externalPhone` | `phone_number`, then `phone` |
| `email` | `email` |
| `displayName` | `name`, then `preferred_username` |
| `organization` | `Organization`, `organization`, or `org_name` |

Email values are lowercased. Phone values have spaces, parentheses, and hyphens stripped.

## Structured Logging

OIDC authentication events are logged as structured JSON with the event name `oidc.auth`:

- `stage`: `start`, `callback.success`, or `callback.failure`
- `portal`: `PUBLIC`
- `issuerHost`: the hostname of the OIDC issuer (never the full URL or secrets)
- `errorCode`: the application error code on failure
- `failureStage`: which step failed (`start` or `callback`)

Logs never include tokens, authorization codes, client secrets, or raw claim payloads.

## Future Roadmap (Not Active)

These items are recorded for planning purposes. They are **not implemented** in the current codebase:

- **Admin OIDC**: if added, the intended authorization rule is Casdoor `groups` containing `administrator`. The `organization` field on `UserIdentity` is already preserved to support this without schema changes.
- **Upstream logout**: Casdoor supports SSO logout, but the current design intentionally signs out of Hidden only.
- **Account linking**: a future phase may allow linking an existing phone/password account to an OIDC identity.
