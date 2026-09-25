---
title: "Site header"
description: "Fixed production site header with Sanity-driven navigation, locale switcher, theme toggle, and auth menu."
status: stable
---

# Site header

> The production header — nav, locale, theme, and auth, fixed at the top.

## Purpose

Renders the site header: logo, navigation (from the `navigation` singleton in Sanity, resolved by `getNavigation`), locale switcher, theme toggle, and the auth menu. Header items are plain links or dropdown groups; dropdown children may carry an icon and a short description. The desktop `NavigationMenu` is `lg`-only; below `lg` the same items open in a Radix `Sheet` via the hamburger, so the nav never overflows a narrow viewport. Fixed at the top — `DefaultLayout`'s `<main>` adds `pt-14 lg:pt-20` to clear the header height.

## Exports

- `Header` — the header component; props include `name`, `logo` / `logoDark`, `items`, `showThemeToggle`, `themeModes`, and `showLocaleSwitcher` (theme and locale flags are resolved server-side).

## Usage

```tsx
import { Header } from "@/user-interface/shared/layout/Header";

<Header
  name={name}
  items={nav.header}
  showThemeToggle={showThemeToggle(cfg)}
  themeModes={themeModes(cfg)}
/>;
```

## Source

`code/projects/web/surfaces/website/src/user-interface/shared/layout/Header.tsx`
