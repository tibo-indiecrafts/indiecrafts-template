# Changelog — app surface (`@indiecrafts/web-surfaces-app`)

One record for the lean web surface (next-cf) — every change that alters behavior, a route,
config, or a convention lands here in plain language with the _why_.

**Not here:** shared-brick changes → [`code/packages/CHANGELOG.md`](../../../../packages/CHANGELOG.md);
docs-site → [`code/docs/CHANGELOG.md`](../../../../docs/CHANGELOG.md); the repo-wide roll-up →
[root `CHANGELOG.md`](../../../../../CHANGELOG.md).

Format follows [Keep a Changelog](https://keepachangelog.com). Categories:
**Added · Changed · Deprecated · Removed · Fixed**.

## [Unreleased]

### Fixed

- **A signed-out visitor can reach `/sign-up` again.** The proxy let only `/sign-in` through, so
  Clerk's "Sign up" link bounced back to sign-in, on the web and in the mobile shell. Nobody could
  create an account on the app, and its commercial-email checkbox never showed. `/sign-up` (with or
  without a locale) is now public, like the docs say; the `(app)` layout still guards the rest.

- **The not-found e2e journey runs again.** An unknown route already answered 404 with the
  branded page (the `[locale]/[...rest]` catch-all calls `notFound()`), but
  `e2e/journeys/not-found.spec.ts` still carried a stale `test.fixme`. It now asserts the 404
  status and the "Page not found" heading; with the Clerk keys set, it signs in first, because
  the proxy sends a signed-out visitor to `/sign-in`. New unit tests cover the catch-all, the
  proxy's signed-out redirect, and the `(app)` layout's server-side sign-in gate. **Why:** the
  gap was closed in code but not in the gate, so a regression to a soft 200 went unseen.

- **A skip link and a loading state.** A "Skip to main content" link is now the first tab stop on
  every page (the shared `SkipLink` from `packages-web-ui-components`, targets `#main`); the sign-in and sign-up pages gained the `#main`
  target they lacked. An `(app)` page shows a status spinner inside the shell while it loads
  (`(app)/loading.tsx`). Copy in en/fr. The existing `[locale]/error.tsx` stays the error boundary.
- **The shell's status bar reads on a dark app.** `NativeBridge` set the system style, so a dark app
  theme on a light phone got dark icons on the dark header (iOS, Android WebView 140+, where the page
  draws under the bar). The icons now follow `data-theme` and the theme toggle; an older Android
  WebView, padded below the bars, keeps the system style.
- **No Google button in the shell.** `NativeBridge` marks `<html>` with `data-native-shell`, and the
  Clerk appearance hides social sign-in there: the button opened Chrome, and the session landed there.
- **Clerk's sign-up links open the app's own page without an env var.** The layout passes
  `signUpPath="/sign-up"` to `AppClerkProvider`; `NEXT_PUBLIC_CLERK_SIGN_UP_URL` is gone from
  `.env.example` (a CI deploy never had it).
- **The consent sheet's link says where it goes.** "Learn more" → "Read the cookie policy" (fr: "Lire
  la politique cookies"), same as the website banner.
- **A deploy without the Clerk key is refused.** The `(app)` gate is opt-in on the key, so a
  keyless build is public. That stays for local dev and keyless e2e; the deploy is the closed
  side: registry `requiredEnv` makes `deploy/next.mjs` refuse `app` and `admin` without
  `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`. CI's `deploy-app.yml` now passes it from the GitHub
  Environment variable. **Why:** CI never passed the key, so a CI deploy shipped an open app
  (and a locked admin).

- **No Clerk error on a stray path.** A request the proxy skips (seen live: the mobile shell's
  `/favicon.ico`) reached the `(app)` layout as a fake locale, whose `auth()` threw "can't detect
  clerkMiddleware()". The layout now 404s a non-locale path first.
- **Cookie decisions are logged, like on the website.** The app saved the banner and Privacy-tab
  choices locally only — a signed-in user had no `consent_events` proof. New `/api/consent-log`
  (signed-in only; matched by the proxy so `auth()` has the session) + `reportConsent` on accept,
  reject, save, the geo auto-seed and the Privacy tab. The banner's "saved" toast now opens the
  Privacy tab (`/account#/privacy`), not the account profile.
- **The cookie banner links the cookie policy.** "Learn more" (`consent.learnMore`, en/fr) opens the
  website's cookie policy for the page locale (`legalUrl`) — the app re-hosts no legal content.
- **The account page has email preferences and fits the screen.** The app had no category-level
  email centre; it now has the account widget's **Emails** tab (`account.emailPreferences` +
  `account.tabs.emails`, en/fr). The widget is centred, and `AppShell`'s `main` gets `min-w-0`:
  at 768 px Clerk's card pushed the page 256 px wider than the screen.
- **The deployed app calls the deployed api.** Its build baked `.env.local`'s
  `localhost` `NEXT_PUBLIC_API_URL` / `NEXT_PUBLIC_WEBSITE_URL`. `wrangler.toml` now sets them per env
  (`[env.dev.vars]`, `[env.staging.vars]`) and the deploy bakes them. Prod gets the api from the
  domain registry; set `NEXT_PUBLIC_WEBSITE_URL` under `[env.prod.vars]` once the website has its
  host — until then a prod deploy refuses to build.
- **404 and error screens, branded.** The app had none: an unknown URL fell through to the root
  not-found, outside `[locale]`, where the passthrough root layout has no `<html>` — a dev runtime
  error, Next's bare 404 in production (also in the mobile shell). Now `[locale]/[...rest]` →
  `[locale]/not-found`, plus `[locale]/error`: both show the Sanity-configured logo (`getBrand`)
  and bundled en/fr copy. The welcome and the logo share one cached, fail-open reader
  (`liveQuery`).
