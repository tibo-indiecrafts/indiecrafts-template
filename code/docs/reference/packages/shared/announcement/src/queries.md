---
title: "Announcement GROQ queries"
description: "Plain GROQ strings for the announcement bar and toast singletons."
status: stable
---

# Announcement GROQ queries

> The two GROQ strings that read the announcement singletons from Sanity.

## Purpose

Holds the GROQ for the `announcementBar` and `announcementToast` singletons as plain strings. It avoids `next-sanity` `defineQuery` so the bare `code/shared/api` Worker can import it as well as the Next readers. The copy fields are `localeString` and `localeText`, resolved per request in `resolve.ts`.

## Exports

- `bannerQuery` — reads the `announcementBar` singleton: enable, schedule, style, surfaces, and the items array.
- `toastQuery` — reads the `announcementToast` singleton: title, body, image, link, surfaces, window, and dismiss delay.

## Usage

```ts
import { bannerQuery } from "@indiecrafts/packages-shared-announcement";

const raw = await sanityClient.fetch(bannerQuery);
```

## Source

`code/packages/shared/announcement/src/queries.ts`
