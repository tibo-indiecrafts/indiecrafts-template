# Clerk auth across the multi-app monorepo — design

- **Date:** 2026-08-21
- **Status:** Draft — revised after security / config / architecture review
- **Author:** platform
- **Scope:** authentication + admin RBAC for `website`, `admin`, `app` (Next/Cloudflare), `mobile` (Expo), `hybrid` (Electron)

## 1. Goal

Add one authentication system across every deployable. Users sign in on all
apps. One `admin` role gates the admin app. Auth is passwordless: email
one-time-code plus the main social providers. No database — the role rides the
Clerk session token; audit events go to a durable Cloudflare sink.

## 2. Non-goals

- No password sign-in. Passwordless only.
- No admin gate on `website`, `app`, `mobile`, or `hybrid`. Login is available
  there; the `admin` role is enforced only on the `admin` app.
- No `/studio` (Sanity) gate change. Studio keeps its own Sanity auth (see §12).
- No organizations / multi-tenant roles. Single global `admin` role. Clerk
  Organizations is the upgrade path if org-scoped admins are needed later.

## 3. Decisions (resolved with the requester)

| Question | Decision |
| --- | --- |
| Sign-in methods | Passwordless: email OTP + main socials (Google, Apple, GitHub) |
| Electron social | Full social via system-browser OAuth + `indiecrafts://` deep link, PKCE-bound |
| Admin gate location | `admin` app only (replaces the planned Cloudflare Access gate) |
| Sharing | DOM-free contract in `shared/auth`; web provider + appearance in `web/auth` |
| Email confirm for social | Trust verified OAuth emails; do not double-verify |

Apple is mandatory on the iOS build once any social provider is offered — an
App Store rule. The exact provider set is a Clerk dashboard toggle, cheap to
change.

## 4. Architecture

### 4.1 Shared contract — `packages/shared/auth` (DOM-free)

Framework-agnostic. No Clerk SDK, no React/DOM import (the `shared/` scope rule).
It holds only the portable contract:

- `Roles = 'admin'` — one home for the role string. `moderator` is **cut**: the
  moderation route (`/api/comments/moderate`) is token-gated, not role-gated, so
  nothing consumes it. Widen the union when a second gated role ships.
- `isAdmin(claims)` — strict `claims.metadata?.role === 'admin'`. The only
  exported check. `hasRole(claims, role)` is deferred until a second role exists
  (YAGNI). A `moderator`, if ever added, must **not** pass `isAdmin`.
- The session-claims **type** is canonical here: `type AppSessionClaims = {
  metadata?: { role?: Roles } }`. This is the single home (see §8).

Tests: `isAdmin` returns true for admin, false for missing / malformed /
non-admin claims.

The three Clerk SDKs (`@clerk/nextjs`, `@clerk/clerk-expo`, `@clerk/clerk-react`)
cannot be unified. Only this contract is portable, mirroring the existing
`packages-shared-config` vs `packages-web-i18n` split.

> Fallback (per architecture review): `shared/auth` is a thin ~15-line brick. It
> is defensible as a reserved brick with 5 consumers and is a named security
> boundary, so it earns its own home. If we prefer not to spin a brick this thin,
> the contract folds into `packages-shared-config`. **Flagged for your call.**

### 4.2 Web provider + appearance — `packages/web/auth` (web tier)

DOM-coupled Clerk wiring shared by the three Next apps **and** the Electron
renderer (which reuses web bricks) — 4 consumers:

- `<AppClerkProvider>` — wraps `<ClerkProvider>` with `appearance` from tokens.
- `authAppearance(tokens)` — maps `@indiecrafts/packages-shared-ui-tokens` to
  Clerk's `appearance`. **Moved here from `shared/auth`** (review [High]): it
  themes DOM sign-in components, a web concern; mobile's Clerk styling API
  differs and stays in the mobile app.
- `composeAuthMiddleware(...)` — the `clerkMiddleware` pipeline helper apps call.

### 4.3 Web wiring — `website`, `admin`, `app` (`@clerk/nextjs`)

**Each app owns its own `src/proxy.ts`** (no cross-app import). The `isAdmin`
gate exists **only in the admin app's copy**. Middleware pipeline order:

1. maintenance rewrite (unchanged),
2. admin app only: `isAdmin(sessionClaims)` gate → redirect to sign-in,
3. next-intl middleware (unchanged).

```ts
export default clerkMiddleware(async (auth, request) => {
  const isDown = features.maintenance || (await getMaintenanceMode());
  const maintenance = maintenanceRewrite(request, isDown);
  if (maintenance) return maintenance;
  // admin app only:
  // const { sessionClaims } = await auth();
  // if (!isAdmin(sessionClaims)) return redirectToSignIn();
  return intlMiddleware(request);
});
```

