# Changelog — admin app (`@indiecrafts/web-surfaces-admin`)

One record for the internal admin dashboard (next-cf) — every change that alters behavior, a
route, config, or a convention lands here in plain language with the _why_.

**Not here:** shared-brick changes → [`code/packages/CHANGELOG.md`](../../../../packages/CHANGELOG.md);
docs-site → [`code/docs/CHANGELOG.md`](../../../../docs/CHANGELOG.md); the repo-wide roll-up →
[root `CHANGELOG.md`](../../../../../CHANGELOG.md).

Format follows [Keep a Changelog](https://keepachangelog.com). Categories:
**Added · Changed · Deprecated · Removed · Fixed**.

## [Unreleased]

### Fixed

- **Prod admin has no `workers.dev` URL.** Cloudflare Access fronts the admin's custom host only,
  so `<worker>.workers.dev` and preview URLs reached the Worker without it (Clerk only). Prod sets
  `workers_dev = false` and `preview_urls = false`; `wrangler-parity.test.mjs` fails for any env
  whose tfvars attach a real host without them. **Why:** QA card 41.

### Added

- **Access allow-list by email (`access_emails`).** The Zero Trust Access policy took only an email
  domain; it now also takes a list of addresses. Staging and prod list the operator and drop the
  `your-company.com` placeholder. An attached host with no email and no domain fails the plan, so
  the gate can never ship open by mistake. **Why:** QA card 41.
- **Admin e2e and more unit tests.** `pnpm --filter @indiecrafts/web-surfaces-admin e2e` runs
  Playwright journeys against a built admin on port 3012 (`playwright.config.ts`,
  `e2e/journeys/`). `gate.spec.ts` needs no credentials: signed out, every dashboard route lands
  on sign-in without the dashboard shell, sign-in renders, and the CSP sink answers 204/415/413.
  `sign-in.spec.ts` (Clerk Testing Tokens) self-skips until the Clerk test keys are set. New
  vitest suites cover the CSP and session-log routes (status codes through the real handler), the
  churn/sessions/security/system pages (bearer, empty and error states), and the shared
  `requireAdminPage` check (`src/lib/require-admin.ts`). Why: the gate is the admin's one
  security boundary, and it had no browser test.
- **Loading and error states inside the shell, and a skip link.** A dashboard page now shows a
  status spinner while it loads (`(dashboard)/loading.tsx`). A failed page shows a short message
  and a Retry button (`(dashboard)/error.tsx`), with the sidebar still usable; before, Next's
  bare error screen replaced the whole dashboard. A "Skip to main content" link is the first tab
  stop on every page (the shared `SkipLink` from `packages-web-ui-components`, targets `#main`). Copy in en/fr.
- **Language switcher in the header.** The first visit follows the browser language; an operator
  can now correct it next to the theme toggle (`LocaleSwitcher`, as in the app). The choice is
  kept in the locale cookie and the operator's Clerk profile.
- **See a user's consent in Users.** Each row has a "Consent" link opening a side sheet: the current
  state (cookie categories, commercial emails, each email category, legal terms) and the dated history
  (surface, source, country, policy version), en/fr. Each view is audited (`admin.view_consent`) —
  looking at a person's consent history is itself an access to personal data.
- **Sessions show who signed in.** Each sign-in row shows the user's email in its own column, next to the Clerk id. The
  page resolves the ids live from Clerk in one call (`src/lib/clerk-users.ts`); D1 still stores only
  the id. On a Clerk error the email cell shows a dash.
- **A test user to sign out.** `code/shared/scripts/data/qa-session-user.mjs` creates a
  development-only Clerk user with live sessions and feed rows, so the Sessions revoke actions can be
  tested on demand. `--delete` removes it.

### Changed

- **The churn page reads the reason codes from `@indiecrafts/packages-shared-compliance/shared`.** Its
  own `REASON_CODES` copy is gone; the admin now depends on the package (`transpilePackages` too).
  **Why:** a code added to `CHURN_REASON_CODES` now gets its label here instead of reading as "unknown".

### Removed

- **"Revoke admin" is gone from the dashboard.** The Overview form only grants the role; the
  `revokeAdmin` action and its `admin.revoke` audit event are removed. Demote in the Clerk Dashboard
  (Users → user → Public metadata), so the dashboard can never lock out its own admins.

### Fixed

- **Security: every dashboard page checks the admin session before it reads data.** Before, only
  the `(dashboard)` layout checked. Next skips a layout the client already has (partial
  rendering), so a crafted navigation request could render a page — churn, sessions, security,
  system and the rest — without the check. The proxy still blocked it when Clerk was configured,
  but not with Clerk unconfigured or a middleware bypass (the case the layout exists for). The
  layout and all 12 pages now call one shared `requireAdminPage` (`src/lib/require-admin.ts`),
  which fails closed. `page-gate.test.ts` fails when a page does not call it.

- **`/api/session-log` sends the visitor IP.** The api rate-limits per visitor; without the IP
  every admin shared the admin server's limit. The app and website routes already sent it. The
  `session-log` and `csp-report` routes now have tests.

- **Admin pages have a document title.** No admin page set a `<title>`: the browser tab showed
  the URL and Lighthouse accessibility scored 96. The locale layout now titles every page
  `<page> · Admin` (`Admin` when a page sets none); the security page sets its own.
- **The security feed speaks the admin's language.** Event types and severities showed as raw
  codes (`credential_stuffing`, `high`) in both locales. They now read from
  `admin.security.types` / `severities` (en/fr); an unknown code still shows as is.
- **"Sign out everywhere" signs out every device.** It tries every session, audits a partial run,
  and writes no row when nothing was revoked. It reads up to 500 sessions — Clerk's default page of
  10 left an 11th device signed in while the action reported success. A malformed session id now
  returns `invalid_session`, not `invalid_user`.
- **Times and sizes follow the admin locale.** The sessions, security, users, backups, erasure and
  cron screens printed raw ISO strings or `toLocaleString` output (the server's locale and the
  browser's zone, so client tables mismatched on hydration). They now use the next-intl formatter
  in UTC; backup sizes read "1,5 ko" in fr.
- **"Sign out everywhere" confirms itself.** The result showed inside the expanded row, so with the
  row collapsed the operator saw nothing. Session revokes now report with a toast.

- **Server calls reach the api on deployed envs.** Same-zone Worker-to-Worker fetches fail with
  Cloudflare error 1042; the `global_fetch_strictly_public` compatibility flag sends them over the
  public internet, as `API_URL` already assumed.
- **CSP reports show "last seen" in the operator's locale.** The column printed the raw ISO
  timestamp; it now uses the locale date and time format (UTC), like the data-request pages.
- **Per-env origins are `wrangler.toml` vars.** `API_URL`, `WEBSITE_URL` and `APP_URL` are set
  for dev and staging (prod commented). The deploy's secret sync had pushed their local
  `localhost` values as secrets; it now skips keys set as vars.

- **Data requests screen is exact.** A failed api read now shows an error alert instead of "No data
  requests recorded yet". The right and the status read as words (en/fr), not raw keys. The email is
  a `mailto:` reply link. A long message opens to its full text (before, only 80 characters showed).
  Dates format in the admin locale, in UTC (`timeZone: "UTC"` in `i18n/request.ts`). The fetch moved to
  `fetchDataRequests` in `lib/monitoring.ts`, which reuses `getApi` (timeout + retry).

- **Sign-ins are logged again on the admin.** `/api/session-log` calls Clerk's `auth()`, but the
  proxy matcher skipped every `/api` path, so Clerk's middleware never ran and each log was a 500. The
  matcher now lists `/api/session-log` and the proxy passes `/api` straight through (no sign-in
  redirect, no locale rewrite) — the same pattern as the website.

### Added

- **The requester's message leads the data-request sheet.** It shows first, as a highlighted
  quote ("Requester's message" / "Message du demandeur"), with a clear line when there is none;
  the list shows its excerpt in full contrast instead of muted grey.

- **Data-request side sheet with actions.** The right in each row opens a sheet (`?id=<n>`,
  also the owner alert's link): full request, due date (Overdue flag, also as a list column),
  history, and the moves the status allows — Start, Mark done, Reject. Closing opens a reply
  prefilled in the **requester's** language that can be emailed; an unsent email is shown. Each
  move is an admin-checked, audited server action (`admin.data_request_status`).

- **System shows the api's version, both D1s and its bindings.** The api row carries its version and
  commit; Databases lists `audit` and `main` (it showed one D1 and never checked `main`); a line lists
  the KV, export bucket, cron link and rate limiter. en + fr.
- **Every call to the api goes through `apiFetch`** — a 10 s timeout, one retry for reads and for the
  idempotent writes (events, settings); the other actions (cron run, erasure retry/close) time out but
  never retry, so they cannot act twice.

### Added

- **Retry, Close manually, Run now.** Erasure requests gets Retry on a stuck request (asks for the
  subject's email only when the api can't read it from Clerk) and Close manually with a required note;
  Scheduled jobs gets Run now. Each is a server action that re-checks the admin role and writes an
  audit event (`admin.erasure_retry` / `admin.erasure_close` / `admin.cron_run`).
- **System shows the background-jobs Worker's health.** The `workers` row said "no endpoint", but the
  Worker serves `/health` (the deploy smoke check uses it). It is now probed like the api from
  `WORKERS_URL` (unset → "Not configured"), without the api token — only the api gets the bearer.
- **Scheduled jobs page (`/cron`)** — cron health (healthy · last run failed · stale · never ran), the
  live erasure/export counts, and the last 24 runs with per-pass results. Before, nothing showed
  whether the cron ran at all.
- **Erasure requests page (`/erasure`)** — open GDPR erasure requests by deadline (deadline passed ·
  due soon · on track) and the recently closed ones, so the one-month deadline can be verified
  directly instead of inferred from security events.
- **System page** — the `cron` row shows the same health badge and links to Scheduled jobs (it said
  "no endpoint").

### Fixed

- **Erasure row actions work by keyboard and screen reader.** Each Retry / Close button names its
  request, the email field takes focus when it appears, and Enter in it retries.
- **Clear messages for new api answers** — the request changed during the retry (`changed`), the cron
  did not answer (`cron_unreachable`).
- **Run now is audited even when the api is unreachable**, like Retry and Close — every authorized
  attempt leaves a record.

### Changed

- **Cloudflare observability is fully on.** Traces (10% sampled) and Issues (grouped production
  errors) join the Workers Logs in the top-level `wrangler.toml` `[observability]` block, which every
  env inherits. Wrangler is pinned to 4.143.0 (Issues needs ≥ 4.134). A test fails if a part is off.
- **`.env.example` documents `CLOUDFLARE_SECURITY_URL`** — the Security screen's deep link to the
  zone's Cloudflare events, read by the screen but listed nowhere.
- **Confirmation toasts sit at the top** (`<Toaster position="top-center" />`), like the website
  and the app — the bottom slot belongs to the fixed overlays.
### Added

- **Churn dashboard.** A new `/churn` page reads the api's `GET /v1/churn` (bearer-gated) and renders
  a total count, a by-reason table, a by-day table, and the 50 most recent feedback rows. Added to
  the sidebar nav. **Why:** an operator view onto why self-service users are leaving.

### Changed

- **Clerk sign-in UI localized.** `<ClerkProvider>` now receives the active locale (the provider moved
  into `[locale]/layout.tsx`, passing `@clerk/localizations`), so admin's sign-in renders in the
  visitor's language.

### Fixed

- **The `DashboardLayout` admin gate now fails closed when Clerk is unconfigured.** It previously ran
  the auth check only `if (NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY)` and rendered the admin **open** when the
  key was unset — so a deploy that forgot to configure Clerk exposed the dashboard shell. It now
  redirects to sign-in when the key is absent (the crown-jewel server actions already failed closed
  regardless). Configure Clerk before shipping admin, as before — but a misconfiguration is now locked,
  not exposed.

- **`tsc` could not resolve the security packages (broke `pnpm verify`).** `src/proxy.ts` and the
  `csp-report` route import `@indiecrafts/packages-shared-security` and
  `@indiecrafts/packages-web-security-reports/handle`, but `tsconfig.json` had no `paths` entries
  for them. Added them — the brief already described these bricks as wired, and now they are.

### Added

- **Test coverage for the privilege-escalation surface (was 0 tests on the real logic).**
  `(dashboard)/actions.test.ts` covers `grantAdmin`/`revokeAdmin`/`revokeSession`/
  `revokeUserSessions`/`saveSetting`: a non-admin or no-session caller is rejected with no
  Clerk write, no `fetch`, and no `audit` row; a malformed `user_…`/`sess_…` id is rejected
  the same way; an admin caller's happy path forwards the right args and audits. New
  `(dashboard)/layout.test.ts` asserts `DashboardLayout`'s server-side re-check redirects a
  signed-out or non-admin caller and does not redirect an admin, matching its actual
  Clerk-configured-only gate (unconfigured Clerk runs open, by design — see the file's
  docstring). **Why:** the app's only barrier between open sign-up and admin access had no
  tests exercising the fail-closed path.
- **Visual-polish pass — rhythm, hierarchy, states.** Overview stat cards gain a muted "Last 100"/
  "Unavailable" caption so counts read as a dashboard, not raw numbers. `backups-table` and
  `settings-form` normalize `mt-8` to the `mt-6` spacing scale used everywhere else.
  `admin-role-form` and `settings-form` section headings now match the real-`h2` `CardTitle` style
  already used on `system/page.tsx`. `settings-form` gains a real empty state (the one settings
  list that can be empty). New copy: `overview.recent`, `overview.unavailable`, `settings.empty`
  (en + fr). **Why:** tightens the dashboard shell's spacing and heading consistency, and closes
  the one missing empty state.
- **shadcn dashboard shell — sidebar, header, theme toggle, Overview landing.** New
  `src/user-interface/layout/` shell (`AppShell` → `AppSidebar` + `SidebarInset`/`AppHeader`) replaces
  the single-page scaffold: a grouped nav (Overview · Access[Users, Sessions] ·
  Compliance[Data requests, CSP] · Operations[Backups, System, Settings] · Security) driven by
  `src/user-interface/lib/nav.ts`, a sticky header with breadcrumbs, and a no-flash light/dark
  `ThemeToggle` (persists to `localStorage` as `admin-theme`). Collapses to a Sheet on mobile. A new
  `(dashboard)/page.tsx` Overview landing shows a grid of stat Cards (best-effort counts, a muted "—"
  where no cheap endpoint exists) alongside the admin-role form. **Why:** the admin had placeholder
  pages with no shared chrome or navigation; this gives operators one consistent shell to work in.
- **shadcn visual pass across every admin page.** Every page now has a `PageHeader` + shadcn `Card`
  chrome; every table (sessions, backups, data requests, CSP, security, system, users) is a shadcn
  `Table` with status `Badge` cells instead of raw color text; forms use shadcn `Input`/`Label` and
  `sonner` toasts; section headings are real `<h2>`s. Components are app-owned — **no Storybook**
  (Storybook's globs cover only the design-system packages, not app UI). New deps: `lucide-react`,
  `sonner`. **Why:** brings the admin surface to the same visual bar as `website`, without adding new
  backend endpoints.
- **Settings card — edit retention/ops/TTL knobs.** New `(dashboard)/settings` page reads
  `GET /v1/settings` server-side (the api token stays server-side) and renders grouped
  number inputs (Retention / Ops / Link TTLs), each with its default, min/max hint, and an
  "Overridden" badge; Save calls a `saveSetting` server action per changed key (re-checks
  the Clerk `admin` role, then `PUT /v1/settings`). The three privacy-policy-disclosed keys
  (`retention.audit_days`, `retention.consent_days`, `retention.erasure_request_days`) carry
  an inline reminder to update the policy disclosure if changed. **Why:** an operator can
  now change a retention window, the erasure-SLA lead time, or a link TTL without a code
  change + redeploy — see `code/docs/apps/web/config/settings.md`.
- **Read-only Backups history card.** New `(dashboard)/backups` page reads
  `GET /v1/backups/status` server-side and lists the bucket/retention/pre-migration-snapshot
  summary plus the last 20 backup runs, newest first, flagging a run **Failed** or **Stuck**
  (icon + text, never color alone) when it errored or never finished. Visibility only — no
  control; backup retention stays a version-controlled R2 lifecycle rule. **Why:** an
  operator previously had no way to see whether scheduled/pre-migration backups were
  actually succeeding.
- **CSP violations dashboard — `(dashboard)/csp`.** Read-only page mirroring `(dashboard)/security`:
  reads `GET /v1/csp-reports` server-side (bearer held server-side, `cache: "no-store"`) and lists
  aggregated CSP violation groups — count · disposition · directive · route · blocked source · surface ·
  last seen — most frequent first. `disposition: "report"` rows (what a strict CSP would block) are
  emphasized over `"enforce"` rows (blocked now). Linked from the dashboard nav. **Why:** gives an
  operator the enforce-readiness signal needed to decide when a surface is safe to flip from
  report-only to enforced CSP.
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
- **Security headers + CSP violation reporting — the first `securityHeaders()` call on admin.**
  `next.config.ts` gains an `async headers()` (admin shipped none before): the shared
  `securityHeaders({...})` brick from `@indiecrafts/packages-shared-security`, with a `reporting`
  option pointing at a new same-origin `/api/csp-report` route. The enforced CSP gains a
  `Reporting-Endpoints` header, and a `Content-Security-Policy-Report-Only` candidate ships
  alongside it that drops the blanket `https:` from `img-src` (`reportOnly: { dropSources:
["https:"] }`), so we learn the real image allowlist before enforcing it. Admin loads no
  third-party media, so no extra CSP hosts are declared. The route is a one-line delegate to
  `handleCspReport` from `@indiecrafts/packages-web-security-reports` (mirrors the website's
  route), reachable without a session — the proxy matcher already excludes `/api/*`. **Why:**
  admin had no security headers at all; this closes that gap and gives us observability into
  what the CSP would block before tightening it.
- **Clerk auth + full i18n scaffold — the admin gate (opt-in).** The admin app moves from a single-page
  scaffold to a next-intl surface (parity with website/app: `[locale]` segment,
  `i18n/{routing,request}.ts`, `messages/{en,fr}.json`) behind a Clerk `admin`-role gate. `src/proxy.ts`
  wraps next-intl in `clerkMiddleware` and redirects every non-`admin` request to `/sign-in` (**fails
  closed**); the `(dashboard)` route-group layout re-checks `isAdmin(await auth())` server-side
  (defense-in-depth — middleware is bypassable, Next.js CVE-2025-29927). Sign-in is Clerk's hosted
  `<SignIn>` at `/[locale]/sign-in` — **sign-in only, no open sign-up**. Auth is **opt-in**: with no
  `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` the scaffold runs UNGATED (configure Clerk before shipping — see
  `.env.example`). Replaces the planned Cloudflare Access gate. **Why:** one auth system across every app,
  and the admin surface is the one that enforces the role.
- **Privilege model — grant/revoke admin, audited, with session revocation.** `(dashboard)/actions.ts`
  server actions `grantAdmin` / `revokeAdmin` are the crown-jewel path: re-authorized server-side
  (`isAdmin(await auth())`), validate the target `user_…` id, then `clerkClient().users.updateUserMetadata`.
  **Revoke also ends the target's live sessions** (`sessions.getSessionList` → `revokeSession`) so a
  demotion is immediate, not "≤ token TTL". Every action writes a structured **audit** line
  (`lib/audit.ts`) captured by Cloudflare Workers Logs → Logpush (no database) — a deliberate `console.log`
  because the shared logger silences `info` in prod and its Cloudflare transport forwards only
  `error`/`fatal`. `(dashboard)/admin-role-form.tsx` (client) drives it; strings in `messages` (`admin.roles.*`).
  **Why:** open passwordless sign-up means this write is the only thing between a stranger and admin — so it
  is gated, validated, audited, and immediate.
- **Sign-in uses the shared `<SignInView>`.** Admin's inline `<SignIn>` is replaced by
  `@indiecrafts/packages-web-auth`'s `<SignInView>` (themed + `fallbackRedirectUrl`), so every web surface
  shares one sign-in surface and redirect behavior.
- **Audit writes to the EU D1 via the api (was a console line).** `lib/audit.ts` now POSTs each
  `admin.grant`/`admin.revoke` to the shared api `/v1/events` (bearer `APP_API_TOKEN`), which writes the
  EU `admin_audit` table; country from `cf-ipcountry`, **no IP stored** (minimization). Durable fallback:
  on an api failure it logs one structured Workers-Logs line, so an audit is never lost. Needs `API_URL` +
  `APP_API_TOKEN` (see `.env.example`). **Why:** an EU-resident, queryable audit trail (replaces Logpush).
- **Session tracking + a "view sessions" screen.** `SessionLogger` (mounted in `[locale]/layout`) logs each
  admin sign-in via `/api/session-log` → the api → EU D1. New `(dashboard)/sessions` page reads
  `GET /v1/sessions` server-side and lists recent sign-ins across **all** surfaces (when · surface · user ·
  country, no IP); linked from the dashboard. **Why:** operators can see who signed in, where, and on which
  surface. Live-session **revocation** stays Clerk-backed (already wired on role demotion).
- **Richer sessions + revoke.** Each row expands to the user's **live Clerk sessions** (device · browser ·
  location · last-active — fetched live, never stored) with a per-session **Revoke** and a **"sign out
  user"** (all active). New audited server actions `listUserSessions` / `revokeSession` /
  `revokeUserSessions` (`admin.revoke_session` / `admin.revoke_user_sessions`); the D1 `session_events` now
  carries the Clerk `session_id` so a history row is revocable. **Why:** see and end active sessions, not
  just history — the source of truth for "active" is Clerk.
- **Users browse + System status.** `(dashboard)/users` searches Clerk users (`getUserList` — email · role ·
  created · last-sign-in, with a search box). `(dashboard)/system` (replaces the versions page) shows three
  sections: **Surfaces** (each `/api/version`), **Workers** (api/agent `/health`; cron/workers marked
  scheduled/queue), and **Databases** (audit + security D1 status via the api's bearer-authed `/health`;
  Sanity marked external). Env: `WEBSITE_URL` · `APP_URL` · `API_URL` · `AGENT_URL`. Both admin-gated,
  read-only, linked from the dashboard. **Why:** operator visibility over accounts, deploys, workers, and
  DBs — reusing the Clerk secret + the public health/version endpoints (no new infra).

### Changed

- **CSP now ENFORCED by default (`CSP_MODE` default flipped from `report-only` to `enforce`); set
  `CSP_MODE=report-only` to roll back.** `src/proxy.ts`'s `CSP_MODE` fallback flips: env unset now
  resolves to `enforce` instead of `report-only`. **Why:** the strict nonce CSP shipped observe-only
  since SP3 — the CSP violations dashboard (`(dashboard)/csp`) gives operators the enforce-readiness
  signal, so the strict policy graduates to actually blocking inline-script injection instead of just
  reporting it.
- **Data requests screen (read-only).** New `(dashboard)/data-requests` page reads
  `GET /v1/data-requests` server-side and lists GDPR data-subject requests (when · type · email ·
  status · a truncated message excerpt · locale/source, last 100); linked from the dashboard. DSARs
  moved off Sanity Studio into D1 (`api`'s `data_requests` table), so this restores operator
  visibility. **Read-only** — status write-back (mark in-progress/done) is a deferred follow-up; until
  it lands, flip a request's status by hand: `wrangler d1 execute indiecrafts-<env>-shared-api
  --command "UPDATE data_requests SET status='done' WHERE id=?"`.
