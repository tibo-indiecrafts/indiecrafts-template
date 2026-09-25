---
title: "i18n request config"
description: "Per-request next-intl config that overlays Sanity chrome on JSON fallbacks."
status: stable
---

# i18n request config

> Resolves the request locale and overlays Sanity `uiMessages` on the bundled JSON.

## Purpose

This is the per-request next-intl configuration. It resolves the active locale (falling back to the default), then loads the bundled `messages/<locale>.json` as the resilience net and overlays the Sanity-owned chrome strings (`uiMessages.<locale>`, via `getUiMessages`) on top with `overlayMessages`. Sanity is the edit surface; the JSON file keeps the chrome from blanking on a Sanity hiccup. next-intl calls this automatically via the plugin in `next.config.ts`.

## Exports

- `default` — the `getRequestConfig` handler; returns `{ locale, messages }` per request.

## Source

`code/projects/web/surfaces/website/src/i18n/request.ts`
