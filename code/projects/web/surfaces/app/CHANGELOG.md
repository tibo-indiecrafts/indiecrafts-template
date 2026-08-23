# Changelog — app surface (`@indiecrafts/web-surfaces-app`)

One record for the lean web surface (next-cf) — every change that alters behavior, a route,
config, or a convention lands here in plain language with the _why_.

**Not here:** shared-brick changes → [`code/packages/CHANGELOG.md`](../../../../packages/CHANGELOG.md);
docs-site → [`code/docs/CHANGELOG.md`](../../../../docs/CHANGELOG.md); the repo-wide roll-up →
[root `CHANGELOG.md`](../../../../../CHANGELOG.md).

Format follows [Keep a Changelog](https://keepachangelog.com). Categories:
**Added · Changed · Deprecated · Removed · Fixed**.

## [Unreleased]

### Added

- **Geo-targeted cookie consent.** `[locale]/layout` reads `cf-ipcountry` server-side → the
  `ConsentGate` in `ShellOverlays` shows the opt-in banner only for opt-in regions; opt-out/none
  auto-seed the consent record (honouring GPC) with no blocking banner. Per-country/regulation config
  in `src/config` (`consent: ConsentConfig`). **Why:** each visitor sees the consent regime their
  country requires. Design → `code/docs/apps/web/config/cookie-consent-geo.md`.
- **Logged-in announcements (banner + toast).** `AnnouncementChrome` (mounted in `[locale]/layout`,
  gated on the Clerk key) fetches the shared api Worker's public `/v1/announcements` for `surface=app`
  ONLY when signed in, and renders the shared `AnnouncementBar` + `AnnouncementToast`. New
  `NEXT_PUBLIC_API_URL` (the Worker origin) + `messages.announcement.*` (dismiss/copy labels) +
  `packages-{shared,web}-announcement` + `web-i18n` deps/transpile (+ a `tsconfig paths` entry for the
  `web-announcement` `./*` export). **Why:** editor announcements now reach the app, logged-in only.
- **Clerk auth wired (opt-in) + sign-in route.** `AppClerkProvider` in the root layout, `clerkMiddleware`
  in `proxy.ts` (key-gated), the shared `<SignInView>` at `/[locale]/sign-in/[[...sign-in]]`, the
  session-claims type from `@indiecrafts/packages-shared-auth`, and `.env.example` keys. Uses the **same
  Clerk application + publishable key as the website** (one user base, one admin role). Login is available;
  no gate. **Why:** the app surface joins the shared, opt-in auth.
- **Session logging.** `SessionLogger` + a `/api/session-log` route forward each sign-in to the audit api
  (EU D1), surface `"app"`. Needs `API_URL` + `APP_API_TOKEN` (server-only, see `.env.example`).
