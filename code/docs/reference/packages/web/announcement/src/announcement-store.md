---
title: "Announcement dismiss store"
description: "Reads and writes the first-party cookies that record which announcement bar or toast version the visitor dismissed."
status: stable
---

# Announcement dismiss store

> Small first-party cookies recording the dismissed bar / toast version, so the layout decides render server-side.

## Purpose

The announcement dismiss deposit. It stores small first-party cookies recording which bar or toast version the visitor closed, so the layout can decide server-side whether to render (no flash). It is framework-free and guarded with `typeof` checks, so the server imports the cookie name and reader while the client imports the writer.

## Exports

- `ANNOUNCEMENT_COOKIE` — the bar dismiss cookie name, namespaced by `site.prefix`.
- `ANNOUNCEMENT_TOAST_COOKIE` — the toast dismiss cookie name, namespaced by `site.prefix`.
- `dismissAnnouncement(version)` — records that this bar version was dismissed (client-side, on close).
- `dismissToast(version)` — records that this toast version was dismissed (client-side, on close).
- `readAnnouncementAck()` — the dismissed bar version; `""` server-side or when never dismissed.
- `readToastAck()` — the dismissed toast version; `""` server-side or when never dismissed.

## Usage

```ts
import {
  dismissAnnouncement,
  readAnnouncementAck,
} from "@indiecrafts/packages-web-announcement/announcement-store";

dismissAnnouncement(banner.version);
const acked = readAnnouncementAck();
```

## Source

`code/packages/web/announcement/src/announcement-store.ts`
