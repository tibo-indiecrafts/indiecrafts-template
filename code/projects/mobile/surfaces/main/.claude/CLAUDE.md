# `@indiecrafts/mobile-surfaces-main` — the Capacitor shell

Auto-loads under `code/projects/mobile/surfaces/main/**`. A Capacitor 8 shell around the hosted
`app` surface — **no UI of its own**. `server.url` loads the app; every screen, string and
flow lives in `code/projects/web/surfaces/app`. The app's `NativeBridge` wires the plugins.

**Platform class:** `capacitor` (registry row in `code/shared/scripts/lib/apps.mjs`; not deployed
by the Cloudflare runners — the release pipeline comes with the App Store spec).

- **Identity:** `shell.json` (`appId` · `appName` · `scheme`) — the one home; `project-rename` rewrites it + the native projects.
- **Server URL:** `src/server-url.ts` → `CAP_SERVER_URL` (required). Dev = `http://localhost:3002`.
- **Clerk host:** `CAP_CLERK_PUBLISHABLE_KEY` (required) → `server.allowNavigation`; else Clerk's handshake opens the system browser. Dev scripts read it from the app's `.env.local`.
- **Offline:** `scripts/build-www.mjs` renders `www/offline.html` from `messages/*.json` (`server.errorPath`).
- **Run:** `pnpm dev` + `pnpm --filter @indiecrafts/web-surfaces-app dev --port 3002`, boot an emulator, then `pnpm --filter @indiecrafts/mobile-surfaces-main android` (JDK 21). iOS: boot a simulator, then `… ios` (Xcode 27; opens DeviceHub). TestFlight → the mobile guide.
- **Native projects:** `android/` + `ios/` are committed; `www/` is generated (git-ignored).

Full guide → [`code/docs/projects/mobile/main/index.md`](../../../../../docs/projects/mobile/main/index.md).
