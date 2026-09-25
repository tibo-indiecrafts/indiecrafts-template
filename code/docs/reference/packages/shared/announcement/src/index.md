---
title: "Announcement package entry"
description: "Public barrel for the portable announcement core: types, resolvers, GROQ, and the fetch client."
status: stable
---

# Announcement package entry

> The single import surface for the React and Next-free announcement core.

## Purpose

Re-exports the portable announcement core so the Next server readers and the bare `code/shared/api` Worker import the same logic. The web presentation (schema, `AnnouncementBar`, `AnnouncementToast`) lives in `@indiecrafts/packages-web-announcement`, not here.

## Exports

- `SURFACES`, `Surface` — the target surfaces and their union type.
- `resolveBanner`, `resolveToast` — the pure resolve path.
- `bannerQuery`, `toastQuery` — the GROQ strings.
- `fetchAnnouncements` — the public-endpoint fetch client.
- Types: `AnnouncementLink`, `BannerItem`, `Banner`, `Toast`, `AnnouncementPayload`, and the raw Sanity shapes (`RawLocaleString`, `RawLink`, `RawBannerItem`, `RawBanner`, `RawToast`).

## Usage

```ts
import {
  resolveBanner,
  bannerQuery,
  type Surface,
} from "@indiecrafts/packages-shared-announcement";
```

## Source

`code/packages/shared/announcement/src/index.ts`
