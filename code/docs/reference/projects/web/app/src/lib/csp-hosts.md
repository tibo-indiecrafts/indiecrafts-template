---
title: "App CSP hosts"
description: "The extra origins the app's CSP allows: the website and the api Worker."
status: stable
---

# App CSP hosts

> The app calls two other origins from the browser; the CSP must allow both.

## Purpose

Builds the `CspHosts` the app's proxy passes to `cspHeadersForMode`. The production `connect-src` allows only `'self'`, Sanity and npm. The app also fetches the website's `/api/legal-version` (the live legal version) and the api Worker's `/v1/consent/legal` (the signed-in legal sync), so both origins go in `connectSrc`. An unset or malformed URL is dropped.

## Exports

- `appCspHosts(websiteUrl, apiUrl)` — returns `{ connectSrc }` with the two origins.

## Usage

```ts
import { appCspHosts } from "@/lib/csp-hosts";

cspHeadersForMode(
  env,
  appCspHosts(site.websiteUrl, process.env.NEXT_PUBLIC_API_URL),
  reporting,
  nonce,
  mode,
);
```

## Source

`code/projects/web/surfaces/app/src/lib/csp-hosts.ts`
