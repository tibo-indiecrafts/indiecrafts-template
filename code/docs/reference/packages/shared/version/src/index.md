---
title: "Version-check core"
description: "The portable version-compare core and the /api/version response shape shared by every shell's update prompt."
status: stable
---

# Version-check core

> A zero-dependency version compare shared by every shell's "new version available" prompt.

## Purpose

The portable version-check core, shared by every shell's update prompt (the web `app` surface and the Expo shell). The compare is string identity: a deploy stamps a new opaque id (commit sha, else version), and any bundle whose baked-in id differs from the live one is stale. It is not semver. The poll mechanism stays per-platform; this file is the whole portable surface, with no React or Next coupling.

## Exports

- `VersionResponse` — the `/api/version` response shape: `{ version?, commit? }`.
- `VERSION_ENDPOINT` — the conventional endpoint path a shell polls (`/api/version`).
- `versionId(res)` — the live deploy's id from a response; `commit` preferred, else `version`, else `null`.
- `isUpdateAvailable(current, latest)` — true when the live id is known and differs from this bundle's `current`.

## Usage

```ts
import {
  isUpdateAvailable,
  versionId,
  VERSION_ENDPOINT,
} from "@indiecrafts/packages-shared-version";

const res = await fetch(VERSION_ENDPOINT).then((r) => r.json());
if (isUpdateAvailable(currentId, versionId(res))) {
  // prompt the user to reload
}
```

## Source

`code/packages/shared/version/src/index.ts`
