---
title: "Sanity read client"
description: "The read-only Sanity client used to fetch published content in server components."
status: stable
---

# Sanity read client

> A shared read-only Sanity client for server-side content fetches.

## Purpose

Creates the read-only Sanity client for fetching published content in server components. `useCdn: false` keeps ISR and RSC revalidation predictable. `perspective: "published"` is pinned: with a token, an API version before 2025-02-19 defaults to `raw`, which returns drafts too (the sitemap and `generateStaticParams` read through this client). `stega.studioUrl` enables visual-editing pings so the Studio Presentation tool can click from a rendered field to its source. The read token is read inline from `process.env` so the module stays importable from both server and client code; on the client the unprefixed env var is stripped and the client makes anonymous requests.

## Exports

- `client` — the configured read-only Sanity client.

## Usage

```ts
import { client } from "@indiecrafts/packages-web-sanity/client";

const posts = await client.fetch(`*[_type == "post"]`);
```

## Source

`code/packages/web/sanity/src/client.ts`
