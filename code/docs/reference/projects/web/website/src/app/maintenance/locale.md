---
title: "Maintenance locale"
description: "Best-effort locale resolver for the standalone /maintenance route."
status: stable
---

# Maintenance locale

> Reads the next-intl locale cookie for a route that runs before next-intl.

## Purpose

`maintenanceLocale` resolves the visitor's locale for `/maintenance`. The route lives outside the `[locale]` segment — the proxy rewrites here before next-intl runs — so this reads next-intl's locale cookie (`localeCookieName`, namespaced by `site.prefix`) and falls back to the default locale. The result feeds `<html lang>` and the translated copy.

## Exports

- `maintenanceLocale()` — async; returns the cookie `Locale` when valid, else `defaultLocale`.

## Usage

```ts
import { maintenanceLocale } from "./locale";

const locale = await maintenanceLocale();
```

## Source

`code/projects/web/surfaces/website/src/app/maintenance/locale.ts`
