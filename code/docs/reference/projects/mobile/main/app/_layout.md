---
title: "Mobile root layout"
description: "The mobile provider tree and router stack — query, theme, i18n, Clerk, and shell overlays."
status: stable
---

# Mobile root layout

> The provider tree and router stack for the mobile shell.

## Purpose

The Expo Router root layout. It wraps the app in the provider tree: `QueryClientProvider` (TanStack Query) → `ThemePreferenceProvider` → `IntlProvider` (i18n, stored choice else device locale) → the router `Stack`, with the compliance and version overlays mounted on top. When Clerk is configured it wraps the tree in `ClerkProvider`, logs each sign-in once to the EU session store, and mirrors an explicit locale choice to the user's Clerk metadata. It also exposes the Expo Router error boundary as the themed 500 screen.

## Exports

- `default` — `RootLayout`, the Expo Router root layout component.
- `ErrorBoundary` — the Expo Router error boundary, rendering the themed 500 screen.

## Source

`code/projects/mobile/surfaces/main/app/_layout.tsx`
