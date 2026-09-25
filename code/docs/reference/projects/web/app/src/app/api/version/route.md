---
title: "Version endpoint"
description: "The GET endpoint that returns the live deploy's build id for the update-prompt poll."
status: stable
---

# Version endpoint

> Returns the live deploy's build id, uncached.

## Purpose

Returns the running deploy's `version` and `commit` from `buildInfo`. The `@indiecrafts/packages-web-version` `UpdatePrompt` polls this route to notice when a new version shipped while a tab was open. Sends `cache-control: no-store` so a CDN cannot serve a stale id.

## Exports

- `GET` — the request handler.

## Source

`code/projects/web/surfaces/app/src/app/api/version/route.ts`
