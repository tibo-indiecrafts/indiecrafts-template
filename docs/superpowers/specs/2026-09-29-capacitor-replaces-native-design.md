# Capacitor replaces native — design

**Date:** 2026-09-29 · **Status:** approved (brainstorm) · **Goal:** remove complexity.

## Intent

Remove the React Native / Expo platform from the whole codebase and ship the
mobile app as a **Capacitor shell around the existing `app` web surface**. One UI
codebase (web), two store-ready native projects (Android, iOS). The success test
is subtraction: fewer packages, fewer forks, fewer secrets, fewer scripts — with
no legacy code, no compatibility shims, and no "reserved for later" folders left
behind.

## Decisions

| #   | Decision                                    | Chosen                                                                                                                           |
| --- | ------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| 1   | What the shell loads                        | **Hosted `app` URL** (`server.url`), not a static export — `app` depends on SSR, the middleware, server Clerk and route handlers |
| 2   | Web-only bricks left in `shared/`           | **Relocate + merge** — restore the "highest scope it runs on" rule                                                               |
| 3   | Native capabilities now                     | **Minimal shell** — app, browser, status-bar, splash-screen. Push (App Store 4.2) is a later spec                                |
| 4   | Sign-in methods                             | **Password + email code only, on every surface** — a Clerk dashboard setting; no social OAuth anywhere                           |
| 5   | Backend features that exist only for native | **Removed** — `/v1/geo`, `EVENTS_TOKEN`; surface `mobile` merges into `app`                                                      |
| 6   | Historical data                             | **Kept** — D1 rows with `surface = 'mobile'` are append-only proof; changelog history is not rewritten                           |

## 1. Target shape

**Deleted:**

- `code/projects/mobile/surfaces/main` — the Expo app (replaced in place by the shell, §2).
- `code/packages/mobile/ui-native` and the empty `code/packages/mobile/` scope.
- Every `src/native/` fork: `compliance` (plus its `./native` export and the
  `@react-native-async-storage/async-storage` optional peer), `system-pages`,
  `ui-icons`, `ui-tokens` (plus the generated React Native hex `tokens.ts` build
  target), and the one-file `native/` placeholders in `web/ui` and
  `web/ui-components`.
- The Storybook `Native` root. With one platform left, the `Web`/`Native`
  separators have no job: the sidebar is a single tree, still ordered domain
  components first, UI atoms last.

**Relocated** (package name follows the folder tail; every importer, `tsconfig`
path, `transpilePackages` entry, `@source` line and doc link is rewritten):

| From                  | To                                                   |
| --------------------- | ---------------------------------------------------- |
| `shared/version`      | **merged into** `web/version` (the brick is deleted) |
| `shared/system-pages` | `web/system-pages`                                   |
| `shared/ui-icons`     | `web/ui-icons`                                       |
| `shared/ui-tokens`    | `web/ui-tokens` (every `DESIGN.md` path included)    |

`shared/` keeps only bricks with a non-web consumer — `compliance` and
`announcement` (both used by `shared/api`) and the existing server-side bricks.
The rule after this change: **`shared/` = the api or workers use it too;
`web/` = browser only.**

**Simplified inside surviving bricks:** comments and briefs that describe "every
shell (Expo · app)" are rewritten to the single truth; no platform switches, no
optional peers, no native README markers.

## 2. The Capacitor shell

**Location:** `code/projects/mobile/surfaces/main` (same package name
`@indiecrafts/mobile-surfaces-main`, same registry row; class `expo` → `capacitor`).
Contents: `package.json`, `capacitor.config.ts`, `www/` (the generated offline
page), and the committed `android/` + `ios/` native projects. No React, no UI.

**Config:**

- `appId` from instance config, `appName` from `site` — never hard-coded.
- `server.url` = `resolveServerUrl(env)`: `CAP_SERVER_URL` when set, else the
  deployed `app` URL.
- `server.errorPath: "offline.html"`.
- Cleartext HTTP only when the resolved URL is `http://` (local dev).

**Dev setup:**

| Target                      | Command                                                | Server URL                                                           |
| --------------------------- | ------------------------------------------------------ | -------------------------------------------------------------------- |
| Android emulator (`qa` AVD) | `pnpm mobile:android`                                  | `http://10.0.2.2:3002` (the emulator's route to the Mac's localhost) |
| iOS simulator               | `pnpm mobile:ios`                                      | `http://localhost:3002` — needs full Xcode (documented, not assumed) |
| Physical device             | `CAP_SERVER_URL=http://<LAN-IP>:3002 pnpm mobile:sync` | LAN IP                                                               |

The `app` surface gets `allowedDevOrigins` (dev only) so Next 16 serves the
emulator origin. `pnpm mobile:sync` regenerates `www/` and runs `cap sync`.

**`NativeBridge`** — one client component in the `app` surface; a no-op in a
browser. Inside the shell it: maps the Android back button to history (exit at the
root), routes deep links (`appUrlOpen`) to the matching route, opens external and
legal links in the system browser (`@capacitor/browser`, decided by the pure
`isExternalUrl(url, appOrigin)`), sets the status bar, and hides the splash screen.

