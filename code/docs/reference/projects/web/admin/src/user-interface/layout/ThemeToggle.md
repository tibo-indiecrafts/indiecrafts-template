---
title: "Admin theme toggle"
description: "Icon-only light/dark toggle that persists the choice to localStorage."
status: stable
---

# Admin theme toggle

> Flip and persist the admin light/dark theme.

## Purpose

An icon-only theme toggle. It reads `document.documentElement.dataset.theme` (set before paint by `THEME_SCRIPT`) through `useSyncExternalStore`, never state-in-effect. Flipping the theme persists it to `localStorage["admin-theme"]` and dispatches a `storage` event so the icon re-renders in the same tab.

## Exports

- `ThemeToggle` — client component taking a `label` (`toggle`, `light`, `dark`).
- `ThemeToggleLabel` — the label type.

## Usage

```tsx
import { ThemeToggle } from "@/user-interface/layout/ThemeToggle";

<ThemeToggle
  label={{
    toggle: t("theme.toggle"),
    light: t("theme.light"),
    dark: t("theme.dark"),
  }}
/>;
```

## Source

`code/projects/web/surfaces/admin/src/user-interface/layout/ThemeToggle.tsx`
