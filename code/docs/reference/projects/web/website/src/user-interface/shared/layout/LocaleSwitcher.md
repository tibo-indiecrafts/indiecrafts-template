---
title: "Locale switcher"
description: "Dropdown control that switches the active locale and persists the choice to a signed-in user's profile."
status: stable
---

# Locale switcher

> The language dropdown in the header.

## Purpose

Switches the active locale. The shared switch logic (prefix swap plus blog translated-slug) lives in `@indiecrafts/packages-web-i18n` and is read from context (injected by `LocaleSwitchBoundary`). The choice is also persisted to a signed-in user's Clerk metadata (via `usePersistLocale`) so their transactional and auth emails follow their current language; it is a no-op when signed out.

## Exports

- `LocaleSwitcher` — the switcher component; optional `shape` (`icon` or `code`), `size`, `variant`, and `className`.
- `LocaleSwitcherProps` — the props type.

## Usage

```tsx
import { LocaleSwitcher } from "@/user-interface/shared/layout/LocaleSwitcher";

<LocaleSwitcher className="size-10" />;
```

## Source

`code/projects/web/surfaces/website/src/user-interface/shared/layout/LocaleSwitcher.tsx`
