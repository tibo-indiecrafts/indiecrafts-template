---
title: "Settings page"
description: "Admin route that reads the operational retention, ops, and TTL settings from the shared api."
status: stable
---

# Settings page

> The admin screen for the operational settings.

## Purpose

This is the `/settings` segment of the admin dashboard. It reads the operational retention/ops/TTL settings from the shared api server-side (the api holds the token), then renders them through `SettingsForm`. Edits go through the `saveSetting` server action, so the token never reaches the browser.

## Exports

- `default` — `SettingsPage`, an async server component for the admin `/settings` route. Not imported by other code; Next.js renders it for the segment.

## Source

`code/projects/web/surfaces/admin/src/app/[locale]/(dashboard)/settings/page.tsx`
