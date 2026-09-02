# Changelog — hybrid app (`@indiecrafts/hybrid-surfaces-main`)

One record for the Electron desktop surface — every change that alters behavior, a
convention, config, or security posture lands here in plain language with the _why_.

**Not here:** shared-brick changes → [`code/packages/CHANGELOG.md`](../../../../packages/CHANGELOG.md);
the repo-wide roll-up → [root `CHANGELOG.md`](../../../../../CHANGELOG.md).

Format follows [Keep a Changelog](https://keepachangelog.com). Categories:
**Added · Changed · Deprecated · Removed · Fixed**.

## [Unreleased]

### Changed

- **The desktop window loads the `app` product surface in dev, not the marketing website
  (`src/main/index.ts`).** `DEV_URL` now defaults to `http://localhost:3001` (the `/app` dashboard)
  instead of `:3000` (the `website`). `RENDERER_URL` stays an explicit override. **Why:** the hybrid is
  the product in a desktop shell; it should open the app, not the marketing site. The bundled renderer
  (`src/renderer`) is still built by electron-vite and loads when packaged, but it is a scaffold not yet
  run as the loaded dev content (it assumes a Next/Node env — e.g. `process.env` — so it needs a Vite
  `define` pass before it can be the dev target).

### Added

- **Consent/legal confirmation toast.** The renderer fires `showConsentSavedToast` on an explicit
  cookie-consent choice (accept/reject/save) and legal re-acceptance, mounting one `<Toaster>` in
  `ShellOverlays`; the auto-seed effect stays silent.
- **Cookie preferences on Home.** New `CookiePreferencesSection` (`consent-preferences.tsx`) — the
  renderer has no settings screen — reuses the shell's consent-store key; the toast's Manage
  action now opens it instead of scrolling to the legal-links placeholder.

### Fixed

- **Conditional Hook in `LegalReacceptGate` (`src/renderer/src/shell.tsx`).**
  `useRecord(consentStore)` sat inside a `features.requireConsent && …` short-circuit, so it
  ran only when the flag was on — a Rules-of-Hooks violation that would break Hook order if the
  flag ever became dynamic. The Hook now runs unconditionally; the flag gates only its result.
- **Electron main process crashed on launch (`electron.vite.config.ts`).** electron-vite externalized
  the `@indiecrafts/*` workspace bricks, so Electron `require()`d raw TypeScript
  (`agent-client/src/index.ts`) and threw `SyntaxError: Unexpected token 'export'`. The main/preload
  builds now BUNDLE those bricks (`externalizeDepsPlugin({ exclude })`) — they ship TS source, no built
  output — so `pnpm dev` launches the desktop window again.

### Added

- **Share row on Home.** `src/renderer/src/shell.tsx` gains a `ShareRow` (mounted in `App.tsx` Home)
  rendering the shared `ShareButtons` over the marketing `websiteUrl` — hidden when no origin is set.
  Adds the `ui-components`/`ui-icons` deps + tsconfig `paths` (the wildcard export needs it) and new
  `share.*` react-intl copy. **Why:** a "share the site" affordance in the desktop shell, reusing the
  web share row instead of a bespoke one.
- **Self-service "Download my data" control.** `SignedInView` (`src/renderer/src/auth.tsx`) mounts the
  shared `ExportSection` (`@indiecrafts/packages-shared-compliance/web`) beside the delete control, wired
  to `getToken` from the existing `@clerk/clerk-react` `useAuth()`. Gated by the new
  `features.exportAccount` flag **and** `apiUrl` being configured. New `messages.account.export.*` copy
  (react-intl). **Why:** lets a signed-in desktop user download a copy of their data, posting the shared
  api's authenticated `POST /v1/export`.
- **Self-service "Delete my account" control.** `SignedInView` (`src/renderer/src/auth.tsx`) mounts the
  shared `DeleteAccountSection` (`@indiecrafts/packages-shared-compliance/web`), wired to `getToken`/
  `signOut` from the existing `@clerk/clerk-react` `useAuth()`. Gated by the new `features.deleteAccount`
  flag **and** `apiUrl` being configured — either missing hides the control rather than posting to an
  empty origin. New `messages.account.delete.*` copy (react-intl). **Why:** lets a signed-in desktop user
  exercise GDPR erasure without contacting support, posting the shared api's authenticated
  `POST /v1/erasure/self`.
- **Geo-targeted cookie consent.** The renderer `geo.ts` fetches the api `GET /v1/geo` on launch (the
  device's edge country), caches it in `localStorage`, and resolves the regulation with `src/config`
  overrides; the `ConsentBannerGate` blocks only for opt-in regions (opt-out/none auto-seed, honouring
  GPC — the renderer is Chromium). Fails safe to opt-in when the api is unreachable; the banner never
  flashes. Design → `code/docs/apps/web/config/cookie-consent-geo.md`.
- **Logged-in announcements (banner + toast).** `src/renderer/src/announcement.tsx` (bespoke — the web
  `AnnouncementBar`/`AnnouncementToast` import next-intl and can't run in the Vite renderer) fetches the
  shared api Worker's `/v1/announcements` (`surface=hybrid`, via `VITE_API_URL`) ONLY when signed in AND
  online, and renders a top banner strip + a fixed toast card in the shared Tailwind tokens; links open in
  the OS browser via the preload bridge; dismissal via `createWebStore`. Mounted in `shell.tsx` gated on
  `hasClerk`. New `packages-shared-announcement` dep + `messages.announcement.dismiss` + the `VITE_API_URL`
  env decl. **Why:** editor announcements now reach the desktop app, logged-in only.
- **Clerk auth — sign-in in the desktop renderer (opt-in) + a hardened deep-link OAuth path.** The
  renderer mounts `@clerk/clerk-react` `<ClerkProvider>` **opt-in** (gated on
  `VITE_CLERK_PUBLISHABLE_KEY`; with no key the app runs exactly as before). `src/renderer/src/auth.tsx`
  is a passwordless sign-in panel: **email OTP** (sign-in + sign-up, over the Frontend API — no redirect,
  works inside the existing window security model) + **Google** via a system-browser deep link. The
  Google flow is state-bound: the renderer generates a `state`, opens Clerk's authorize URL through the
  new main-process `oauth:start` (https-only via `isSafeExternalUrl`), and MAIN registers `indiecrafts://`
  - a single-instance lock and **strictly parses** the inbound `indiecrafts://oauth-callback`
    (`url-guard.ts` `parseOAuthCallback` — exact scheme/host/path, allowlisted params, size caps; 6 new
    tests) before forwarding **only** the parsed `{ state, rotatingTokenNonce }` over a narrow preload
    channel — never a navigable URL. The renderer re-validates `state`. The CSP (`src/renderer/index.html`)
    is relaxed **scoped to Clerk's domains** (script/connect/img), keeping every other origin blocked. The
    session token lives in the renderer (inherent to clerk-react-in-Electron) — mitigated by the tight CSP +
    the existing `contextIsolation`/`sandbox`/no-cross-origin-nav posture. **Why:** one passwordless auth
    across every app, without weakening the desktop security model. `@debt SECURITY` — the Google
    **completion handshake** (transfer-nonce) has no official Clerk-Electron path; it is marked in
    `auth.tsx` as needing device verification. Email OTP is the guaranteed desktop sign-in.
- **Renderer sign-in standardized on Clerk `<SignIn>`.** The hand-rolled email-OTP form is replaced by
  `@clerk/clerk-react` `<SignIn routing="virtual">` (email UI, **social hidden** — its social buttons do a
  full-page redirect Electron blocks); Google stays the state-bound deep-link button. Less custom code,
  Clerk's polished email flow. `@debt SECURITY` — `<SignIn>`-in-Electron + the hidden-social appearance
  need device verification.
- **Session logging.** `HybridSessionLogger` (renderer, under `<ClerkProvider>`) calls a new
  `window.desktop.logSignIn(userId)` → the MAIN process posts it to the shared api's `/v1/events`
  (surface `"hybrid"`) with the main-held token — **never in the renderer/DOM**. **Why:** desktop sign-ins
  join the admin sessions screen; the token stays out of the renderer (like `agent:run`).
- **Test harness — Vitest (`verify` now means `tsc && test`).** `vitest.config.ts` extends the shared
  happy-dom base; colocated `src/main/*.test.ts` cover the pure, Electron-free main-process logic. First
  suite: `src/main/url-guard.test.ts`.
- **Offline banner in the renderer.** `src/renderer/src/useOnlineStatus.ts` (a `navigator.onLine`
  `useSyncExternalStore` twin of the website's hook) drives a banner in `App.tsx`; copy from the shared
  `SHELL_COPY.offline`. Reuses the `system-pages` `OfflineContent` page. See the packages changelog.

### Changed

- **Renderer security hardening.** The `BrowserWindow` now runs with `sandbox: true` (+ explicit
  `nodeIntegration: false` alongside `contextIsolation: true`). A `will-navigate` guard blocks any
  cross-origin in-page navigation, and `setWindowOpenHandler` denies every new window — both route an
  `http(s)` target to the OS browser via `shell.openExternal`. The renderer CSP gains `object-src 'none';
base-uri 'self'; frame-src 'none'`. The `http(s)`-only URL check is now one pure, tested helper
  (`src/main/url-guard.ts` → `isSafeExternalUrl`), shared by the `open-external` IPC handler, `will-navigate`,
  and `setWindowOpenHandler`. **Why:** a compromised renderer must not be able to navigate to an attacker
  page, spawn windows, or hand the OS a `file:`/`javascript:` URL. `sandbox` is safe here — the preload uses
  only `contextBridge` + `ipcRenderer` + `process.versions`.
