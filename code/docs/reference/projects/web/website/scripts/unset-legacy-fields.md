---
title: "Legacy field cleanup"
description: "Unsets fields left in the Sanity dataset after a schema field is removed."
status: stable
---

# Legacy field cleanup

> Removes orphaned document fields after a schema field is dropped.

## Purpose

One-shot cleanup that unsets fields left in the dataset after a schema field is removed. It currently targets one field, `post.modules` (the per-post layout override, replaced by `blog.postModules`). Sanity's CLI has no `documents patch` subcommand, so it uses `@sanity/client` transactions directly. Needs `SANITY_API_WRITE_TOKEN` (Editor role). Do not re-add a `TARGETS` entry for a field name that has since been reused, or the script would delete live data.

## Exports

No public exports (CLI script).

## Usage

```bash
node --env-file=.env.local scripts/unset-legacy-fields.mjs
```

## Source

`code/projects/web/surfaces/website/scripts/unset-legacy-fields.mjs`
