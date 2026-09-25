---
title: "Home welcome fetch"
description: "Reads the editor-owned home welcome from Sanity's public CDN, resolved to the active locale, failing open to null."
status: stable
---

# Home welcome fetch

> The Sanity home-welcome read for the mobile home screen.

## Purpose

Reads the editor-owned home welcome (the `appContent` singleton) from Sanity's public CDN, resolved to the active locale. It never throws (fail-open): an unset project id or any error returns `null`, and the home screen shows its own message-file subtitle instead. The web app and this screen read the same singleton from the same Sanity project.

## Exports

- `pickWelcome(data, locale)` — resolves the welcome for a locale; the `mobile` section wins over `shared`.
- `getWelcome(locale)` — fetches and resolves the welcome, returning `Promise<string | null>`.

## Usage

```ts
import { getWelcome } from "@/lib/welcome";

const welcome = await getWelcome(locale);
```

## Source

`code/projects/mobile/surfaces/main/lib/welcome.ts`
