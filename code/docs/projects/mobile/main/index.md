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
- **iOS:** Xcode 26.

## Run on Android

1. Start the backend + website: `pnpm dev` (website :3000, api :8787).
2. Start the app surface: `pnpm --filter @indiecrafts/web-surfaces-app dev` (:3002).
3. Boot an emulator: `emulator @qa` (any AVD works).
4. Build and launch the shell: `pnpm --filter @indiecrafts/mobile-surfaces-main android`.

The `android` script runs `adb reverse` for ports 3000, 3002 and 8787, so the emulator
reaches your Mac on `localhost`. The shell, Clerk's dev instance, the api and the
website's legal pages then all work unchanged. It installs on `emulator-5554` unless you
set `ANDROID_TARGET=<serial>`.

## Run on iOS

`pnpm --filter @indiecrafts/mobile-surfaces-main ios` — the simulator shares the Mac's
network, so `localhost` works without port forwarding.

## Physical device

Connect it over USB, then run the Android steps with `ANDROID_TARGET=<serial>`
(`adb devices` lists it). `adb reverse` works the same over USB.

## Configuration

| File                     | Holds                                                                                                       |
| ------------------------ | ----------------------------------------------------------------------------------------------------------- |
| `shell.json`             | The app identity — `appId`, `appName`, `scheme`. `pnpm project:rename` rewrites it and the native projects. |
| `CAP_SERVER_URL` (env)   | The URL the shell loads. Required; the dev scripts set `http://localhost:3002`.                             |
| `messages/<locale>.json` | The offline page copy. `pnpm --filter @indiecrafts/mobile-surfaces-main www` renders `www/offline.html`.    |
| `android/`, `ios/`       | The native projects, committed. `www/` is generated and git-ignored.                                        |

## Limits

- The shell needs a network. A failed first load shows the bundled offline page with a
  Retry button; after that, the app's own offline banner covers drops.
- Sign-in is password or an email code — social OAuth does not run inside a web view.
- A public App Store release needs one real native feature (Apple Guideline 4.2) and a
  release pipeline. Both belong to a later spec.
