---
title: "Mobile shell"
description: "How one web codebase — the app surface — ships to Android and iOS through a Capacitor shell, and what lives in shared/ vs web/."
status: stable
---

# Mobile shell

There is **one UI codebase**: the [`app` web surface](/projects/web/app/)
(`code/projects/web/surfaces/app`). The mobile app is a **Capacitor 8 shell** around it, not a
second UI.

## How it fits together

| Part        | Where                                             | Role                                                           |
| ----------- | ------------------------------------------------- | -------------------------------------------------------------- |
| **UI**      | `code/projects/web/surfaces/app`                  | Every screen, string, and flow — the same code in a browser.   |
| **Shell**   | `code/projects/mobile/surfaces/main`              | `server.url` loads the hosted `app`; `CAP_SERVER_URL` sets it. |
| **Bridge**  | `app` `src/user-interface/shell/NativeBridge.tsx` | Owns the native events. A no-op in a browser.                  |
| **Offline** | `www/offline.html` (generated)                    | Shows when the first load fails, with a Retry button.          |

The shell keeps its identity (`appId`, `appName`, `scheme`) in `shell.json`.

## `NativeBridge` — the native events

One client component in the `app` surface. Inside the shell it:

- maps the Android back button to browser history (exits at the root);
- routes a deep link (`<scheme>://path`) to the matching page, via `deepLinkPath`;
- opens a cross-origin link (legal pages, external sites) in the system browser, via `isExternalUrl`;
- sets the status bar and hides the splash screen.

Outside the shell it returns early, so the browser build is unchanged.

## What lives where — `shared/` vs `web/`

Bricks under `code/packages/` sit in one of two scopes:

- **`shared/`** — the api or workers use it too. It has no Next or DOM coupling in its core:
  `config`, `auth`, `format`, `logger`, `security`, `compliance`, `announcement`, and more.
- **`web/`** — browser/Next only: `ui`, `ui-tokens`, `ui-icons`, `system-pages`, `version`, and more.

The shell adds no scope. It runs the `app` surface, so it uses the `web/` bricks through that surface.

## Consequences

- One deploy of `app` updates the mobile content. The shell rebuilds only for native changes.
- Sign-in is password or an email one-time code. Social OAuth does not run in a web view.
- Compliance, announcements, and the update prompt come from `app` — no second implementation.

## Read next

- [Mobile shell (Capacitor)](/projects/mobile/main/) — setup, run, and configuration.
- [ADR 0001 — Capacitor over Expo](/contributing/adr/0001-capacitor-over-expo) — why this shape.
- [Multi-app](/shared/architecture/multi-app) — the brick tiers per surface.
