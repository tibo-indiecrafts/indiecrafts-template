---
title: "App header"
description: "The sticky app header: the sidebar trigger plus the locale and theme toggles."
status: stable
---

# App header

> A sticky header with the sidebar toggle and the locale and theme toggles.

## Purpose

Async server component that renders the sticky app header: the `SidebarTrigger`, then the `LocaleSwitcher` and `ThemeToggle` pushed to the right. Labels come from the `app` message namespace. It pads by `env(safe-area-inset-top)` (`box-content`, so the bar stays 56px tall): in the iOS shell it sits below the status bar; in a browser the inset is 0.

## Exports

- `AppHeader` — the async server component (no props).

## Usage

```tsx
import { AppHeader } from "@/user-interface/layout/AppHeader";

<AppHeader />;
```

## Source

`code/projects/web/surfaces/app/src/user-interface/layout/AppHeader.tsx`
