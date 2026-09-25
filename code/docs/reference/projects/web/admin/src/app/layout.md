---
title: "Admin root layout"
description: "Passthrough root layout that forwards children so the real html/body and Clerk provider live in the locale layout."
status: stable
---

# Admin root layout

> The passthrough root layout that just forwards its children.

## Purpose

This is the admin surface's root layout. It does nothing but return its children. The real `<html>`/`<body>` and the Clerk provider live in the locale layout, so the provider can read the active locale from params and localize Clerk's UI.

## Exports

- `default` — `RootLayout`, forwards `children`. Not imported by other code; Next.js applies it as the root layout.

## Source

`code/projects/web/surfaces/admin/src/app/layout.tsx`
