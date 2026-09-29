---
title: "Offline page renderer"
description: "Renders the HTML page the Capacitor shell shows when the app surface cannot load."
status: stable
---

# Offline page renderer

> The only page the shell ships itself.

## Purpose

Renders `offline.html` — the page Capacitor shows through `server.errorPath` when the first load fails. Every locale's copy ships inline and the device language picks one, with English as the fallback. The app name and every message are HTML-escaped. The Retry button reloads the app.

## Exports

- `renderOfflinePage({ appName, messages })` — returns the page's HTML string.

## Source

`code/projects/mobile/surfaces/main/scripts/offline-page.mjs`
