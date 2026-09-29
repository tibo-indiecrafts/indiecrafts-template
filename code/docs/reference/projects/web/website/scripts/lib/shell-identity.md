---
title: "Shell identity rename"
description: "Rewrites the Capacitor shell's app id, name, and URL scheme across shell.json and the native projects for a client rename."
status: stable
---

# Shell identity rename

> Makes `pnpm project:rename` ship a renamed client as its own app, not `dev.indiecrafts.app`.

## Purpose

`cap sync` does not copy `appId` into the committed native projects, so a rename must rewrite each file that carries the shell's identity: `shell.json`, the Android `applicationId` (`build.gradle`), the Android `strings.xml` label/package/scheme, the Android deep-link scheme (`AndroidManifest.xml`), the iOS bundle id (`project.pbxproj`), and the iOS display name + scheme (`Info.plist`). The Android Java `namespace` stays — `applicationId` is independent of it. Pure; `project-rename.mjs` reads and writes the files.

## Exports

- `SHELL_IDENTITY_FILES` — the six files, relative to `code/projects/mobile/surfaces/main`.
- `renameShellIdentity(path, text, prefix, slug)` — returns the file text with the identity renamed.

## Source

`code/projects/web/surfaces/website/scripts/lib/shell-identity.mjs`