**Authz is enforced in the data layer, not middleware alone** (review
[CRITICAL]). Middleware is coarse routing and is bypassable (Next.js
CVE-2025-29927 `x-middleware-subrequest`), and the reused website matcher
excludes `/api`, `_next`, etc. Therefore, in the admin app:

- Every admin **server action**, **route handler**, and protected **RSC
  layout** calls `auth.protect()` / checks `isAdmin(await auth())` server-side.
- The matcher **includes** admin `/api/*` and every protected segment (or each
  handler self-gates). Middleware is defense-in-depth, never the sole boundary.
- Any authenticated admin endpoint composes `auth()` **and** `withGuard`
  (`withGuard` does origin/rate/Turnstile; it has no auth concept).

**Fail-closed at the edge** (review [High]): the admin gate must **deny** when
`clerkMiddleware` cannot verify the JWT. It must not inherit the maintenance
read's documented fail-open. The edge spike (§9, §10) proves an unauthenticated
and a non-admin request are both blocked even when the Sanity/maintenance read
throws.

**Admin app is sign-in only** (review [Low]): render Clerk's `<SignIn>` and
bounce unknown users; no open sign-up flow on the admin surface, so attackers
cannot provision accounts against it.

**Admin i18n** (config review [High]): `admin` currently has no `[locale]`
segment, no `src/i18n/routing.ts`, no `messages/`. **Decision:** wire admin with
the **full i18n scaffold** (`[locale]` + `src/i18n/{routing,request}.ts` +
`messages/`) matching `website`/`app`, as a **Phase 2 prerequisite before** the
Clerk sign-in UI lands. Sign-in uses Clerk's prebuilt `<SignIn>`
(Clerk-localized); any custom admin chrome copy routes through `@/i18n/routing`
+ `messages/<locale>.json` like every other app — no exception.

Keys: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` (public — allowed) and
`CLERK_SECRET_KEY` (server-only, never `NEXT_PUBLIC`). Public API routes on
`website` keep their `withGuard` posture; `website` and `app` mount the provider
but do not require login.

### 4.4 Mobile — Expo (`@clerk/clerk-expo`)

- `<ClerkProvider>` in `app/_layout.tsx`, inside the existing provider tree.
- **Token cache on `expo-secure-store`** (Keychain / Keystore), **not
  AsyncStorage** (review [High]). AsyncStorage is plaintext on-disk and rides
  device backups; Clerk's documented Expo pattern uses secure-store. Add the
  dependency.
- Sign-in screen: email OTP + social (Clerk native OAuth via the system browser
  / `expo-web-browser`). Role readable via `isAdmin`. No admin gate.
- Key: `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` (Expo public-env prefix, **not**
  `NEXT_PUBLIC_`). **No secret key on device.**

### 4.5 Hybrid — Electron (`@clerk/clerk-react` in the renderer)

The renderer is Chromium running React DOM, so it reuses the web bricks.

- **Email OTP** runs directly over Clerk's Frontend API. No redirect. Works
  inside the current security model unchanged.
- **Social OAuth** — system-browser flow, **cryptographically bound** (review
  [CRITICAL], RFC 8252):
  1. main registers `indiecrafts://` via `app.setAsDefaultProtocolClient`,
  2. renderer generates a **PKCE `code_verifier` + `state`/`nonce`** and holds
     them; only the `code_challenge` + `state` go into the authorize URL,
  3. main opens the authorize URL in the **system browser**
     (`shell.openExternal`) with `redirectUrl = indiecrafts://oauth-callback`,
  4. the OS returns the callback — `open-url` (macOS) or `second-instance` argv
     (Win/Linux),
  5. main **strictly parses** the inbound URL and forwards only the extracted,
     allowlisted params over a narrow preload channel (`onOAuthCallback`),
  6. renderer re-validates `state`/`nonce`, completes sign-in with the PKCE
     `code_verifier`.
- Confirm exactly what credential Clerk returns on the custom-scheme redirect
  and that it is **single-use + client-bound**. If binding cannot be guaranteed,
  ship **OTP-only on desktop** and defer social (the fallback below).
- **Inbound-scheme hardening** (review [Medium]): require
  `app.requestSingleInstanceLock()`; parse the inbound URL in main (exact
  host/path `oauth-callback`, allowlist expected params, length-cap, reject
  everything else) **before** IPC; forward only extracted params, never a
  navigable URL. `isSafeExternalUrl` stays http(s)-only and is never handed the
  custom scheme.
