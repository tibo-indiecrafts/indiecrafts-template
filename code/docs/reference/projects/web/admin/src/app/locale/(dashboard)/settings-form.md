---
title: "Settings form"
description: "Client component that edits operational retention, ops, and TTL settings as grouped number inputs."
status: stable
---

# Settings form

> The grouped editor for the operational settings.

## Purpose

A client component used by the admin settings page. It renders operational retention/ops/TTL settings as grouped number inputs and saves each changed field through the `saveSetting` server action. Keys whose retention window is also disclosed in the privacy policy show an inline drift reminder.

## Exports

- `SettingRow` — one row of the api's `GET /v1/settings` response: `key`, `value`, `def`, `min`, `max`, `unit`, `updatedAt`, `updatedBy`.
- `groupSettings` — groups rows by their key's dot-prefix in arrival order.
- `SettingsForm` — client component; takes `settings: SettingRow[]` and renders the editor.

## Usage

```tsx
import { SettingsForm, type SettingRow } from "../settings-form";

const settings: SettingRow[] = await fetchSettings();
return <SettingsForm settings={settings} />;
```

## Source

`code/projects/web/surfaces/admin/src/app/[locale]/(dashboard)/settings-form.tsx`
