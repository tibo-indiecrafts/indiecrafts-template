---
title: "Operational settings"
description: "Worker-read retention and TTL settings with version-controlled defaults and per-key bounds."
status: stable
---

# Operational settings

> The defaults and bounds for operator-tunable retention and TTL settings.

## Purpose

Defines the worker-read operational settings: version-controlled defaults plus per-key bounds. The `def` values are the source of truth and the disclosed baseline; the D1 `site_settings` table holds only operator overrides, clamped to each key's range. React-free, so it is safe in a bare Worker. Consumed by the `cron` (defaults) and the `api` (validation and effective values).

## Exports

- `SETTINGS` — the settings table: each key carries `def`, `min`, `max`, and `unit` (`"days"` or `"hours"`). Covers retention windows (audit, consent, erasure, profile, data-request, churn, churn free-text, CSP), SLA warning, and download / confirm TTLs.
- `SettingKey` — the union of setting keys.
- `SETTING_DEFAULTS` — a `SettingKey` to default-value map.
- `coerceSetting(key, raw)` — parse and clamp an override string to its key's range; `null` if unknown or non-integer.
- `effectiveSettings(rows)` — merge database override rows over the defaults, ignoring unknown or invalid rows.

## Usage

```ts
import {
  effectiveSettings,
  coerceSetting,
} from "@indiecrafts/packages-shared-config/shared";

const effective = effectiveSettings([
  { key: "retention.audit_days", value: "180" },
]);
```

## Source

`code/packages/shared/config/src/shared/settings.ts`