- **Renderer token asymmetry** (review [Medium]): `@clerk/clerk-react` puts the
  session token in the renderer (least-trusted process), unlike the web app's
  httpOnly `__session` cookie and unlike the agent token which stays in main.
  Compensating controls: tighten CSP (`connect-src` limited to Clerk FAPI, no
  third-party script, no `unsafe-inline`), keep
  `contextIsolation`/`sandbox`/no-cross-origin-nav. **Publishable key only**
  (`VITE_`/`RENDERER_VITE_` public-env prefix); the secret key never enters the
  desktop binary.
- **Ponytail fallback:** email OTP is the guaranteed desktop sign-in. If the
  PKCE deep-link flow slips a milestone, desktop ships with OTP.

## 5. Email verification for social sign-in

- OAuth providers that verify email (Google, Apple, Microsoft) return
  `email_verified`. Trust it. Do not force a second OTP on a verified social
  email — friction, no gain. The email-OTP path verifies by nature.
- **GitHub caveat** (review [Medium]): GitHub OAuth can return an *unverified*
  primary email. Confirm Clerk trusts only **verified** GitHub emails for
  sign-in and linking.
- Account-linking hijack is the real risk. Clerk setting **"require a verified
  email for account linking"** — ON. Verify it applies to the OAuth-provided
  email, not just manual linking.

## 6. Suspicious logins / account protection

**For a passwordless app, do not bolt on an extra "suspicious-login code."**
Every sign-in already sends a one-time code (the OTP is the per-sign-in factor),
so a new-device sign-in already requires inbox access. The marginal value is
**notify-and-revoke**, not another code.

- **Unauthorized sign-in detection** — Clerk emails the account owner (device,
  OS, IP, location, method). **We run on the Clerk free plan**, so the one-click
  **revoke-from-email** button is unavailable; the email still informs, and
  revoke is manual from the account UI / active-devices list. Enable detection;
  theme the email where the free plan allows.
- **Device Trust (Client Trust)** — **not applicable.** Clerk documents it as
  password-only: passwordless (email link, OTP, passkeys, OAuth) is unaffected.
  Not planned around.
- **Bot protection** — on at sign-up **and sign-in** (review [Medium]:
  email-bombing a victim through the OTP-send endpoint). Complements Turnstile +
  CF WAF.
- **OTP limits** (review [Medium]): verify and record Clerk's per-code attempt
  cap, expiry, single-use invalidation, and resend rate-limit — do not assume.
  A 6-digit code is a 10⁶ space; these limits are the security.
- **User enumeration protection** — on by default. Keep on.

## 7. Admin authz & privilege model (new — review [High] ×3)

Open passwordless sign-up means anyone can create an account. The only thing
between a stranger and admin is the role grant, so treat it as the crown jewel.

- **Role-grant path** — `clerkClient().users.updateUserMetadata(userId, {
  publicMetadata: { role: 'admin' } })` runs **only** from an admin-gated server
  action **in the admin app**, validates the target `userId`, and is
  audit-logged. It is the highest-value endpoint in the system.
- **First admin** — set from the Clerk dashboard (Public metadata). No
  self-service path.
- **Session revocation on demotion** — revoking `publicMetadata.role` does not
  kill live sessions; a demoted admin keeps `role:admin` until the token
  refreshes. On revocation, **revoke the user's sessions** (Clerk
  `sessions.revokeSession` / sign-out). Do not rely on token expiry.
- **Admin session lifetime** — set an explicit, **shorter** session / inactivity
  lifetime for the admin app; document the residual ≤ token-lifetime window.
- **Audit logging** — emit structured audit events (actor `userId`, action,
  target, timestamp, IP) for role grant/revoke, admin sign-in, and admin
  mutations to a **durable Cloudflare sink** — Logpush, or the shared
  `api`/`workers` Worker → D1/KV — not ephemeral `logger` calls. Matches the
  Cloudflare-observability decision and the no-database goal (Logpush needs no
  DB). **Flagged:** Logpush-structured vs a D1 audit table is your call;
  recommend Logpush for phase 1.

## 8. Config-first compliance

- **Per-app key homes:** Next apps get both keys (secret server-only). Expo gets
  **only** `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY`; the Electron renderer gets
  **only** the publishable key under `VITE_`/`RENDERER_VITE_`. The secret key
  exists **nowhere** outside the three Next apps. `.env.example` placeholders
  only, never real values, never `.env*` committed.
- **Session-claims type — one home:** `packages/shared/auth` owns the shape. Each
  app's `types/globals.d.ts` augments Clerk's ambient
  `CustomJwtSessionClaims` by **importing** `Roles`/the shared type — never
  redeclaring the shape (config review [High]).
