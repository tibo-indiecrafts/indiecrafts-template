---
title: "UI message dictionary"
description: "Fetches the per-locale chrome-string dictionary an editor owns in Sanity, overlaid on the bundled messages fallback."
status: stable
---

# UI message dictionary

> Editor-owned chrome strings from Sanity, deduped per request.

## Purpose

Fetches the per-locale UI dictionary (`uiMessages.<locale>`) — the chrome strings (nav, cookies, validation, blog UI, system pages) an editor now owns. It is the primary source; `src/i18n/request.ts` overlays it on the bundled `messages/<locale>.json` fallback so a Sanity hiccup never blanks the chrome. Sanity system fields are stripped, the result is React-cached per request, and it returns empty on error.

## Exports

- `getUiMessages(locale)` — the per-locale UI message tree from Sanity, React-cached and empty on error.

## Usage

```ts
import { getUiMessages } from "@/lib/ui-messages";

const messages = await getUiMessages(locale);
```

## Source

`code/projects/web/surfaces/website/src/lib/ui-messages.ts`
