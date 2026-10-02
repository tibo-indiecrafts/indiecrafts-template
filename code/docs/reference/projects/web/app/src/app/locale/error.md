---
title: "App error screen"
description: "The app's localized error boundary with the configured logo, also shown inside the mobile shell."
status: stable
---

# App error screen

> The app's localized error boundary with the configured logo, also shown inside the mobile shell.

## Purpose

Client error boundary. Renders the shared `ErrorContent` with the logo from `useBrand()` (the layout read it server-side) and bundled copy from `messages.error` — nothing here fetches, so it renders even when Sanity is what failed. Logs the error and offers Retry (`reset`).

## Exports

- default export `ErrorBoundary({ error, reset })`.

## Source

`code/projects/web/surfaces/app/src/app/[locale]/error.tsx`
