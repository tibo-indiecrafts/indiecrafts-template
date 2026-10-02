---
title: "Live Sanity query"
description: "A cached, fail-open live read of a GROQ query from Sanity's CDN."
status: stable
---

# Live Sanity query

> A cached, fail-open live read of a GROQ query from Sanity's CDN.

## Purpose

`liveQuery(query, label)` returns a reader with its own per-isolate cache: 60 s on success, 5 s on failure. An editor's change appears within the TTL, no redeploy. Fail-open: unset `NEXT_PUBLIC_SANITY_PROJECT_ID` / `_DATASET`, a non-200 or a throw → `null`, never an error. Reads only the public project id + dataset. Used by `welcome` and `brand`.

## Exports

- `liveQuery<T>(query, label)` → `() => Promise<T | null>`.

## Source

`code/projects/web/surfaces/app/src/lib/sanity-live.ts`
