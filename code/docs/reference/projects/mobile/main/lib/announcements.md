---
title: "Mobile announcements fetch"
description: "Reads the shared api Worker's public announcements endpoint for the mobile surface."
status: stable
---

# Mobile announcements fetch

> The mobile-surface wrapper over the shared announcement fetch.

## Purpose

Reads the shared api Worker's public `/v1/announcements` for the mobile surface. The fetch and never-throw contract lives once in `@indiecrafts/packages-shared-announcement`; this file injects the mobile env (`EXPO_PUBLIC_API_URL`). It returns `null` when the URL is unset or the device is offline.

## Exports

- `getAnnouncements(locale)` — returns `Promise<AnnouncementPayload | null>` for the mobile surface.

## Usage

```ts
import { getAnnouncements } from "@/lib/announcements";

const payload = await getAnnouncements(locale);
```

## Source

`code/projects/mobile/surfaces/main/lib/announcements.ts`
