---
title: "Maintenance layout"
description: "Standalone root layout for the /maintenance route, outside the locale segment."
status: stable
---

# Maintenance layout

> Owns its own `<html>`/`<body>` for the maintenance route, sharing the site font system.

## Purpose

`MaintenanceLayout` is the root layout for `/maintenance`. Like `/studio`, the route sits outside `[locale]/`, so this file owns the `<html>` and `<body>` elements directly. It stamps the resolved locale into `lang`/`dir`, applies the shared font classes from `@/lib/fonts`, and lets dark mode fall to the `prefers-color-scheme` tokens in `globals.css` (no `ThemeProvider`).

## Exports

- `default` (`MaintenanceLayout`) — async root layout component; resolves the locale via `maintenanceLocale()` and renders the document shell.

## Source

`code/projects/web/surfaces/website/src/app/maintenance/layout.tsx`
