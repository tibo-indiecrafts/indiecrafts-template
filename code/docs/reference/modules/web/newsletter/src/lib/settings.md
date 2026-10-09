---
title: "Newsletter settings reader"
description: "React-cached reader for the editor-configurable newsletterSettings singleton."
status: stable
---

# Newsletter settings reader

> Reads the newsletter's Studio `enabled` switch from Sanity.

## Purpose

`getNewsletterSettings` reads the editor-configurable `newsletterSettings` singleton's `enabled` switch. `/api/newsletter`, `/api/newsletter/confirm` and the confirm page answer 404 when it is `false`; unset reads as on. It is wrapped in React `cache`, so repeated calls in one render share a single fetch. Server-only.

## Exports

- `getNewsletterSettings()` — async, React-cached; returns `{ enabled }` (or `null`).

## Usage

```ts
import { getNewsletterSettings } from "@indiecrafts/modules-web-newsletter/lib/settings";

const settings = await getNewsletterSettings();
```

## Source

`code/modules/web/newsletter/src/lib/settings.ts`
