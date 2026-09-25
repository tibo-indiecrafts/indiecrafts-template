---
title: "UI message overlay"
description: "Deep-merges Sanity uiMessages over the bundled message fallback, keeping the fallback where Sanity is blank."
status: stable
---

# UI message overlay

> Sanity wins where it has a value; a blank field keeps the bundled fallback.

## Purpose

Overlays Sanity-authored `uiMessages` onto the bundled `messages/<locale>.json` fallback. Sanity wins wherever it has a non-empty value; a blank or missing field keeps the fallback, so a half-filled document never ships empty chrome. Recurses into nested groups. Pure — no Sanity imports — so it stays unit-testable in isolation.

## Exports

- `overlayMessages(base, over)` — returns the merged value; `over` wins per key unless empty.

## Usage

```ts
import { overlayMessages } from "@/lib/overlay-messages";

const messages = overlayMessages(bundledMessages, sanityUiMessages);
```

## Source

`code/projects/web/surfaces/website/src/lib/overlay-messages.ts`
