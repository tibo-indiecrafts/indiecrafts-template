---
title: "Offline page renderer"
description: "Renders the HTML page the Capacitor shell shows when the app surface cannot load."
status: stable
---

# Offline page renderer

> The only page the shell ships itself.

## Purpose

Renders `offline.html` — the page Capacitor shows through `server.errorPath` when the first load fails. It is served from the shell's local origin, so the Retry button navigates back to the app server URL (a reload would only reload this page). It also hides the native splash screen, since the app's `NativeBridge` never runs here. Every locale's copy ships inline as script-safe JSON and is set as text (never HTML); the device language picks one, with English as the fallback. The app name is HTML-escaped in the title.

## Exports

- `renderOfflinePage({ appName, messages, serverUrl })` — returns the page's HTML string.

## Source

`code/projects/mobile/surfaces/main/scripts/offline-page.mjs`
