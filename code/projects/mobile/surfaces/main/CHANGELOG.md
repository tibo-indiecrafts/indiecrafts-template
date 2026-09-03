# Changelog — mobile app (`@indiecrafts/mobile-surfaces-main`)

One record for the Expo mobile surface — every change that alters behavior, a
convention, config, or persistence lands here in plain language with the _why_.

**Not here:** shared-brick changes → [`code/packages/CHANGELOG.md`](../../../../packages/CHANGELOG.md);
the repo-wide roll-up → [root `CHANGELOG.md`](../../../../../CHANGELOG.md).

Format follows [Keep a Changelog](https://keepachangelog.com). Categories:
**Added · Changed · Deprecated · Removed · Fixed**.

## [Unreleased]

### Fixed

- **`tsc` green — `@types/node` for `process.env` typing (`package.json`).** The app reads
  `process.env.EXPO_PUBLIC_*` (`config/index.ts`, `lib/agent.ts`, `sign-in.tsx`) but had no `@types/node`,
  so `process` was untyped once workspace hoisting shifted (23 → 13 `TS2580` errors, the rest cleared by
  the shared-config `/shared` import fix). Added `@types/node@^20` as a devDep. **Why:** `mobile tsc` (and
  `pnpm verify`) pass independent of hoisting.

### Added

- **EAS distribution scaffolding (`eas.json`, `app.config.ts`).** New `eas.json` build/submit profiles —
  `development` (dev), `preview` (staging), `production` (prod) — each baking its `EXPO_PUBLIC_API_URL`
  (the env's shared-api origin), plus a `production` submit block for the App/Play stores. `app.config.ts`
  gains `owner`, `runtimeVersion` (`appVersion` policy), `updates.url` (EAS Update feed), and
  `extra.eas.projectId` — the identity `eas init` fills. **Why:** `deploy:mobile:main:<env>` maps env →
  profile and now has real profiles to build/submit + OTA channels; all placeholders until you
  `eas login` + `eas init`. Store credentials + certs stay yours.

### Fixed

- **`expo start` now bundles and renders in the pnpm monorepo (`babel.config.js`, `metro.config.js`,
  `package.json`).** Four config gaps blocked the app from running. (1) No `babel.config.js` existed, so
  `babel-preset-expo` never ran and expo-router mounted an empty route tree — added the standard preset
  config. (2) `metro.config.js` now sets `watchFolders` + `unstable_enablePackageExports` so Metro reaches
  the workspace bricks' real source under `code/packages/**`, and blocks `@types/*` from resolution (it
  mis-resolved bare `react` to `@types/react`). (3) `@babel/runtime` was pinned to `^8.0.0`; Expo SDK 52
  runs on the Babel 7 toolchain, so its Babel-8 interop helpers broke module `default` exports — repinned
  to `^7.25.0` (dedupes to the monorepo's `7.29.7`). (4) The bundle pulled two React copies — `expo-router`
  resolved the web workspace's React 19 while `react-dom`/`react-native-web` used React 18.3.1, so the
  React-18 renderer received React-19 elements and silently committed an empty tree (blank screen, no
  error). `metro.config.js` now pins every `react`/`react-dom` request to the app's single 18.3.1 copy.
  Added `react-dom`, `react-native-web`, `@expo/metro-runtime`, `@babel/runtime` as the web/Metro runtime
  deps. **Why:** the shell (theme · i18n · status pages · consent/legal overlays) now bundles and renders
  again. `expo-env.d.ts` is now git-ignored per Expo's own convention.

### Added

- **Native share on Home.** `app/index.tsx` gains a Share button that opens the OS share sheet
  (React Native `Share.share`, not the web intent-URL row) with the marketing `websiteUrl`; disabled
  when no origin is set. New `home.share` copy (`messages/{en,fr}.json`). **Why:** the idiomatic mobile
  share, completing "share on all surfaces except admin."
- **Data export — "Download my data" on the signed-in view.** `SignedInView` (`app/sign-in.tsx`) now
  renders the shared native `ExportSection` (`@indiecrafts/packages-shared-compliance/native`) beside the
  delete control, gated behind the new `config.features.exportAccount` flag and a non-empty
  `EXPO_PUBLIC_API_URL`. It calls the api's `POST /v1/export` via Clerk's `getToken` and opens the
  returned download link with `Linking`. Copy lives in `messages/{en,fr}.json` (`account.export.*`).
  **Why:** completes the self-service GDPR data-export control on the mobile surface.
- **Account deletion — "Delete my account" on the signed-in view.** `SignedInView` (`app/sign-in.tsx`)
  now renders the shared native `DeleteAccountSection` (`@indiecrafts/packages-shared-compliance/native`),
  gated behind the new `config.features.deleteAccount` flag and a non-empty `EXPO_PUBLIC_API_URL` (never
  render a control that posts to an empty origin). It confirms the signed-in email, calls the api's
  `POST /v1/erasure/self` via Clerk's `getToken`, then signs out and returns home. Copy lives in
  `messages/{en,fr}.json` (`account.delete.*`). **Why:** completes the self-service "Delete my account"
  control on all four surfaces (website, admin, app, mobile).
- **Geo-targeted cookie consent.** `lib/geo.ts` fetches the api `GET /v1/geo` on launch (the device's
  edge country — native has no `cf-ipcountry` of its own), caches it, and resolves the regulation with
  `src/config` overrides; the `ConsentGate` in `ShellOverlays` blocks only for opt-in regions
  (opt-out/none auto-seed accept). Fails safe to opt-in when the api is unreachable; the banner never
  flashes (hidden until geo resolves). Design → `code/docs/apps/web/config/cookie-consent-geo.md`.
- **Logged-in announcements (banner + toast).** `components/AnnouncementOverlay.tsx` (RN, mounted in
  `ShellOverlays` gated on `hasClerk`) fetches the shared api Worker's `/v1/announcements`
  (`surface=mobile`, via `lib/announcements.ts` + `EXPO_PUBLIC_API_URL`) ONLY when signed in AND online,
  and renders a top banner strip + a bottom toast card — every colour from the shared `useTheme` tokens,
  links via `Linking`, dismissal via `createNativeStore` (new `STORAGE_KEYS.announcement*Ack`). New
  `packages-shared-announcement` dep + `messages.announcement.dismiss`. **Why:** editor announcements
  now reach the mobile app, logged-in only.
- **Clerk auth — sign-in on mobile (opt-in), session on the OS keychain.** New `lib/secure-storage.ts`
  (the `expo-secure-store` sibling of `lib/storage`, as the `storage.ts` note anticipated) backs a Clerk
  `tokenCache` (`lib/auth.ts`) — the session + refresh tokens live in the OS Keychain/Keystore, never
  AsyncStorage. `app/_layout.tsx` mounts `<ClerkProvider>` **opt-in** (gated on
  `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY`; with no key the app runs exactly as before). `app/sign-in.tsx` is a
  passwordless sign-in screen — email one-time-code (sign-in + sign-up) + Google SSO (`useSSO`, system
  browser) — over the native primitives, with a signed-in view + sign-out; strings in `messages/`
  (`auth.*`). Home gets a "Sign in" link. No admin gate (the role is readable via the shared `isAdmin`).
  Deps: `@clerk/clerk-expo` + `expo-secure-store` / `expo-web-browser` / `expo-linking`. **Why:** one
  passwordless auth across every app, with the mobile session stored securely by default.
- **Sign-in UX — "change email" on the code step.** A back affordance (`auth.changeEmail`) so a wrong
  email on the OTP step is no longer a dead end.
- **Session logging.** A `SignInLogger` in `_layout` (under `<ClerkProvider>`) fires once per session to
  the shared api's `/v1/events` (surface `"mobile"`) via `lib/session-log.ts`, using the bundled
  `EXPO_PUBLIC_API_URL` + `EXPO_PUBLIC_AGENT_TOKEN`. Unset → off. **Why:** sign-ins show in the admin
  sessions screen alongside the other surfaces.
- **Offline banner — `useNetworkStatus` + `OfflineBanner` in the shell.** `hooks/useNetworkStatus.ts`
  wraps `@react-native-community/netinfo` (idiomatic RN `useState` + `useEffect`; starts online to avoid a
  launch flash, only an explicit `isConnected`/`isInternetReachable === false` marks offline).
  `components/OfflineBanner.tsx` — a non-blocking top strip (mounted in `ShellOverlays`), `secondary`
  tokens, `accessibilityLiveRegion="polite"`, copy from the shared `SHELL_COPY.offline` (`offline.banner`,
  already merged into react-intl by `messagesFor`). **Why:** losing the network was silent; the full-screen
  `OfflineContent` for a screen that can't render offline is ready in `system-pages/native`. Safe-area inset
  is a rough constant — `react-native-safe-area-context` refinement is a follow-up.
- **Test harness — `jest` + `jest-expo` (`verify` now means `tsc && test`).** `jest.config.js`
  (`preset: "jest-expo"`, a **pnpm-aware** `transformIgnorePatterns` that transpiles RN/Expo packages
  under `node_modules/.pnpm/…`) + `jest.setup.js` (mocks native `AsyncStorage`). Colocated tests:
  `lib/storage.test.ts` (the never-throw read/write contract — **backfills the test waived in P0.2**) and
  `lib/agent.test.ts` (the env guard fails closed with no `EXPO_PUBLIC_*`). **Why:** mobile `verify` was
  `tsc`-only, so behavior went unchecked; now it runs a real suite, folded into the repo `pnpm verify`
  turbo fan-out. RN Testing Library + `testID`s are deferred until the first screen/component exists.
- **`STORAGE_KEYS` registry (`@/config`) + a never-throw `storage` helper (`lib/storage.ts`).**
  Every persisted key is namespaced once under `sitePrefix` in one registry; screens and stores read a
  name (`STORAGE_KEYS.locale` / `.cookieConsent` / `.legalAck`) instead of building `${sitePrefix}.foo`
  inline. `storage.get`/`storage.set` wrap `AsyncStorage` with a never-throw contract (a full/disabled
  store returns `null` / is swallowed, not fatal). **Why:** the key strings were built ad-hoc in two files
  (a drift risk — two files can disagree on one key) and `i18n` hand-rolled its own try/catch; now there is
  one home for keys and one for the never-throw read/write. Groundwork for the auth/session work: a runtime
  session token will get an `expo-secure-store` sibling (OS keychain) of the same shape — the agent bearer
  stays in env because it is a build-time bundle gate, not a runtime secret.

### Changed

- **`lib/i18n.ts` locale persistence** now goes through `storage` + `STORAGE_KEYS.locale` (was inline
  `AsyncStorage` + try/catch). **`components/ShellOverlays.tsx`** consent/legal stores now key off
  `STORAGE_KEYS.cookieConsent` / `.legalAck` (was inline `${sitePrefix}.…`). Behavior is unchanged — same
  keys, same values.
