---
title: "Locale switcher"
description: "A dropdown that switches the active locale while preserving the current path."
status: stable
---

# Locale switcher

> Switch the active locale, keeping the current path.

## Purpose

Renders a language-icon dropdown in the dashboard header listing every routing locale. Selecting one persists the choice (cookie, plus the operator's Clerk profile) and replaces the route with the same path under the new locale. This surface has no localized pathnames, so the path is preserved as-is.

## Exports

- `LocaleSwitcher` — the dropdown component. Prop: `label` (string) for the trigger's accessible name.

## Usage

```tsx
import { LocaleSwitcher } from "@/user-interface/layout/LocaleSwitcher";

<LocaleSwitcher label="Change language" />;
```

## Source

`code/projects/web/surfaces/admin/src/user-interface/layout/LocaleSwitcher.tsx`
