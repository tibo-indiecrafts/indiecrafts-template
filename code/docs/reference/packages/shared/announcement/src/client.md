---
title: "Announcement HTTP client"
description: "Isomorphic fetch that reads the public announcement endpoint for the client-gated surfaces."
status: stable
---

# Announcement HTTP client

> The one fetch the app and mobile surfaces use to read live announcements.

## Purpose

Reads the `code/shared/api` Worker's public `GET /v1/announcements` endpoint. Isomorphic (uses the global `fetch` on browser, React Native, and Node) and never throws — a network failure or an unset base URL yields `null`, meaning show nothing. The endpoint is public, so no token is sent.

## Exports

- `fetchAnnouncements(baseUrl, { locale, surface })` — resolves to an `AnnouncementPayload` or `null`. Returns `null` when `baseUrl` is missing, the response is not `ok`, or the request throws.

## Usage

```ts
import { fetchAnnouncements } from "@indiecrafts/packages-shared-announcement";

const payload = await fetchAnnouncements(process.env.API_URL, {
  locale: "en",
  surface: "mobile",
});
// payload is AnnouncementPayload | null
```

## Source

`code/packages/shared/announcement/src/client.ts`
