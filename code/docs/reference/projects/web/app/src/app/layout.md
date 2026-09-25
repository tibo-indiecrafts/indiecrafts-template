---
title: "Root layout passthrough"
description: "The root app-router layout that forwards children to the per-locale layout."
status: stable
---

# Root layout passthrough

> A passthrough root layout; the real shell lives one level down.

## Purpose

The root App Router layout for the `app` surface. It only forwards `children`. The real `<html>`/`<body>` and the Clerk provider live in `[locale]/layout.tsx`, so the provider can read the active locale from params and localize Clerk's UI.

## Exports

- `RootLayout` (default) — returns `children` unchanged.

## Source

`code/projects/web/surfaces/app/src/app/layout.tsx`
