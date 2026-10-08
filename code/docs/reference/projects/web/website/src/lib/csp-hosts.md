---
title: "CSP host allowlist"
description: "The website's Content-Security-Policy host allowlist shared by next.config and the proxy."
status: stable
---

# CSP host allowlist

> One source of truth for the extra CSP hosts the site is allowed to load.

## Purpose

Declares the website's CSP host allowlist so the nonce-based proxy CSP and the static `/studio` CSP always carry the same extra hosts. It covers featured-video frame sources, Sanity-served media, the shared api origin (`NEXT_PUBLIC_API_URL`, which the erasure, account and email-preference forms call from the browser), Google Analytics, and an editor-embed host list.

## Exports

- `websiteCspHosts` — a `CspHosts` object listing `frameSrc`, `mediaSrc`, `connectSrc`, `googleAnalytics`, and `embedHosts`.

## Usage

```ts
import { websiteCspHosts } from "@/lib/csp-hosts";

// consumed by next.config securityHeaders + studioCspRule and by src/proxy.ts
const hosts = websiteCspHosts;
```

## Source

`code/projects/web/surfaces/website/src/lib/csp-hosts.ts`
