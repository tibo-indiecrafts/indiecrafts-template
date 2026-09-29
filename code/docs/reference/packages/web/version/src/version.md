---
title: "Version-check core"
description: "The string-identity compare and the /api/version response shape the update prompt uses."
status: stable
---

# Version-check core

> Is a new build live? One string comparison answers it.

## Purpose

The core of the "new version available" prompt. A deploy stamps a new opaque id (the commit sha, else the version), so any bundle whose baked-in id differs from the live one is stale — string identity, never semver. Zero React or Next coupling; `use-version-check` owns the polling.

## Exports

- `VersionResponse` — the `/api/version` response shape (`{ version?, commit? }`).
- `VERSION_ENDPOINT` — the conventional endpoint path, `/api/version`.
- `versionId(res)` — the live id from a response: `commit` preferred, else `version`.
- `isUpdateAvailable(current, latest)` — true when the live id is known and differs from `current`.

## Source

`code/packages/web/version/src/version.ts`
