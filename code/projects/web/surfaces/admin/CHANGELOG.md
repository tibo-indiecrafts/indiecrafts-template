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
