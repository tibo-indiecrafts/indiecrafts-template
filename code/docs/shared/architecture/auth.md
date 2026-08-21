# Authentication (cross-app)

One authentication system across every deployable, built on [Clerk](https://clerk.com).
Users sign in on all apps. A single global `admin` role gates the admin app. Auth is
**passwordless** — email one-time-code plus the main social providers. No database: the
role rides the signed session token.

Full design + review record: `docs/superpowers/specs/2026-08-21-clerk-auth-multi-app-design.md`.

## The two bricks

Auth is split by scope, because the three Clerk SDKs cannot be shared but the contract can.

| Brick | Scope | Holds |
| --- | --- | --- |
| `@indiecrafts/packages-shared-auth` | shared (DOM-free) | `Roles`, `AppSessionClaims`, `isAdmin(claims)` — the portable contract. No Clerk/React/Next. |
| `@indiecrafts/packages-web-auth` | web | `AppClerkProvider` + `authAppearance()` — the themed provider for the Next surfaces + the Electron renderer. |

## Per-platform SDK

| App | Stack | Clerk SDK |
| --- | --- | --- |
| website, admin, app | Next 16 / Cloudflare | `@clerk/nextjs` |
| mobile | Expo | `@clerk/clerk-expo` (token cache on `expo-secure-store`) |
| hybrid | Electron | `@clerk/clerk-react` in the renderer (social via system-browser + `indiecrafts://` deep link) |

## The role model

The role lives in Clerk `publicMetadata` — backend-writable only, so it is tamper-proof.
The Clerk Dashboard surfaces it on the session token via the claim:

```json
{ "metadata": "{{user.public_metadata}}" }
```

Every check is then a JWT read, not an API call. `isAdmin(claims)` is strict
(`role === "admin"`) and safe on `null` / malformed claims. **Enforce it server-side** in
every admin server action, route handler, and protected layout — middleware is coarse
routing and is bypassable (Next.js CVE-2025-29927), never the sole boundary.

Each app types Clerk's claims from the one shared home:

```ts
// <app>/src/global.d.ts (or types/globals.d.ts)
import type { AppSessionClaims } from "@indiecrafts/packages-shared-auth";
declare global {
  interface CustomJwtSessionClaims extends AppSessionClaims {}
}
```

## Email verification for social

Trust the email a verified OAuth provider returns (Google, Apple, Microsoft mark it
verified) — do not force a second OTP on it. Enable Clerk's **"require a verified email for
account linking"** to close the account-linking hijack path. GitHub can return an
unverified primary email, so confirm Clerk trusts only verified GitHub emails.

## Suspicious logins

For a passwordless app the OTP is already the per-sign-in factor, so a new-device sign-in
already needs inbox access. Do **not** add an extra "suspicious-login code." Enable Clerk's
**unauthorized sign-in detection** (email to the account owner). We run on the **Clerk free
plan**, so the one-click revoke-from-email button is unavailable — revoke is manual from the
account UI. Bot protection and user-enumeration protection stay on by default; the
`@indiecrafts/packages-shared-security` `withGuard` + Cloudflare WAF are defence-in-depth.

## Web wiring

Next-specific provider + middleware details: [Authentication (Clerk)](/apps/web/config/auth).
