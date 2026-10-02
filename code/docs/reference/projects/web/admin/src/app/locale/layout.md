---
title: "Admin locale layout"
description: "Per-locale admin layout that renders html/body and mounts the Clerk provider, intl provider, and theme script."
status: stable
---

# Admin locale layout

> The admin layout that owns html/body and the locale-aware providers.

## Purpose

This layout wraps every admin route under a locale segment. It validates the locale (404 on an unknown one), enables static rendering, and renders the real `<html>`/`<body>`. It mounts `AppClerkProvider` (so Clerk's UI is localized), the next-intl client provider, the no-flash inline theme script under the per-request CSP nonce, and the session logger when Clerk is configured.

## Exports

- `default` — `LocaleLayout`, an async server component. Not imported by other code; Next.js applies it to each locale segment.
- `generateMetadata` — the document title: `<page> · Admin`, or `Admin` for a page without its own title.
- `generateStaticParams` — prerenders one tree per configured locale.

## Source

`code/projects/web/surfaces/admin/src/app/[locale]/layout.tsx`
