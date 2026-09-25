---
title: "Consent config"
description: "Geo cookie-consent regulation config for this deployment."
status: stable
---

# Consent config

> Names and assigns the cookie-consent regulations, layered over the built-in geo map.

## Purpose

`consent` is this deployment's geo consent configuration. `regulations` adds or overrides named regulations merged over the built-ins (GDPR, UK GDPR, CCPA, None); `overrides` assigns a regulation key to a country or territory (uppercase ISO-3166-1 alpha-2), cascading from a parent country to its territories. The built-in map already covers EU/EEA and UK (opt-in), the US (opt-out), and everything else (none), so an empty config uses the defaults.

## Exports

- `consent` — a `ConsentConfig`; the deployment's regulation overrides and additions.

## Usage

```ts
import { consent } from "@/config";
```

## Source

`code/projects/web/surfaces/website/src/config/consent.ts`
