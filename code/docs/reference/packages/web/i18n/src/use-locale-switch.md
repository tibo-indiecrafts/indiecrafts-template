---
title: "Locale switch hook"
description: "Client hook and provider that switch the URL locale with an injected route resolver."
status: stable
---

# Locale switch hook

> Swaps the URL locale, resolving a content route's counterpart when a resolver is injected.

## Purpose

The shared locale switcher. `useLocaleSwitch` returns a `switchTo` function that re-prefixes the current path for a new locale. When a content route's slug differs per language, it uses a resolver (an explicit argument, else the `LocaleSwitchProvider` context) to navigate to the translated counterpart. Route knowledge lives in the app, so the app injects the resolver rather than this brick knowing module routes.

## Exports

- `TranslatedPathResolver` — type for the app-supplied `(pathname, from, to) => Promise<string | null>` resolver.
- `LocaleSwitchProvider` — client provider that injects the resolver into context.
- `useLocaleSwitch(resolve?)` — hook returning an async `switchTo(nextLocale)` function.

## Usage

```tsx
import { useLocaleSwitch } from "@indiecrafts/packages-web-i18n";

const switchTo = useLocaleSwitch();
await switchTo("fr");
```

## Source

`code/packages/web/i18n/src/use-locale-switch.tsx`