- **App import surface:** each app's `src/config/index.ts` re-exports
  `Roles`/`isAdmin` from `shared/auth` and the web provider/appearance from
  `web/auth`, so app code imports from `@/config` — matching the existing
  `packages-shared-config` → `@/config` pattern.
- **Docs — shared altitude primary:** `code/docs/shared/architecture/auth.md` is
  canonical (the contract is cross-platform); `code/docs/apps/web/config/auth.md`
  covers only Next middleware/gate wiring and links up (config review [Medium]).
- **Clerk dashboard is a named content home** for the unauthorized-sign-in email
  + page (like Sanity's carve-out). State locale parity: **English-only for
  phase 1**, revisit if multi-locale transactional email is needed.
- **Changelogs:** each app logs at its home altitude; the shared/auth + web/auth
  **bricks log once in `code/packages/CHANGELOG.md`** (config review [Low]).
- No hard-coded brand / URL / color — appearance from tokens; routes via
  `@/i18n/routing` (the Electron OS-protocol callback is correctly **not** a Next
  route and stays outside that rule).

## 9. Risks and validation

1. **Clerk on OpenNext / Cloudflare edge** — highest-priority gating unknown.
   Confirm `clerkMiddleware` verifies the JWT on the Workers runtime, and prove
   it **fails closed**. Runs in **Phase 0/1** (review [Low]) — depends on
   nothing in Phase 1.
2. **Electron deep-link credential binding** — confirm the custom-scheme return
   credential is single-use + client-bound under PKCE before building desktop
   social. OTP-only is the fallback.
3. **Free plan** — running on the Clerk free plan: one-click-revoke-from-email is
   unavailable (manual revoke only); confirm free-plan MAU limits and that a
   production instance is available. If Cloudflare Workers Logpush needs the
   Workers Paid plan, the audit sink falls back to the shared `workers` Worker →
   KV (free tier).
4. **Apple provider** — required for the iOS build; needs an Apple developer
   account + key. Blocks the mobile social milestone, not the web one.

## 10. Plan of record (phased)

> **Status (2026-08-21):** Phases 1–5 implemented and `tsc`-green (per-app), with the
> `shared/auth`, `web/auth`, and `url-guard` unit tests passing. Phase 0 (Clerk
> dashboard + keys) is the operator's step. The Electron social **completion**
> handshake and every runtime sign-in flow still need device/live-instance
> verification. Nothing committed yet.

0. Clerk dashboard + `.env.example` placeholders (no code). **Edge spike in
   parallel** — prove `clerkMiddleware` verifies + fails closed on Workers.
1. `packages/shared/auth` (DOM-free contract + `isAdmin` test) and
   `packages/web/auth` (provider + `authAppearance` + middleware helper).
2. Web wiring. **First** scaffold admin's i18n (`[locale]` +
   `i18n/{routing,request}.ts` + `messages/`) to match `website`/`app`. Then
   Clerk on `website`, `admin`, `app`. Admin: middleware gate **plus** data-layer
   `auth.protect()` in every action/handler/protected layout; sign-in-only.
3. Mobile wiring (Expo) — `expo-secure-store` token cache.
4. Hybrid wiring (Electron) — email OTP first, then PKCE-bound deep-link social
   with single-instance lock + strict inbound parse.
5. Admin privilege model — grant action (admin-gated, audited), session
   revocation on demotion, audit sink.
6. Docs + changelogs + `.env.example`.

## 11. Testing

- `isAdmin`: admin true; missing / malformed / **moderator** all false.
- Admin gate: unauthenticated and non-admin both redirect; admin passes.
- **Fail-closed edge**: gate denies when JWT verification / the maintenance read
  throws.
- **Data-layer authz**: a protected admin server action / route handler rejects a
  non-admin even with middleware bypassed.
- `url-guard` inbound-scheme test, including a **forged-callback** case.
- **Role revocation revokes sessions** (not just future tokens).
- Manual: one full sign-in per app per method before ship.

## 12. Deferred / acknowledged boundaries

- `/studio` protection relies on **Sanity auth**, not Clerk — not `/admin`-grade.
  Stated so no one assumes otherwise.
- Electron session token in the renderer is inherent to Clerk-React-in-Electron;
  CSP + sandbox are the compensating controls (§4.5).

## Issue tags

- `@debt SECURITY` — on the Clerk free plan, suspicious-login revoke is manual
  from the account UI (one-click-from-email is a paid feature); revisit on upgrade.
- `@debt SECURITY` — Electron renderer holds the session token (not httpOnly),
  unlike web. Accepted ceiling; mitigated by CSP + sandbox. ponytail: revisit if
  a main-process token broker becomes worth the complexity.
