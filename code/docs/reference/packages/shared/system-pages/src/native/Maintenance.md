---
title: "Maintenance screen (native)"
description: "Presentational React Native full-screen maintenance page, themed from the shared tokens."
status: stable
---

# Maintenance screen (native)

> The native maintenance page — the app resolves the strings, the brick renders them.

## Purpose

Renders the full-screen maintenance page for React Native surfaces. It shares the `MaintenanceProps` copy contract with the web renderer and reads the shared token colours so it is legible in light and dark. An optional `email` renders a `mailto:` contact link.

## Exports

- `Maintenance` — the React Native maintenance page component.

## Usage

```tsx
import { Maintenance } from "@indiecrafts/packages-shared-system-pages/native";

<Maintenance
  statusLabel="Under maintenance"
  title="We'll be right back"
  body="The app is briefly offline for an update."
  contactLabel="Contact"
  name="Indie Crafts"
  email="hello@example.com"
/>;
```

## Source

`code/packages/shared/system-pages/src/native/Maintenance.tsx`
