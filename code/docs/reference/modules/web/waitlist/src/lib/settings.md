---
title: "Waitlist settings reader"
description: "React-cached reader for the editor-configurable waitlistSettings singleton."
status: stable
---

# Waitlist settings reader

> Reads the waitlist form copy and enabled toggle from Sanity.

## Purpose

`getWaitlistSettings` reads the editor-configurable `waitlistSettings` singleton — the form copy (`heading`, `description`, `emailPlaceholder`, `nameLabel`, `buttonLabel`, `consentLabel`, `successMessage`, `errorMessage`) plus the Studio `enabled` toggle. It is wrapped in React `cache`, so repeated calls in one render share a single fetch. Server-only.

## Exports

- `getWaitlistSettings()` — async, React-cached; returns the `waitlistSettings` document fields.

## Usage

```ts
import { getWaitlistSettings } from "@indiecrafts/modules-web-waitlist/lib/settings";

const settings = await getWaitlistSettings();
```

## Source

`code/modules/web/waitlist/src/lib/settings.ts`
