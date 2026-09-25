---
title: "Newsletter settings reader"
description: "React-cached reader for the editor-configurable newsletterSettings singleton."
status: stable
---

# Newsletter settings reader

> Reads the newsletter form copy and enabled toggle from Sanity.

## Purpose

`getNewsletterSettings` reads the editor-configurable `newsletterSettings` singleton — the form copy (`heading`, `description`, `buttonLabel`, `consentLabel`, `successMessage`) plus the Studio `enabled` toggle. It is wrapped in React `cache`, so repeated calls in one render share a single fetch. Server-only.

## Exports

- `getNewsletterSettings()` — async, React-cached; returns the `newsletterSettings` document fields.

## Usage

```ts
import { getNewsletterSettings } from "@indiecrafts/modules-web-newsletter/lib/settings";

const settings = await getNewsletterSettings();
```

## Source

`code/modules/web/newsletter/src/lib/settings.ts`
