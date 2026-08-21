# Clerk sign-in UX + redirects — design (addendum)

- **Date:** 2026-08-21
- **Status:** Implemented + `tsc`-green per surface (`web/auth` redirect test 7/7); runtime/device
  verification pending. Builds on `2026-08-21-clerk-auth-multi-app-design.md`.
- **Scope:** replace the custom sign-in forms with Clerk's components on the web
  surfaces, add correct per-app redirects, tidy mobile. Website · app · admin ·
  hybrid · mobile.

## 1. Goal

A polished, consistent sign-in (Clerk's prebuilt UI + a header button) and
redirects that always land the user on the **right surface** — without hard-coded
URLs and without an open-redirect hole.

## 2. Decisions (resolved with the requester)

| Question | Decision |
| --- | --- |
| Sign-in screen location | **Per-app** — each surface owns its `/sign-in` |
| Default landing (no `redirect_url`) | **Each surface's own homepage** (`fallbackRedirectUrl = "/"`) |
| Redirect config home | **Code / `@/config`** only — not Sanity |
| Surfaces | website · app · hybrid · mobile (admin already done) |
| Session sharing | **Subdomains** (cookie on `.root`, automatic, free) |

**Session vs sign-in page are separate.** One shared *session* (sign in once,
recognized on every subdomain) comes free from the subdomain cookie. The sign-in
*page* is per-app. Satellite domains (paid) are the only-if-different-roots
alternative — noted, not built.

## 3. Design

### 3.1 Session sharing — subdomains (operator config)

Website at the root (`acme.com`), the others at subdomains
(`admin.acme.com`, `app.acme.com`). Clerk sets the session cookie on `.acme.com`,
so all subdomains share it — arriving already-signed-in is the norm. The operator
sets the hosts in the `domains` registry (`code/shared/scripts/lib/domains.mjs`);
no code change. Different root domains would need Clerk **satellite domains** (a
paid feature) — out of scope.

### 3.2 Shared web sign-in — `packages/web/auth`

- `<SignInView>` — wraps Clerk `<SignIn>` with `authAppearance()` + the resolved
  redirect props. The one sign-in surface the web apps render.
- Re-export `<SignInButton>` (header, signed-out) + `<UserButton>` (signed-in).
- `resolveSignInRedirect(searchParams, homePath)` — the **validated** redirect
  resolver, precedence: `forceRedirectUrl` (none by default) → `redirect_url`
  **only if same-origin / a relative path** → `fallbackRedirectUrl = homePath`.
  An absolute or cross-origin `redirect_url` is dropped (open-redirect guard).

### 3.3 Per-app redirect config

Each app's `@/config` exposes its post-sign-in home path (default `"/"`), so the
target is config, never a hard-coded literal. `<SignInView>` reads it.

### 3.4 Per surface

- **Website** — new `/[locale]/sign-in/[[...sign-in]]` rendering `<SignInView>`;
  header shows `<SignInButton>` / `<UserButton>`. `fallbackRedirectUrl = "/"`,
  honors a validated `redirect_url`. Login optional (no gate).
- **App** — wire the provider (currently deferred) + the same sign-in route.
- **Admin** — already `<SignIn>`; align it to `<SignInView>` + the resolver. The
  gate keeps redirecting non-admins to admin's own `/sign-in?redirect_url=…`.
- **Hybrid** — **replace the custom OTP form with Clerk `<SignIn>`** (email UI).
  Caveat: `<SignIn>`'s social buttons do a full-page redirect Electron blocks, so
  **email via `<SignIn>`, Google stays the deep-link button**. Net: less custom code.
- **Mobile** — stays native (RN has no `<SignIn>`); tidy the screen's layout /
  states. Same instance; no satellite.

## 4. Security

- `redirect_url` is validated to a same-origin relative path before use — no
  open redirect. This lives in `resolveSignInRedirect`, one home.
- No redirect config in Sanity (an editor-set absolute URL would be an open
  redirect). Keys + any origin allowlist stay in code/env.

## 5. Plan (phased)

1. `web/auth`: `<SignInView>` + `<SignInButton>`/`<UserButton>` + `resolveSignInRedirect` (+ a test for the validator).
2. `@/config`: per-app sign-in home path (website · app · admin).
3. Website: sign-in route + header buttons + redirect wiring + messages.
4. App: provider + sign-in route.
5. Admin: swap its inline `<SignIn>` for `<SignInView>`.
6. Hybrid: custom OTP → `<SignIn>`; keep the Google deep-link.
7. Mobile: sign-in screen UX tidy.
8. Docs + changelogs: subdomain session-sharing note (+ satellite as the paid alternative).

## 6. Testing

- `resolveSignInRedirect`: same-origin relative → kept; absolute / cross-origin /
  protocol-relative (`//evil`) → dropped to home; force overrides.
- Manual: sign in on each web surface, confirm the landing surface + a
  `redirect_url` round-trip.

## Issue tags

- `@debt SECURITY` — cross-different-root session sharing needs Clerk satellite
  domains (paid); subdomains are the free path this design assumes.
