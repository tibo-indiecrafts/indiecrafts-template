---
title: "i18n routing"
description: "The next-intl routing definition and navigation helpers for the app surface."
status: stable
---

# i18n routing

> The routing table and the locale-aware navigation helpers.

## Purpose

next-intl routing for the `app` surface, at parity with the website's locale detection and redirection (`as-needed` prefixes, `localeDetection`, a namespaced locale cookie), minus the website's localized `pathnames` map. Components import navigation helpers from here, never from `next/link` or `next-intl/navigation`.

## Exports

- `routing` — the `defineRouting` result (locales, default locale, prefix, cookie).
- `Link` — locale-aware link component.
- `redirect` — locale-aware redirect.
- `usePathname` — locale-aware pathname hook.
- `useRouter` — locale-aware router hook.
- `getPathname` — resolve a pathname for a locale.

## Usage

```tsx
import { Link } from "@/i18n/routing";

<Link href="/account">Account</Link>;
```

## Source

`code/projects/web/surfaces/app/src/i18n/routing.ts`
