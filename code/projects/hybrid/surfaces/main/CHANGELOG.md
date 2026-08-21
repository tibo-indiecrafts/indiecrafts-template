# Changelog — hybrid app (`@indiecrafts/hybrid-surfaces-main`)

One record for the Electron desktop surface — every change that alters behavior, a
convention, config, or security posture lands here in plain language with the _why_.

**Not here:** shared-brick changes → [`code/packages/CHANGELOG.md`](../../../../packages/CHANGELOG.md);
the repo-wide roll-up → [root `CHANGELOG.md`](../../../../../CHANGELOG.md).

Format follows [Keep a Changelog](https://keepachangelog.com). Categories:
**Added · Changed · Deprecated · Removed · Fixed**.

## [Unreleased]

### Added

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
  + a single-instance lock and **strictly parses** the inbound `indiecrafts://oauth-callback`
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
