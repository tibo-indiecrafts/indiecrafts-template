---
title: "Locale root layout"
description: "Per-locale root layout that wires providers, SEO metadata, and consent chrome."
status: stable
---

# Locale root layout

> The `[locale]/layout.tsx` — the HTML shell, providers, and site-wide chrome for every localized route.

## Purpose

Root layout for the `[locale]` segment. It sets `<html lang>` / `dir`, mounts the Clerk, next-intl, and theme providers, and injects fonts and container tokens. It decides whether to mount Clerk (`shouldLoadClerk`: a signed-in visitor or the sign-in / sign-up pages) and, when it does, wraps the body's content in `LazyClerkProvider` and renders the signed-in legal notice, session logger and marketing nudge from `LazyClerk`; everyone else gets the cookie-based legal notice and no Clerk code. It calls `preloadChrome` first, so the page chrome's Sanity reads start beside the page's own data. It resolves Sanity-driven data (site SEO, settings, cookie consent, version prompt, legal acceptance) and renders the consent chrome: the cookie banner or preferences host, the "policies updated" legal notice, and the update prompt. Google Analytics is injected only when configured, with a CSP nonce. It also emits site-level JSON-LD and mounts the session logger and marketing nudge.

## Exports

- `generateStaticParams` — one entry per routing locale.
- `generateMetadata` — site-wide default metadata, locale-aware, Sanity-sourced.
- `viewport` — device-width viewport with light/dark theme colors.
- `LocaleLayout` (default) — the async layout server component; calls `notFound()` for an unknown locale.

## Source

`code/projects/web/surfaces/website/src/app/[locale]/layout.tsx`
