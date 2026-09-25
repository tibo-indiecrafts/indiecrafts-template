---
title: "Message key type"
description: "Type that models dotted paths into the runtime message tree, derived from messages/en.json."
status: stable
---

# Message key type

> `MessageKey` — dotted paths into the message tree, autocompleted from `messages/en.json` but open to any string.

## Purpose

Exports the `MessageKey` type, dotted paths into the runtime message tree. The known paths are derived from `messages/en.json` (the single source of truth). The `(string & {})` fallback keeps autocomplete biased toward known keys while still accepting any string — needed because the components library ships example configs with block paths only resolved by Storybook. Production app code is encouraged to use known paths so autocomplete catches typos in route configs and section mountings.

## Exports

- `MessageKey` — `DotPath<typeof globalEn> | (string & {})`.

## Usage

```ts
import type { MessageKey } from "@/types/messages";

const namespace: MessageKey = "pages.home.blocks.cta";
```

## Source

`code/projects/web/surfaces/website/src/types/messages.ts`
