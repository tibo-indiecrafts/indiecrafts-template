---
title: "Typed app routing"
description: "next-intl routing definition plus the app's locale-aware Link, redirect, and pathname helpers."
status: stable
---

# Typed app routing

> The app's single navigation entry point — always import `Link` and friends from here.

## Purpose

Defines the next-intl `routing` object from the shared i18n config and the `PATHNAMES` map assembled in `src/app/routes.ts`. It exports the locale-aware navigation APIs so components never import from `next/link` or `next-intl/navigation` directly.

## Exports

- `routing` — the `defineRouting` result (locales, default locale, prefix, cookie, pathnames).
- `Link` — locale-aware link component from `createNavigation`.
- `redirect` — locale-aware redirect helper.
- `usePathname` — current pathname hook (locale-stripped).
- `useRouter` — locale-aware router hook.
- `getPathname` — resolve a route href to a pathname.
- `getStaticPathname(href, locale)` — typed wrapper that accepts a `StaticAppPathname` and returns its localized path.
- `localizedPathname` — re-exported from `@/config` for existing import sites.

## Usage

```tsx
import { Link, getStaticPathname } from "@/i18n/routing";

<Link href="/contact">Contact</Link>;

const canonical = getStaticPathname("/contact", "en");
```

## Source

`code/projects/web/surfaces/website/src/i18n/routing.ts`
