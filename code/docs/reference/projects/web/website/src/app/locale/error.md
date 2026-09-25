---
title: "Route error boundary"
description: "Client error boundary that renders the localized 500 page for a locale route."
status: stable
---

# Route error boundary

> The `[locale]/error.tsx` boundary — the branded 500 page shown when a route throws.

## Purpose

Next.js client error boundary for the locale segment. It logs the error with `logger.error` and renders `ErrorContent` (from `@indiecrafts/packages-shared-system-pages`) with a retry button wired to `reset`. Copy comes from bundled `messages/<locale>.json` (`pages.error`), not Sanity, so the 500 page still renders when Sanity is the failure. It provides its own `<main id="main">` because a client boundary cannot use the server `DefaultLayout`.

## Exports

- `ErrorBoundary` (default) — the client error boundary; props are `error` and `reset`.

## Source

`code/projects/web/surfaces/website/src/app/[locale]/error.tsx`
