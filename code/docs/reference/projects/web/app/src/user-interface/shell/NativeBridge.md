---
title: "NativeBridge"
description: "Wires the Capacitor shell's native events into the app surface — a no-op in a browser."
status: stable
---

# NativeBridge

> The only native code path in the web app.

## Purpose

Mounted once in the app's `[locale]/layout.tsx`. In a browser `Capacitor.isNativePlatform()` is false and it does nothing. Inside the Capacitor shell it maps the Android back button to history (exit at the root), routes custom-scheme deep links to the matching route, opens cross-origin links (legal pages, external sites) in the system browser, sets the status bar, and hides the splash screen the shell keeps up at launch. It also marks `<html>` with `data-native-shell`, where the Clerk appearance hides social sign-in.

The status-bar icons must read on what sits behind them. When the page draws under the bar — iOS, and Android WebView 140+ (Capacitor then sets `--safe-area-inset-top` on `<html>` to the bar height) — they follow the app theme (`data-theme`, the theme toggle), and change with it. An older Android WebView is padded below the bars, so the system-themed window shows there and the style stays `Default`.

## Exports

- `NativeBridge()` — renders `null`; all work happens in one effect.

## Source

`code/projects/web/surfaces/app/src/user-interface/shell/NativeBridge.tsx`
