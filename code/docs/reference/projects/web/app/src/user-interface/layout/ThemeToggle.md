---
title: "Theme toggle"
description: "An icon-only light/dark toggle that reads and writes the pre-paint theme state."
status: stable
---

# Theme toggle

> Icon-only light/dark toggle, no flash.

## Purpose

Renders an icon button that flips between light and dark. It reads `document.documentElement.dataset.theme` (set before paint by `THEME_SCRIPT`) through `useSyncExternalStore`, persists the choice to `localStorage["app-theme"]`, and dispatches a `storage` event so the icon re-renders in the same tab.

## Exports

- `ThemeToggle` — the toggle component. Prop: `label` of type `ThemeToggleLabel`.
- `ThemeToggleLabel` — type: `{ toggle: string; light: string; dark: string }`.

## Usage

```tsx
import { ThemeToggle } from "@/user-interface/layout/ThemeToggle";

<ThemeToggle
  label={{ toggle: "Toggle theme", light: "Light", dark: "Dark" }}
/>;
```

## Source

`code/projects/web/surfaces/app/src/user-interface/layout/ThemeToggle.tsx`
