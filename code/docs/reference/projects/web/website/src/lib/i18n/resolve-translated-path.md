---
title: "Translated path resolver"
description: "Resolves a content-detail route to its target-locale path for the shared locale switcher."
status: stable
---

# Translated path resolver

> Keeps the blog route taxonomy in the app, not in the shared i18n shim.

## Purpose

The app's content-route to translated-path resolver, injected into the shared locale switcher via `LocaleSwitchProvider`. It classifies a pathname as a category / tag / series / author / post route, then calls `/api/i18n/translated-slug` to get the target-locale path. Returns `null` for non-content routes (the switcher just re-prefixes the current path) and falls back to the homepage when no translation exists.

## Exports

- `resolveTranslatedPath` — a `TranslatedPathResolver`: `(pathname, from, to) => Promise<string | null>`.

## Usage

```tsx
import { resolveTranslatedPath } from "@/lib/i18n/resolve-translated-path";

<LocaleSwitchProvider resolve={resolveTranslatedPath}>
  {children}
</LocaleSwitchProvider>;
```

## Source

`code/projects/web/surfaces/website/src/lib/i18n/resolve-translated-path.ts`
