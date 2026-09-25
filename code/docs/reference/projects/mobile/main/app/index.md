---
title: "Mobile home screen"
description: "The mobile home screen — shell wiring, editor-owned welcome, and a native share sheet."
status: stable
---

# Mobile home screen

> The mobile home screen, showing the shell wiring.

## Purpose

The mobile home route. It renders the native design-system primitives (`Screen`, `ThemedText`, `Button`, `Card`) with `react-intl` copy. It fetches an editor-owned welcome message from Sanity via TanStack Query (fail-open to the message file), links to Legal, Sign in, and — when signed in — Account, triggers the OS share sheet for the marketing site, and offers the three-way theme preference control.

## Exports

- `default` — the `Index` screen component, rendered by Expo Router at `/`.

## Source

`code/projects/mobile/surfaces/main/app/index.tsx`