- **Legal acceptance reaches your other surfaces even if the first write was lost.** `LegalGate`
  reconciles with the server on every signed-in load (`syncLegalConsent`) and re-sends an
  acceptance made here that never landed.
- **The header no longer hides under the iOS status bar.** In the iOS shell the WebView runs
  edge to edge: the sidebar button sat on the clock row, the locale and theme toggles on the
  Wi-Fi and battery icons. The app now sets `viewport-fit=cover`, and the header pads by
  `env(safe-area-inset-top)` (0 in a browser). Checked in the iOS simulator.
- **The announcement banner has an accessible name.** It is a `region` landmark, but the app
  passed no label, so screen readers listed an unnamed region. It now reads "Announcement" /
  "Annonce" (`announcement.region`).

- **Server calls reach the api on deployed envs.** Same-zone Worker-to-Worker fetches fail with
  Cloudflare error 1042; the `global_fetch_strictly_public` compatibility flag sends them over the
  public internet, as `API_URL` already assumed.
- **The api rate-limits sign-in logs per visitor.** `/api/session-log` sends the visitor IP
  (`x-client-ip`), so the api keys its limit on the visitor, not the app server.
- **Sign-ins are logged again on the app (and the mobile shell, which loads it).** `/api/session-log` calls Clerk's `auth()`, but the
  proxy matcher skipped every `/api` path, so Clerk's middleware never ran and each log was a 500. The
  matcher now lists `/api/session-log` and the proxy passes `/api` straight through (no sign-in
  redirect, no locale rewrite) — the same pattern as the website.

### Changed

- **The announcement bar and card sit under the navbar.** `AnnouncementChrome` moved from the
  root layout (above the whole shell) into `AppShell`, right under the app header. On a phone the
  card is a bottom sheet. Checked in the Android shell.
- **Cloudflare observability is fully on.** Traces (10% sampled) and Issues (grouped production
  errors) join the Workers Logs in the top-level `wrangler.toml` `[observability]` block, which every
  env inherits. Wrangler is pinned to 4.143.0 (Issues needs ≥ 4.134). A test fails if a part is off.
- **Server errors reach Workers Logs.** The app logs through the shared logger, which is silent
  in production, so a `logger.error` was lost. `src/instrumentation.ts` now adds the Cloudflare
  transport in production, like the website.
- **Signing in re-checks the legal acceptance.** `SignedInLegalGate` keys the gate on the user id.
  Sign-in is a client-side navigation, so the gate stayed mounted and never re-read the server
  record: a user who accepted on another surface saw the banner until a reload.

- **Overlays take turns.** `ConsentGate` and `LegalGate` use `useOverlayTurn` (the consent banner
  first); `LegalGate` no longer reads the consent record itself. Confirmation toasts sit at the top
  (`<Toaster position="top-center" />`), clear of the bottom overlays.

### Fixed

- **The legal banner no longer comes back after Accept.** `useRecord` read `localStorage` during
  hydration, so the server-rendered banner stayed on screen (React 19 keeps unmatched server DOM).
  The gates now render nothing until the browser has read the record. **Why:** found in the
  legal-banner browser QA.
- **An early Accept no longer records a stale version.** The banner waited for nothing, so an
  Accept before the website's live version arrived stored the static `policyVersion`, and the
  banner came back on the next load. It now shows once the version fetch settles
  (`useEffectiveLegalVersion`, moved to `overlays/stores.ts`).
- **Cross-surface legal sync works in production.** The CSP `connect-src` now allows the website
  and the api Worker (`src/lib/csp-hosts.ts`); before, only `'self'` was allowed outside dev, so
  `/api/legal-version` and `/v1/consent/legal` were blocked. `NEXT_PUBLIC_WEBSITE_URL` is now in
  `.env.example`.

### Added

- **`NativeBridge`** — the one component that wires the Capacitor shell's native events (Android back,
  deep links, system-browser links, status bar, splash). A no-op in a browser; the link and deep-link
  rules are pure, tested helpers (`src/lib/shell-links.ts`). **Why:** the mobile app is now this surface
  inside a Capacitor shell ([mobile shell](../../../../docs/projects/mobile/main/index.md)).

### Added

- **Home welcome from Sanity.** The home now reads an editor-owned welcome message live from the
  `appContent` Sanity singleton (the `web` section, falling back to `shared`), resolved to the request
  locale, via `src/lib/welcome.ts` — a short-cached (60s), **fail-open** edge read (unset project id or
  any error → the home shows its own `app.subtitle` message instead, never a broken page). New public env
  `NEXT_PUBLIC_SANITY_PROJECT_ID` + `NEXT_PUBLIC_SANITY_DATASET` (same Sanity project as the website).
  **Why:** let an editor change the home welcome without a redeploy — the surface's first Sanity read.

### Changed

- **`ShellOverlays` split into a thin composition root + `overlays/`.** The 163-line component inlined
  three concerns; it's now `user-interface/overlays/{stores,ConsentGate,LegalGate}.tsx` with
  `ShellOverlays.tsx` just mounting `<ConsentGate/> <LegalGate/> <UpdatePrompt/>`. Behavior + the export
  (imported by `[locale]/layout`) are unchanged; each overlay is now independently readable. **Why:** three
  responsibilities in one file — the consent banner + geo-seed, the legal re-acceptance gate, and the
  version prompt — each belongs in its own unit.
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
