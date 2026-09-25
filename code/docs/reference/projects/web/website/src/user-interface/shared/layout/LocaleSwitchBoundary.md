---
title: "Locale switch boundary"
description: "Client boundary that injects the app's content-route resolver into the shared locale switcher."
status: stable
---

# Locale switch boundary

> A thin client wrapper that keeps the shared locale switcher route-agnostic.

## Purpose

Injects the app's content-route resolver (`resolveTranslatedPath`) into the shared locale switcher via `LocaleSwitchProvider`, so `@indiecrafts/packages-web-i18n` stays route-agnostic — the foundation package must not know the blog routes. The server layout cannot pass a function prop across the RSC boundary, so this thin client wrapper imports the resolver itself.

## Exports

- `LocaleSwitchBoundary` — client provider component; takes `children`.

## Usage

```tsx
import { LocaleSwitchBoundary } from "@/user-interface/shared/layout/LocaleSwitchBoundary";

<LocaleSwitchBoundary>{children}</LocaleSwitchBoundary>;
```

## Source

`code/projects/web/surfaces/website/src/user-interface/shared/layout/LocaleSwitchBoundary.tsx`
