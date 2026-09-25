---
title: "App locale layout"
description: "The [locale] root layout for the app surface: the HTML shell, providers, and compliance overlays."
status: stable
---

# App locale layout

> The per-locale HTML shell that wraps every app-surface route.

## Purpose

This is the root layout for the `[locale]` segment of the `app` surface. It renders `<html lang dir>` and `<body>`, mounts the Clerk and next-intl providers, resolves the geo consent mode from the edge `cf-ipcountry` header, and mounts the session logger, announcement chrome, marketing nudge, shell overlays, and toaster.

## Exports

- `generateStaticParams` — prerender one route tree per configured locale.
- `LocaleLayout` (default) — the async layout: providers, theme script, offline banner, and overlays around `children`.

## Source

`code/projects/web/surfaces/app/src/app/[locale]/layout.tsx`
