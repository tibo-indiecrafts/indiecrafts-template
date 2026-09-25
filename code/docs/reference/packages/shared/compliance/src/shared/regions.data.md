---
title: "Geo regulation data"
description: "The editable geo-to-regulation catalog: regulations, country and territory maps, and territory parents."
status: stable
---

# Geo regulation data

> The data tables a deployment edits; the algorithm lives next door.

## Purpose

The editable geo-to-regulation catalog — the data a deployment edits or extends. The resolution algorithm lives in `regions.ts`. Country and territory codes are ISO-3166-1 alpha-2, as `cf-ipcountry` returns them.

## Exports

- `ConsentMode` (type) — the consent UI behaviour: `"opt-in" | "opt-out" | "none"`.
- `Regulation` (type) — a named regulation (`name` label + `mode`).
- `REGULATIONS` — the built-in regulation catalog keyed by a short id.
- `TERRITORIES` — the parent country to its overseas territories map.
- `CONSENT_REGIONS` — the default country/territory to regulation-key map (anything unlisted resolves to `none`).
- `PARENT_OF` — a territory code to its parent country, for the config cascade.

## Usage

```ts
import {
  REGULATIONS,
  CONSENT_REGIONS,
} from "@indiecrafts/packages-shared-compliance/shared";

CONSENT_REGIONS["FR"]; // → "gdpr"
REGULATIONS.gdpr; // → { name: "GDPR", mode: "opt-in" }
```

## Source

`code/packages/shared/compliance/src/shared/regions.data.ts`
