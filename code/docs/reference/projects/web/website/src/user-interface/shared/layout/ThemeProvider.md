---
title: "Theme provider"
description: "Thin client wrapper around next-themes with server-resolved props and the per-request CSP nonce."
status: stable
---

# Theme provider

> The app's next-themes boundary.

## Purpose

Wraps `next-themes`' provider. The provider props are resolved server-side in the layout (`themeProviderProps(resolveThemeConfig(settings.themeModes))`) and passed in, so the offered theme modes are Sanity-driven and next-themes' pre-paint blocking script still prevents a flash. The `nonce` is threaded separately (not part of `themeProviderProps`) so the per-request CSP nonce reaches next-themes' raw inline anti-FOUC script — otherwise the enforced CSP (`script-src 'nonce-X'`) would block it.

## Exports

- `ThemeProvider` — the provider wrapper; accepts next-themes' `ThemeProviderProps` plus an optional `nonce`.

## Usage

```tsx
import { ThemeProvider } from "@/user-interface/shared/layout/ThemeProvider";

<ThemeProvider nonce={nonce} {...themeProviderProps(cfg)}>
  {children}
</ThemeProvider>;
```

## Source

`code/projects/web/surfaces/website/src/user-interface/shared/layout/ThemeProvider.tsx`
