---
title: "Admin i18n request config"
description: "Resolves the active locale and its bundled messages for each request on the admin surface."
status: stable
---

# Admin i18n request config

> Per-request locale and messages for the admin surface, from bundled JSON.

## Purpose

Supplies next-intl with the active locale and its chrome for every request. It reads `messages/<locale>.json` directly — the admin surface has no Sanity overlay, so the JSON files are the sole source. next-intl calls it through the plugin in `next.config.ts`.

## Exports

- `default` — a `getRequestConfig` handler returning `{ locale, messages }` for the resolved locale.

## Source

`code/projects/web/surfaces/admin/src/i18n/request.ts`
