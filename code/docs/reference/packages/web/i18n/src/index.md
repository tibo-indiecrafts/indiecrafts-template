---
title: "Shared i18n navigation"
description: "Prefix-aware next-intl navigation shim for modules, untyped by design."
status: stable
---

# Shared i18n navigation

> The shared next-intl navigation so modules get `Link` and routing without importing the app.

## Purpose

A thin next-intl navigation layer for modules. It is prefix-aware but not pathname-typed, so modules pass string hrefs or use `localizedPathname`. It reads the same namespaced locale cookie the app's typed routing uses, so a module navigating through this shim shares the app's locale cookie. The app keeps its own typed routing in `src/i18n/routing.ts`.

## Exports

- `routing` — the `defineRouting` config (locales, default locale, prefix, cookie).
- `Link`, `redirect`, `usePathname`, `useRouter`, `getPathname` — navigation helpers from `createNavigation(routing)`.
- `localizedPathname` — re-export from `@indiecrafts/packages-shared-config`.
- `useLocaleSwitch`, `LocaleSwitchProvider`, `TranslatedPathResolver` — re-exports from `./use-locale-switch`.

## Usage

```tsx
import { Link } from "@indiecrafts/packages-web-i18n";

<Link href="/blog">Blog</Link>;
```

## Source

`code/packages/web/i18n/src/index.ts`
