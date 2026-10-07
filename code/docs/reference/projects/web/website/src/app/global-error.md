---
title: "Root error boundary"
description: "Last-resort client error boundary that renders the localized 500 page when the locale layout itself throws."
status: stable
---

# Root error boundary

> The `app/global-error.tsx` boundary: the 500 page when the `[locale]` layout fails.

## Purpose

`[locale]/error.tsx` catches errors thrown by a page, but not by the layout it sits in. This boundary catches the rest: an error in `[locale]/layout.tsx` (Clerk, the Sanity settings reads, the messages load). It replaces the root layout, so it renders its own `<html>` and `<body>` and imports `globals.css`.

It has no next-intl provider. It reads the locale from the URL prefix (`/fr/…` → `fr`; no prefix → the default locale) and loads that locale's `messages/<locale>.json` on demand, then shows the same `pages.error` copy as the route boundary through `ErrorContent`. The import is dynamic because this module ships with every page: a static import would add every locale's messages to the first load. It logs the error with `logger.error`, and the retry button calls `reset`.

## Exports

- `GlobalError` (default) — the client error boundary; props are `error` and `reset`.

## Source

`code/projects/web/surfaces/website/src/app/global-error.tsx`
