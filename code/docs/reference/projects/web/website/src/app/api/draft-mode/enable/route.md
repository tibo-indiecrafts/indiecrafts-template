---
title: "Draft mode enable endpoint"
description: "Enters Sanity draft preview so the Studio can live-edit content."
status: stable
---

# Draft mode enable endpoint

> The Studio's Presentation tool calls this to open a live-editing session.

## Purpose

Enters Sanity draft preview. The Studio's Presentation tool calls this route with a preview secret and target pathname to open a live-editing session, delegating to `next-sanity`'s `defineEnableDraftMode`. It is gated by `features.studio`: it returns `404` when the Studio feature is off, and `503` when the Studio is on but `SANITY_API_READ_TOKEN` is not set — flagging the misconfig instead of a confusing `500`.

## Exports

- `GET` — enables draft mode via the Sanity handler, or returns `404` / `503`.

## Source

`code/projects/web/surfaces/website/src/app/api/draft-mode/enable/route.ts`
