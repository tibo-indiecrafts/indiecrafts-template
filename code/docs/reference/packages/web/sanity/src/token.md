---
title: "Sanity tokens"
description: "Server-only Sanity read and preview tokens for draft mode and live preview."
status: stable
---

# Sanity tokens

> The draft-mode read and browser preview tokens, read from the environment.

## Purpose

Reads the Sanity tokens used by draft mode and live preview. `token` is the read token (`SANITY_API_READ_TOKEN`, Viewer role is enough), needed only by draft-mode routes and `sanityFetch`. `previewToken` is the browser-exposed preview token; it prefers a dedicated minimal-scope token so the main read token never reaches the browser, and falls back to `token` when unset. The module is `server-only`.

## Exports

- `token` — the Sanity read token, or `undefined` when unset.
- `previewToken` — the browser preview token, falling back to `token`.

## Usage

```ts
import { token, previewToken } from "@indiecrafts/packages-web-sanity/token";
```

## Source

`code/packages/web/sanity/src/token.ts`
