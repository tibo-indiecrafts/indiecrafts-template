---
title: "Announcement types"
description: "The resolved, platform-agnostic announcement shapes and the raw Sanity shapes."
status: stable
---

# Announcement types

> Data-only shapes shared by every surface and the API Worker.

## Purpose

Defines the resolved announcement shapes and the raw Sanity result shapes. It is React and Next-free — only data — so the website, app, mobile, and the `code/shared/api` Worker all reference one contract.

## Exports

- `SURFACES` / `Surface` — the target surfaces (`website`, `app`, `mobile`); admin is intentionally not a surface.
- `RawLocaleString` — a per-locale string as authored in Sanity.
- `AnnouncementLink` — one resolved link (internal path or external URL).
- `BannerItem` — one resolved banner item (text, optional discount code, optional link).
- `Banner` — the resolved banner strip; empty `items` means show nothing.
- `Toast` — the resolved rich toast (title, body, optional image and link).
- `AnnouncementPayload` — the endpoint payload (`banner` plus `toast`).
- Raw shapes: `RawLink`, `RawBannerItem`, `RawBanner`, `RawToast`.

## Usage

```ts
import type {
  Banner,
  AnnouncementPayload,
} from "@indiecrafts/packages-shared-announcement";
```

## Source

`code/packages/shared/announcement/src/types.ts`
