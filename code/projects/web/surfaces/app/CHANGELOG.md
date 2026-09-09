# Changelog — app surface (`@indiecrafts/web-surfaces-app`)

One record for the lean web surface (next-cf) — every change that alters behavior, a route,
config, or a convention lands here in plain language with the _why_.

**Not here:** shared-brick changes → [`code/packages/CHANGELOG.md`](../../../../packages/CHANGELOG.md);
docs-site → [`code/docs/CHANGELOG.md`](../../../../docs/CHANGELOG.md); the repo-wide roll-up →
[root `CHANGELOG.md`](../../../../../CHANGELOG.md).

Format follows [Keep a Changelog](https://keepachangelog.com). Categories:
**Added · Changed · Deprecated · Removed · Fixed**.

## [Unreleased]

### Changed

- **Clerk UI localized + self-hosted `/sign-up`.** `<ClerkProvider>` gets the active locale (the provider
  moved into `[locale]/layout.tsx`) so Clerk's UI renders in the visitor's language; a new `/sign-up`
  route renders `<SignUp>` carrying `unsafeMetadata.locale` (set `NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up`).
  **Why:** localized auth UI + emails.
- **Unified account, embedded in the `/account` page.** `/account` renders Clerk's
  `<UserProfile>` inline with two custom tabs — "Privacy & consent" (cookie choices) and "Your
  data" (export + deletion) — via `@indiecrafts/packages-web-auth/account`, shared with the
  website. It is reached from the main sidebar nav; the footer `NavUser` is Legal + Sign out
  (Clerk's embedded profile has no everyday sign-out). Removed the old `AccountDeletePanel` +
  `CookiePreferencesSection` (and their tests). **Why:** one shared account UI, presented per
  surface — embedded here, a modal on the website — with less bespoke UI to maintain.

### Added

- **Route-handler test coverage.** `route.test.ts` beside each API handler
  (`version`, `session-log`, `csp-report`) asserts real behavior — the version payload +
  cache header, the session-log 401/default-surface/forwarded-surface paths (Clerk `auth` +
  `logSession` mocked), and the csp-report route's forwarding shape (mocked
  `handleCspReport`, called with `{ surface: "app" }`). **Why:** the app surface had no test
  coverage for its API routes; this closes that gap using the RTL setup already established in
  `code/packages/web/compliance`.
- **Self-service account delete now triggers Clerk step-up reverification.**
  `AccountDeletePanel` wraps the erasure fetch (`rawErasureFetch`) in Clerk's
  `useReverification`, so a stale first factor (the worker's `fva` gate, >10
  minutes) opens the reverification modal and auto-retries on success. The
  post-reverification retry mints its token with `{ skipCache: true }`: a
  cached (~60s) token still carries the stale `fva` and would re-trip the
  server gate, silently defeating the step-up.
- **Consent/legal confirmation toast.** `<Toaster>` moved from `AppShell` to `[locale]/layout.tsx`
  so it covers every page, including `sign-in` outside the `(app)` group. `ConsentGate` and
  `LegalGate` (`ShellOverlays.tsx`) fire `showConsentSavedToast` on an explicit consent choice
  (accept/reject/save) and legal re-acceptance — Manage routes to `/account`. The geo auto-seed
  effect stays silent.
- **Cookie preferences on `/account`.** New `CookiePreferencesSection` wraps the shared
  `ConsentPreferences` toggle list, reading/writing the same `consentStore` key `ShellOverlays`
  uses, so the toast's Manage action points to a real control.
- **Offline banner.** Mounts the shared `OfflineBanner` (self-detecting, `useOnlineStatus`) from
  `@indiecrafts/packages-shared-system-pages/web` at the top of `[locale]/layout.tsx`, above the fold.
  New `offline.banner` message key (en + fr), mirroring the website's wording. **Why:** losing the
  network was a silent failure on this surface; now the visitor is told, without blocking the page.

### Changed

- **Account copy assembled via the shared `compliance` builders.** `account/page.tsx` now calls
  `buildDeleteAccountCopy`/`buildExportCopy` (`@indiecrafts/packages-shared-compliance/web`) instead of
  hand-assembling the `DeleteAccountCopy`/`ExportCopy` objects field-by-field. **Why:** the field list now
  lives in one place, shared with website, mobile, and hybrid.

### Fixed

- **`tsc` could not resolve the security packages (broke `pnpm verify`).** `src/proxy.ts` and the
  `csp-report` route import `@indiecrafts/packages-shared-security` and
  `@indiecrafts/packages-web-security-reports/handle`, but `tsconfig.json` lacked the matching
  `paths` entries (added on the website during the CSP-report work, never here). Added them, so
  the app type-checks again.

### Added

- **shadcn sidebar shell — Home, Account, Legal restyled; vitest wired.** New
  `src/user-interface/layout/` shell (`AppShell` → `AppSidebar` + `SidebarInset`/`AppHeader`) wraps
  every `(app)` route: a flat nav (Home, Account) from `src/user-interface/lib/nav.ts`, a no-flash
  light/dark `ThemeToggle` (persists to `localStorage` as `app-theme`), a `LocaleSwitcher`, and
  `NavUser` (the sidebar footer menu: Legal + Sign out). `sign-in` stays outside the `(app)` group,
  unshelled. Home, Account, and Legal now use the shared `PageHeader` + shadcn `Card` treatment.
  New `lucide-react` dep. Also wires `vitest` (the app had no test runner before), with
  `nav.test.ts` covering `activeKey` and `messages.test.ts` checking en/fr key parity. Components
  are app-owned — **no Storybook**. **Why:** brings the app surface to the same visual bar as
  `website`/`admin`, with its nav logic under test.
- **Share this page — a share row on the home screen.** `src/app/[locale]/page.tsx` mounts the shared
  `ShareButtons` (`@indiecrafts/packages-web-ui-components/web/layout/ShareButtons`) with no `url`, so
  it resolves the current page URL client-side. Adds the `ui-components`/`ui-icons` deps + `transpilePackages`
  + tsconfig `paths`, and new `share.*` copy (`messages/{en,fr}.json`). **Why:** parity with the website's
  site-wide share (share on all surfaces except admin).
- **Proxy-set, per-request nonce CSP — `CSP_MODE`.** `src/proxy.ts` generates one nonce per request
  (`generateNonce`) and stamps the response with `cspHeadersForMode(...)`
  (`@indiecrafts/packages-shared-security`): `CSP_MODE=enforce` ships the strict nonce `script-src`
  (`'nonce-…' 'strict-dynamic'`) as the enforced policy; the default `CSP_MODE=report-only` keeps the
  existing permissive policy enforced and ships the strict policy as
  `Content-Security-Policy-Report-Only` so violations surface first. The nonce reaches the root layout's
  `AppClerkProvider` via the `x-nonce` request header. `next.config.ts` drops the static
  `Content-Security-Policy` from `headers()` (`cspMode: "proxy"`) since the proxy now owns it. **Why:**
  a static `'unsafe-inline'` CSP can't stop inline-script injection; a per-request nonce can, and
  `CSP_MODE` lets us observe violations in report-only before enforcing, with a same-env kill switch
  back to report-only if enforcement ever breaks sign-in. See
  `code/docs/apps/web/seo/security-headers.md`.
- **Security headers + CSP violation reporting — the first `securityHeaders()` call on app.**
  `next.config.ts` gains an `async headers()` (app shipped none before): the shared
  `securityHeaders({...})` brick from `@indiecrafts/packages-shared-security`, with a `reporting`
  option pointing at a new same-origin `/api/csp-report` route. The enforced CSP gains a
  `Reporting-Endpoints` header, and a `Content-Security-Policy-Report-Only` candidate ships
  alongside it that drops the blanket `https:` from `img-src` (`reportOnly: { dropSources:
["https:"] }`), so we learn the real image allowlist before enforcing it. App loads no
  third-party media, so no extra CSP hosts are declared. The route is a one-line delegate to
  `handleCspReport` from `@indiecrafts/packages-web-security-reports` (mirrors admin's route),
  reachable without a session — the proxy matcher already excludes `/api/*`. New
  `packages-shared-security` + `packages-web-security-reports` deps/transpile. **Why:** app had
  no security headers at all; this closes that gap and gives us observability into what the CSP
  would block before tightening it.
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

### Changed

- **CSP now ENFORCED by default (`CSP_MODE` default flipped from `report-only` to `enforce`); set
  `CSP_MODE=report-only` to roll back.** `src/proxy.ts`'s `CSP_MODE` fallback flips: env unset now
  resolves to `enforce` instead of `report-only`. **Why:** the strict nonce CSP shipped observe-only
  since SP3; the strict policy now graduates to actually blocking inline-script injection instead of
  just reporting it.
- **Self-service "Delete my account" page.** `/[locale]/account` renders the shared
  `DeleteAccountSection` (`@indiecrafts/packages-shared-compliance/web`) via a new
  `AccountDeletePanel` client wrapper (Clerk `getToken`/`signOut`, routes home on success). Gated
  by the new `features.deleteAccount` flag **and** by Clerk **and** `NEXT_PUBLIC_API_URL` being
  configured — any one missing 404s the route. New `messages.account.delete.*` copy. **Why:** lets
  a signed-in visitor exercise GDPR erasure without contacting support, posting the shared api's
  authenticated `POST /v1/erasure/self`.
- **Self-service "Download my data" control.** `/[locale]/account` now also mounts the shared
  `ExportSection` (`@indiecrafts/packages-shared-compliance/web`) beside `DeleteAccountSection` in
  `AccountDeletePanel`, posting the authenticated `POST /v1/export` to the shared api worker and
  opening the returned single-use, 1-hour-expiring download link in a new tab. New
  `features.exportAccount` flag (gates just the control's render — the page's own visibility still
  follows `features.deleteAccount`); new `messages.account.export.*` copy. **Why:** GDPR data
  portability alongside the existing erasure control, on the same authenticated page.
