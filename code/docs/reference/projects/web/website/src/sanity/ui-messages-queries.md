---
title: "UI messages query"
description: "GROQ query that fetches the whole per-locale UI dictionary document."
status: stable
---

# UI messages query

> Fetches the entire `uiMessages.<locale>` document — every field is a chrome string or nested group.

## Purpose

Defines the single GROQ query that reads the per-locale UI-dictionary document (`uiMessages.en`, `uiMessages.fr`). There is no projection — the whole document is returned. It is read by `getUiMessages` (`src/lib/ui-messages.ts`), which strips the system fields and overlays the result on the bundled `messages/<locale>.json` fallback.

## Exports

- `uiMessagesQuery` — GROQ query for the document at `$id`.

## Usage

```ts
import { uiMessagesQuery } from "@/sanity/ui-messages-queries";
import { sanityFetch } from "@/sanity/live";

const doc = await sanityFetch({
  query: uiMessagesQuery,
  params: { id: "uiMessages.en" },
});
```

## Source

`code/projects/web/surfaces/website/src/sanity/ui-messages-queries.ts`
