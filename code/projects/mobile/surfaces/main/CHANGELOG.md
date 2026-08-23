# Changelog — mobile app (`@indiecrafts/mobile-surfaces-main`)

One record for the Expo mobile surface — every change that alters behavior, a
convention, config, or persistence lands here in plain language with the _why_.

**Not here:** shared-brick changes → [`code/packages/CHANGELOG.md`](../../../../packages/CHANGELOG.md);
the repo-wide roll-up → [root `CHANGELOG.md`](../../../../../CHANGELOG.md).

Format follows [Keep a Changelog](https://keepachangelog.com). Categories:
**Added · Changed · Deprecated · Removed · Fixed**.

## [Unreleased]

### Added

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
