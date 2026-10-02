---
title: "Announcement resolvers"
description: "Pure transforms that resolve the raw Sanity banner and toast for one surface and locale."
status: stable
---

# Announcement resolvers

> The single resolve path shared by the Next readers and the API Worker.

## Purpose

Turns the raw Sanity result into the resolved shapes for one surface and locale. It computes "live now" from the enable toggle plus date windows, filters by the requesting surface, localizes the copy, resolves links, sizes the CDN image URL, and hashes the result into a `version` so a new announcement re-shows after a prior dismiss. It never throws.

## Exports

- `resolveBanner(raw, { locale, surface, now? })` — returns the resolved `Banner`, or an empty banner when nothing is live.
- `resolveToast(raw, { locale, surface, now? })` — returns the resolved `Toast`, or `null` when nothing is live.
- `SAFE_HREF` — the link rule: a site path (`/…`, not `//…`) or an http(s) / mailto / tel URL. A link that fails it is dropped; the Studio reuses it as a validation.

## Usage

```ts
import { resolveBanner } from "@indiecrafts/packages-shared-announcement";

const banner = resolveBanner(raw, { locale: "en", surface: "website" });
```

## Source

`code/packages/shared/announcement/src/resolve.ts`
