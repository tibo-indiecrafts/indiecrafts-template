---
title: "Root layout"
description: "Root passthrough layout that forwards children to the locale layout."
status: stable
---

# Root layout

> A passthrough: the real document and providers live in the locale layout.

## Purpose

The app's root layout. It is a passthrough that just forwards its children. The real `<html>` and `<body>` — and the Clerk provider — live in the `[locale]/layout.tsx`, so the provider can read the active locale from the route params and localize Clerk's UI.

## Exports

- `default` (`RootLayout`) — returns the children unchanged.

## Source

`code/projects/web/surfaces/website/src/app/layout.tsx`
