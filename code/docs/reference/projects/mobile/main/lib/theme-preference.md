---
title: "Theme preference provider"
description: "A persisted light/dark/system theme choice that wraps the design-system ThemeProvider."
status: stable
---

# Theme preference provider

> The app-level theme choice, persisted and layered over the native ThemeProvider.

## Purpose

Provides an app-level theme preference — a persisted `"light" | "dark" | "system"` choice that wraps the design-system `ThemeProvider`. `"system"` (the default) follows the OS scheme; `"light"` and `"dark"` force one. The pure logic lives in `./theme-resolve`; persistence lives here over the never-throw `@/lib/storage`, keyed by `STORAGE_KEYS.themePreference`. A user tap cannot be clobbered by a late async hydration read.

## Exports

- `ThemePreferenceProvider` — provides the preference plus setter and renders the resolved `ThemeProvider`.
- `useThemePreference()` — the preference plus setter; throws outside the provider.
- `THEME_PREFERENCES` — re-exported list of valid preferences.
- `ThemePreference` — re-exported preference type.

## Usage

```tsx
import {
  ThemePreferenceProvider,
  useThemePreference,
} from "@/lib/theme-preference";

<ThemePreferenceProvider>{children}</ThemePreferenceProvider>;

const { preference, setPreference } = useThemePreference();
```

## Source

`code/projects/mobile/surfaces/main/lib/theme-preference.tsx`
