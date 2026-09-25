---
title: "Home welcome reader"
description: "Reads the editor-owned home welcome message from Sanity's CDN with a short cache and fail-open."
status: stable
---

# Home welcome reader

> Live-reads the editor's home welcome line, fail-open.

## Purpose

Reads the editor-owned home welcome message (the `appContent` singleton) live from Sanity's CDN with a short per-isolate cache, so an editor's change appears within the TTL without a redeploy. It fails open: an unset project id or any error yields no welcome, never a broken page. It reads the public project id and dataset straight from env.

## Exports

- `getAppWelcome(locale)` — async; resolve the welcome line for a locale, or `null`.
- `pickWelcome(data, locale)` — pure selector; the `web` section wins over `shared`, else `null`.
- `WelcomeData` — the fetched shape (`web` and `shared` locale-text maps, or `null`).

## Usage

```ts
import { getAppWelcome } from "@/lib/welcome";

const welcome = await getAppWelcome(locale);
```

## Source

`code/projects/web/surfaces/app/src/lib/welcome.ts`
