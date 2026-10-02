---
title: Mobile shell (Capacitor)
description: The Capacitor shell that ships the app surface to Android and iOS — no UI of its own.
status: stable
order: 1
---

# Mobile shell (Capacitor)

> `@indiecrafts/mobile-surfaces-main` — a Capacitor 8 shell around the hosted `app` surface.

## What it is

The shell has **no UI of its own**. Its `server.url` loads the `app` surface, so every
screen, string and flow lives in `code/projects/web/surfaces/app`. The app's `NativeBridge`
component wires the native plugins: the Android back button, deep links, system-browser
links, the status bar and the splash screen. In a normal browser it does nothing.

Why Capacitor over Expo → [ADR 0001](/contributing/adr/0001-capacitor-over-expo).

## Prerequisites

- Node 22 and pnpm 10 (the repo toolchain).
- **Android:** JDK 21 (`brew install --cask zulu@21`, then
  `export JAVA_HOME=$(/usr/libexec/java_home -v 21)`), the Android SDK, and an emulator (AVD).
- The app's Clerk key in `code/projects/web/surfaces/app/.env.local` — the dev scripts read
  `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` from it.
- **iOS:** Xcode 27 (its simulator app is **DeviceHub**).

## Run on Android

1. Start the backend + website: `pnpm dev` (website :3000, api :8787).
2. Start the app surface: `pnpm --filter @indiecrafts/web-surfaces-app dev --port 3002`.
3. Boot an emulator: `emulator @qa` (any AVD works).
4. Build and launch the shell: `pnpm --filter @indiecrafts/mobile-surfaces-main android`.

The `android` script builds `www/`, runs `cap sync`, installs the debug APK with Gradle,
runs `adb reverse` for ports 3000, 3002 and 8787, then launches the app. The emulator then
reaches your Mac on `localhost`, so Clerk's dev instance, the api and the website's legal
pages all work unchanged. It skips `cap run`: that command can restart the adb server
and drop the forwarded ports. With several devices attached, set `ANDROID_SERIAL=<serial>`.

## Run on iOS

1. Boot a simulator: `xcrun simctl boot "iPhone 16"` (`xcrun simctl list devices` lists them).
2. Run `pnpm --filter @indiecrafts/mobile-surfaces-main ios`.

The `ios` script builds `www/`, runs `cap sync`, builds the app with `xcodebuild`, installs and
launches it on the booted simulator with `simctl`, then opens **DeviceHub** — the Xcode 27 app that
replaces `Simulator.app` (it skips `cap run ios`, which still looks for `Simulator.app`). The
simulator shares the Mac's network, so `localhost` works without port forwarding.

Deep link from the Mac: `xcrun simctl openurl booted "indiecrafts://sign-in"` — the URL is
`indiecrafts://<path>`, so this opens `/sign-in`. iOS asks "Open in …?" first.

## Ship to TestFlight

TestFlight installs a signed build on real iPhones. The build loads a **hosted** `app` URL — never
`localhost`.

1. **Apple Developer Program** — enroll at developer.apple.com/programs (paid, yearly). Then Xcode →
   Settings → Accounts → add the Apple ID; the team appears.
2. **App record** — App Store Connect → Apps → **+** → New App: iOS, the app name, bundle id
   `dev.indiecrafts.app` (`shell.json` `appId`; `pnpm project:rename` changes it), a SKU.
3. **Point the build at the hosted app** — from `code/projects/mobile/surfaces/main`:

   ```bash
   export CAP_SERVER_URL=https://<deployed app URL>          # e.g. the dev Worker
   export CAP_CLERK_PUBLISHABLE_KEY=<that app's Clerk publishable key>
   pnpm www && npx cap sync ios && npx cap open ios
   ```

4. **Sign** — in Xcode, target **App** → Signing & Capabilities → Team = yours, "Automatically manage
   signing" on. General → Identity: set Version (e.g. `1.0`) and Build (`1`, then +1 on every upload).
5. **Archive + upload** — destination **Any iOS Device (arm64)** → Product → **Archive** → Organizer →
   **Distribute App** → **TestFlight Internal Only** (or TestFlight & App Store) → Upload.
6. **Test** — App Store Connect → TestFlight: wait for processing (10–30 min), answer the
   export-compliance question (the shell only uses HTTPS), add **internal testers** (your team, no
   review). They install the TestFlight app and accept the invite. External testers need Beta App
   Review first.

A release build uses production values: the prod `app` URL and the prod Clerk key (its Frontend API
host goes in `server.allowNavigation` automatically). App Store review (guideline 4.2, minimum
functionality) looks harder at pure web wrappers than TestFlight does.

## Physical device

Connect it over USB, then run the Android steps with `ANDROID_SERIAL=<serial>`
(`adb devices` lists it). `adb reverse` works the same over USB.

## Configuration

| File                              | Holds                                                                                                                                                 |
| --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `shell.json`                      | The app identity — `appId`, `appName`, `scheme`. `pnpm project:rename` rewrites it and the native projects.                                           |
| `CAP_SERVER_URL` (env)            | The URL the shell loads. Required; the dev scripts set `http://localhost:3002`.                                                                       |
| `CAP_CLERK_PUBLISHABLE_KEY` (env) | The app's Clerk publishable key. Required; its Frontend API host goes in `server.allowNavigation`, so Clerk's session handshake stays in the WebView. |
| `messages/<locale>.json`          | The offline page copy. `pnpm --filter @indiecrafts/mobile-surfaces-main www` renders `www/offline.html`.                                              |
| `android/`, `ios/`                | The native projects, committed. `www/` is generated and git-ignored.                                                                                  |

## Limits

- The shell needs a network. A failed first load shows the bundled offline page with a
  Retry button; after that, the app's own offline banner covers drops.
- **Branding.** The service screens show the logo configured in Sanity (`siteSettings.logo`,
  `logoDark` for dark mode): `pnpm www` puts it on the offline page and re-renders the native
  splash images when it changes (`brand.lock.json` records which logo they came from). The app's
  404 and error screens show the same logo. Change the logo in Sanity, run `pnpm www`, commit the
  splash images.
- Sign-in is password or an email code — social OAuth does not run inside a web view.
- A public App Store release needs one real native feature (Apple Guideline 4.2) and a
  release pipeline. Both belong to a later spec.
