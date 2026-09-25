---
title: "Gated delivery entry"
description: "Package entry that verifies a gated-delivery token and resolves the asset URL, re-exporting the token primitives."
status: stable
---

# Gated delivery entry

> Verify a link, then hand back the asset URL.

## Purpose

The package entry of `@indiecrafts/packages-shared-gated-delivery`. It adds a framework-agnostic route helper on top of the token primitives it re-exports. Any failure, a bad token or an unknown asset, returns a `403`, so the caller cannot tell an invalid link from an unknown asset.

## Exports

- `resolveGatedDownload(token, secret, resolveAssetUrl, now?)` — verify the token, then resolve the asset URL via the injected lookup; returns `{ ok: true, url }` or `{ ok: false, status: 403 }`.
- Re-exports everything from `./token` (`signHmac`, `verifyHmac`, `signDownloadToken`, `verifyDownloadToken`).

## Usage

```ts
import { resolveGatedDownload } from "@indiecrafts/packages-shared-gated-delivery";

const result = await resolveGatedDownload(token, secret, (assetId) =>
  lookupAssetUrl(assetId),
);
if (result.ok) redirect(result.url);
```

## Source

`code/packages/shared/gated-delivery/src/index.ts`
