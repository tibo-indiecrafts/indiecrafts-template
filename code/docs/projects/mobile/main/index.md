---
title: Mobile surface
description: The React Native (Expo) mobile client — shell wired plus a signed-in account screen.
status: stable
order: 1
---

# Mobile surface (`@indiecrafts/mobile-surfaces-main`)

## Purpose

> The React Native (Expo) mobile client — shell wired, first product screen shipped.

Mobile is the native client. It talks to the `api` slot (or the website `/api` routes) for
data and renders content from the same Sanity dataset. The shell is built: theme, i18n,
status pages, native UI foundation, and a signed-in `account` screen. Further product
screens are TBD.

## Stack / Platform class

- **Framework:** React Native · Expo (managed, SDK ~52) · TypeScript · Expo Router.
- **Platform class:** `expo` — ships via **EAS Build → App Store / Play Store** (OTA via
  EAS Update), **not** Cloudflare. It sits outside the default `deploy:all` set.
- **React version** — React Native pins React `18.3`, older than the web surfaces' React 19. Only React-free bricks are shared.

## Wired baseline

- **Providers** (`app/_layout.tsx`) — `QueryClientProvider` (TanStack Query, shared
  `queryDefaults` from `@indiecrafts/packages-shared-query`) → `ThemePreferenceProvider`
  (a persisted `light`/`dark`/`system` choice over the shared tokens, wrapping `ui-native`'s
  `ThemeProvider`) → `IntlProvider` (react-intl) → the router `Stack`.
- **i18n** — `lib/i18n.ts`: `expo-localization` detects the device locale, then `react-intl`
  formats `messages/{en,fr}.json` (the same ICU format as web, flattened). The locale
  switches at runtime and persists. Vocabulary comes from `@/config`.
- **UI foundation** — `@indiecrafts/packages-mobile-ui-native` (shadcn-for-RN: `Screen` ·
  `ThemedText` · `Button` · `Card`) over `ui-tokens/native`. Use the native design system,
  not the web shadcn `ui`.
- **Status pages** — `app/+not-found.tsx` and the `ErrorBoundary` export use
  `system-pages/native` (404 · 500), themed at the shell.
- **Compliance + version + locale** — `components/ShellOverlays.tsx`: the shared
  `compliance/native` consent banner and legal re-acceptance popup (an AsyncStorage store,
  gated by `config.features.requireConsent` — off by default, geo-targeted per country via
  the api `GET /v1/geo` + `config.consent`), an `AppState` version poll of the website's
  `/api/version`, a first-run locale suggestion, and an offline banner. `app/legal.tsx`
  links out to the website's legal pages.
- **Auth** — Clerk (`@clerk/clerk-expo`). `app/sign-in.tsx` runs the OTP flow, with its
  step/mode/busy/error state in the pure `signInReducer` (`lib/sign-in-machine.ts`). The
  sign-up marketing opt-in rides in `unsafeMetadata`; a one-time `MarketingNudgeGate`
  prompts a signed-in user with no decision yet.
- **Account** — `app/account.tsx` (signed-in): the shared `compliance/native`
  cookie-preferences panel, a `MarketingEmailToggle` (→ `/v1/consent/marketing-email`), and
  an `accountUrl` web hand-off (an in-app browser tab) for profile, security, export, and
  deletion. There is no native delete or export control.
- **Persistence** — every key lives in `STORAGE_KEYS` (`@/config`); `lib/storage` wraps
  `AsyncStorage` never-throw for non-secret prefs. A runtime session token belongs in
  `expo-secure-store` once the `auth` brick lands.
- **Fonts** — deferred. Satoshi ships as web `.woff2`; RN needs `.ttf`/`.otf`, so the shell
  renders with the system font until an `.otf` lands in `ui-fonts`.

Instance config (`sitePrefix` · `websiteUrl` · `accountUrl` · `features` · `consent` ·
`policyVersion`) lives in `config/index.ts`. Lint here is `npx expo lint`, not the website's
Next config.

## Routes / pages

Expo Router screens under `app/`:

- `index.tsx` — Home
- `account.tsx` — the signed-in account screen
- `legal.tsx` — legal link-out
- `sign-in.tsx` — Clerk OTP sign-in
- `+not-found.tsx` — 404
- `_layout.tsx` — the root provider stack

## Deploy

```bash
pnpm deploy:mobile:main:dev      # or :staging | :prod
```

It runs `code/shared/scripts/deploy/expo.mjs` (env → EAS profile; structure-first — the full
EAS setup is a follow-up). `pnpm deploy:all:<env> --only all` reaches it, since the default
Cloudflare set skips native.

## Registry

One row in `code/shared/scripts/lib/apps.mjs` (slug `mobile`, class `expo`, order `50`,
dir `code/projects/mobile/surfaces/main`). The cross-surface shell model lives in
[cross-platform-shell](/shared/architecture/cross-platform-shell); the full deploy
model in [platform-deploy](/shared/architecture/platform-deploy).
