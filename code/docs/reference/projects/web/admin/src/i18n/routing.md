---
title: "Admin i18n routing"
description: "next-intl routing and typed navigation helpers for the admin surface."
status: stable
---

# Admin i18n routing

> Locale detection, redirection, and typed navigation for the admin surface.

## Purpose

Defines the admin surface's next-intl routing — `as-needed` locale prefixes, locale detection, and a namespaced locale cookie — with no localized `pathnames` map. It also exports the typed navigation helpers that components import instead of `next/link` or `next-intl/navigation`.

## Exports

- `routing` — the `defineRouting` config (locales, default locale, prefix, detection, cookie).
- `Link` — locale-aware link component.
- `redirect` — locale-aware redirect.
- `usePathname` — current-pathname hook.
- `useRouter` — locale-aware router hook.
- `getPathname` — resolve a pathname for a locale.

## Usage

```ts
import { Link, useRouter } from "@/i18n/routing";
```

## Source

`code/projects/web/surfaces/admin/src/i18n/routing.ts`
