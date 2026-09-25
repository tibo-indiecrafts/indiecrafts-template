---
title: "Safe web origin guard"
description: "Returns an origin only when it is HTTPS (or http://localhost), so web hand-offs fail closed on a misbuilt release."
status: stable
---

# Safe web origin guard

> An HTTPS-only guard for the mobile app's web hand-off and version-poll origins.

## Purpose

Guards the origins used for the web hand-offs (account page, legal link-out) and the version poll. A non-TLS origin returns `undefined`, so the caller fails closed (button hidden, no poll) instead of opening an insecure page. `http://localhost` stays allowed for the local dev web stack.

## Exports

- `safeWebOrigin(url)` — returns `url` when it is HTTPS or `http://localhost`, else `undefined`.

## Usage

```ts
import { safeWebOrigin } from "./safe-web-origin";

export const websiteUrl = safeWebOrigin(process.env.EXPO_PUBLIC_WEBSITE_URL);
```

## Source

`code/projects/mobile/surfaces/main/config/safe-web-origin.ts`
