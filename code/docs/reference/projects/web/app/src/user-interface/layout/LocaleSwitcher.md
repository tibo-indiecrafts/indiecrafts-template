---
title: "Locale switcher"
description: "A dropdown that switches the active locale while preserving the current path."
status: stable
---

# Locale switcher

> Switch the active locale, keeping the current path.

## Purpose

Renders a globe icon dropdown listing every routing locale. Selecting one persists the choice and replaces the route with the same path under the new locale. This surface has no localized pathnames, so the path is preserved as-is.

## Exports

- `LocaleSwitcher` — the dropdown component. Prop: `label` (string) for the trigger's accessible name.

## Usage

```tsx
import { LocaleSwitcher } from "@/user-interface/layout/LocaleSwitcher";

<LocaleSwitcher label="Change language" />;
```

## Source

`code/projects/web/surfaces/app/src/user-interface/layout/LocaleSwitcher.tsx`