**Offline:** a failed first load shows the bundled `offline.html` (retry button).
Its copy comes from the app's existing `messages.<locale>.offline` strings plus the
site name, via a small generator run by `mobile:sync` — config-first, no inline
brand strings. After load, the app's existing `OfflineBanner` covers drops.

**Sign-in:** password + email code on every surface — so the shell needs no
sign-in branch. Social connections are switched off in the Clerk dashboard
(operator step, documented in `auth.md`, checked by a ledger card).

**Legal + consent:** nothing mobile-specific. The shell is the `app` surface, so its
`LegalGate`, `localStorage` deposit and signed-in `/v1/consent/legal` sync apply
unchanged.

## 3. Backend and data

- **`GET /v1/geo` removed** (route, tests, docs, brief). Web surfaces read
  `cf-ipcountry` server-side.
- **`EVENTS_TOKEN` removed.** Every `/v1/events` caller is server-side with
  `APP_API_TOKEN` (verified: `session-log`, `consent-log`, `security-reports`), so
  the route accepts only that bearer again. Removed with it: the ingest-kind
  branch and its 403, the `Env` field, the vitest binding, the `secrets.mjs` key +
  test, `.env.example`, and the `EXPO_PUBLIC_EVENTS_TOKEN` secret-leak rule. The
  admin-route rate limiting from the same hardening pass **stays**. Operator
  runbook in the api changelog: `wrangler secret delete EVENTS_TOKEN --env <env>`.
- **Native CORS origins** (if any) removed from the api allowlist.
- **Surface `mobile` → `app`:** `SURFACES = ["website", "app"]`; the Sanity
  `surfacesField` drops the option; session-log / consent `surface` types drop
  `"mobile"`. A one-off script (run with `--env-file`, then deleted — the
  `reviewLabel` pattern) rewrites stored announcements: `"mobile"` → `"app"`,
  de-duplicated.
- **Kept:** existing D1 rows with `surface = 'mobile'` (`consent_events`,
  `session_events`) — append-only proof; no migration touches them.

## 4. Tooling, CI, tests, docs, ledger

**Tooling + CI — removed:** `deploy/expo.mjs`, `deploy-native.yml`,
`deploy:mobile:*` + EAS scripts and config, the Expo branches of
`deploy/all.mjs` + `deploy.yml`, the `EXPO_PUBLIC_*` secret-leak rules, the mobile
`tsc-fast` entry, the `code/packages/mobile/*` workspace glob. **Added:** root
`mobile:android`, `mobile:ios`, `mobile:sync`. No store-release pipeline yet — it
arrives with the push / App Store spec.

**Tests — deleted:** native tests + stories. **Updated:** `apps`, `deploy/all`,
`secret-leak`, `secrets`, api `/v1/events` (no ingest token), geo, announcement
`SURFACES`. **Added** (new logic only): `resolveServerUrl`, the offline-page
generator, `isExternalUrl`.

**Docs + briefs — deleted:** Expo pages and the reference docs of every deleted
file. **Rewritten:** `projects/mobile/main` (Capacitor dev setup),
`shared/architecture/cross-platform-shell.md`, `auth.md` (password + email code),
the compliance docs (no native rows), the VitePress sidebar, and the briefs (root
folder map; packages scopes `shared · web` + counts; projects; mobile;
compliance; every `DESIGN.md` path). **New:** ADR "Capacitor over Expo".
**Changelogs:** one entry per area log (one log per change).

**Ledger (claude.ai artifacts):** _Legal Banner QA_ — the Expo section becomes a
Capacitor section. _QA Runbook_ + _Test Ledger_ — Expo cards replaced by Capacitor
cards: shell boots on `qa` and loads `app`; back button; deep link; legal/external
links open the system browser; offline page on first launch (airplane mode);
splash + status bar; password + email-code sign-in and Clerk social connections
off; legal banner inside the shell; `app`-tagged announcements show in the shell;
iOS marked **human / needs Xcode**.

## Order (tree green after each step)

1. Backend removals (`/v1/geo`, `EVENTS_TOKEN`, surface `mobile`, Sanity data script).
2. Delete the Expo app, `ui-native` and every native fork.
3. Relocations, one brick at a time (`version` merge → `system-pages` → `ui-icons` → `ui-tokens`).
4. Capacitor shell + `NativeBridge` + dev scripts.
5. Docs, ADR, briefs, changelogs.
6. Ledger artifacts.

## Done means

`tsc` (all workspaces + the shell), every test suite, `check:doc-coverage`,
`docs:build` (dead links), `tags:check`, `check:claude-md` and `oxlint` are green;
the shell boots on the `qa` emulator and loads `app`; and a final grep finds **zero**
`expo`, `react-native`, `EXPO_`, `ui-native` or `src/native` hits outside changelog
history.

## Out of scope

Push notifications, a store-release pipeline, OAuth via the system browser, an
offline-capable (bundled) shell — together they form the later "App Store
release" spec.
