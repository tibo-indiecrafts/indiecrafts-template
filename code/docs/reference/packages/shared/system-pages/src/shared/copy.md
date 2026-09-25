---
title: "Shell copy defaults"
description: "Default per-locale status-page copy for the non-CMS shells (mobile)."
status: stable
---

# Shell copy defaults

> The one source of 404/500/offline copy for the non-CMS shells, so their wording never drifts.

## Purpose

Default copy for the status pages, keyed by locale. It is the one source the non-CMS shells (mobile) render, so their 404, 500, and offline wording never drifts apart. The web `website` owns its copy in Sanity, so it does not read this. The shape follows the ICU shape of the apps' `messages/*.json`.

## Exports

- `SHELL_COPY` — a `Record` of locale (`en`, `fr`) to `notFound`, `error`, and `offline` copy.
- `ShellCopy` — the type of one locale's copy bundle.

## Usage

```ts
import { SHELL_COPY } from "@indiecrafts/packages-shared-system-pages/shared";

const copy = SHELL_COPY[locale] ?? SHELL_COPY.en;
```

## Source

`code/packages/shared/system-pages/src/shared/copy.ts`
