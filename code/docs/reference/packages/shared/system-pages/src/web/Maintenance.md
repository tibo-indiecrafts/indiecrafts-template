---
title: "Maintenance page (web)"
description: "Presentational web site-wide maintenance page, rendered by an app's /maintenance route."
status: stable
---

# Maintenance page (web)

> The web site-wide maintenance page — token-based, inherits each app's theme.

## Purpose

Renders the site-wide maintenance page for web surfaces. An app's standalone `/maintenance` route renders it when maintenance is on (the build-time `features.maintenance` flag or the live Sanity toggle; see `maintenanceRewrite`). It is presentational and token-based, so it inherits each app's theme. The status pill's pulsing dot holds still under `prefers-reduced-motion`.

## Exports

- `Maintenance` — the DOM maintenance page; takes `MaintenanceProps`.

## Usage

```tsx
import { Maintenance } from "@indiecrafts/packages-shared-system-pages/web";

<Maintenance
  statusLabel="Under maintenance"
  title="We'll be right back"
  body="The site is briefly offline for an update."
  contactLabel="Contact"
  name="Indie Crafts"
  email="hello@example.com"
/>;
```

## Source

`code/packages/shared/system-pages/src/web/Maintenance.tsx`
