---
title: "Version endpoint"
description: "Returns the live deploy's build id so open tabs can notice a new release."
status: stable
---

# Version endpoint

> Served with no-store so a CDN cannot hand back a stale build id.

## Purpose

Returns the live deploy's build id. The version package's `UpdatePrompt` polls this route to notice when a new version shipped while a tab was open. The response carries the `version` and `commit` from `buildInfo` and is served `no-store`, so a CDN cannot serve a stale id — each deploy bakes its own `buildInfo`.

## Exports

- `GET` — returns the current `version` and `commit`.

## Source

`code/projects/web/surfaces/website/src/app/api/version/route.ts`
