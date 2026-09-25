---
title: "Consent event reporting"
description: "Maps stored consent choices to consent events and reports them to the server."
status: stable
---

# Consent event reporting

> Browser-only, fire-and-forget logging of the visitor's consent decision.

## Purpose

Maps a stored consent choice-set to `consent_events` rows and POSTs them to `/api/consent-log`. The category-to-consent-type map is the single source of truth for which cookie categories are logged. The POST is fire-and-forget, so a failed request never blocks the local Consent-Mode write.

## Exports

- `consentEvents(choices)` — builds an array of `{ type, granted }` from the category map; ignores the `necessary` category and unknown keys.
- `reportConsent(choices, version, source?)` — POSTs the events with a decision id; no-ops on the server and when there are no events.

## Usage

```ts
import { reportConsent } from "@indiecrafts/packages-web-compliance/consent/consent-report";

reportConsent({ analytics: true, marketing: false }, "2", "banner");
```

## Source

`code/packages/web/compliance/src/consent/consent-report.ts`
