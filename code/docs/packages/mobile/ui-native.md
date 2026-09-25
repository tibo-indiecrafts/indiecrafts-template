---
title: "@indiecrafts/packages-mobile-ui-native — the native design system"
description: "The shadcn-for-React-Native brick — the mobile (Expo) counterpart of the web ui shadcn brick."
status: stable
---

# `@indiecrafts/packages-mobile-ui-native` — the native design system

The **shadcn-for-React-Native** brick — the mobile (Expo) counterpart of the web
[`ui`](/packages/web/ui) shadcn brick. StyleSheet components over the **same** design tokens as web
([`ui-tokens`](/packages/shared/ui-tokens)), so native and web share one palette. **Scope `mobile/`** —
React-Native-only (it can't run on web/server).

|                |                                                                                                                                                          |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Exports**    | `.` → the theme runtime + the shell component set. `./theme` → the theme runtime alone.                                                                  |
| **Theme**      | `ThemeProvider` (follows the OS light/dark via `useColorScheme`, or a forced `name`) · `useTheme()` · `useColor(token)` — over `ui-tokens/native` (hex). |
| **Components** | `Screen` (themed full-bleed root) · `ThemedText` (`body`/`title`/`eyebrow`/`muted`) · `Button` (`primary`/`secondary`/`outline`/`destructive`) · `Card`. |
| **Consumers**  | `mobile` (the app shell + [`system-pages/native`](/packages/shared/system-pages)).                                                                       |

## Why a separate brick (not a fork of `ui`)

shadcn/ui is **DOM-only** (Radix + Tailwind classes) — it can't render on React Native. So native
gets a **parallel** set, scoped `mobile/` because the dependency graph diverges (RN primitives, no
Radix). The web `ui` brick stays untouched. What they **share** is the token layer: both read the
semantic names (`background`/`foreground`/`primary`/…) from one `tokens.json`.

## Styling transport — StyleSheet now, NativeWind later

The components use RN `StyleSheet` + `useTheme()` today (zero extra deps, works immediately).
**NativeWind** (`className`, Tailwind-on-RN) is the drop-in upgrade: `ui-tokens` already emits
[`nativewind.css`](/packages/shared/ui-tokens) (`:root` + `.dark:root` hex vars) whose token names match shadcn's,
so adopting it is a config wire, not a re-theme. Grow the component set as native screens land — this
is the **shell start**, not full shadcn parity.

## Wiring (mobile app)

```tsx
import { ThemeProvider, Screen, ThemedText, Button } from "@indiecrafts/packages-mobile-ui-native";

<ThemeProvider>
  <Screen>
    <ThemedText variant="title">Hello</ThemedText>
    <Button label="Go" onPress={…} />
  </Screen>
</ThemeProvider>;
```

The tokens come from `ui-tokens` (`pnpm tokens:build` regenerates them); never hard-code a colour.

## Accessibility (baseline)

The primitives ship the a11y baseline so screens inherit it:

- **`Button`** — `accessibilityRole="button"` + `accessibilityLabel` (its `label`) + `accessibilityState`
  (disabled announced, not by opacity alone; an optional `selected` for a segmented / toggle choice, so the
  pick is announced, never by colour alone) + an optional `accessibilityHint`; a **44 pt** touch target.
- **`ThemedText variant="title"`** — `accessibilityRole="header"` (screen-reader heading navigation);
  override via the `accessibilityRole` prop.
- **`Card` / `Screen`** — transparent containers, so their children stay individually focusable.
- **Dynamic type + contrast** — RN font scaling stays on (never disabled); colours come from the shared
  OKLCH tokens the `verify:contrast` gate governs. Full rule → the mobile app's
  `.claude/rules/accessibility.md`.
