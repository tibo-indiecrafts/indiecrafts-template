---
title: "Theme toggle"
description: "Dropdown that switches between the Sanity-configured theme modes without a hydration flash."
status: stable
---

# Theme toggle

> The light / dark theme control in the header.

## Purpose

Switches between the selectable theme modes (light, dark), whose set is resolved server-side from Sanity via `themeModes(cfg)`. It reads and writes the theme through `next-themes` and uses `useSyncExternalStore` to avoid setting state in an effect, so there is no hydration flash. Before an explicit pick the theme is "system", and the menu highlights the OS-resolved theme.

## Exports

- `ThemeToggle` — the toggle component; props `modes` (selectable modes in menu order), optional `size`, `variant`, and `className`.
- `ThemeToggleProps` — the props type.

## Usage

```tsx
import { ThemeToggle } from "@/user-interface/shared/layout/ThemeToggle";

<ThemeToggle modes={themeModes(cfg)} className="size-10" />;
```

## Source

`code/projects/web/surfaces/website/src/user-interface/shared/layout/ThemeToggle.tsx`
