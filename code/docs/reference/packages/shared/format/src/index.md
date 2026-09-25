---
title: "Format barrel"
description: "Aggregate entry that re-exports every locale formatting and grammar helper from the format package."
status: stable
---

# Format barrel

> One import surface for the whole `format` package.

## Purpose

This is the top-level barrel of `@indiecrafts/packages-shared-format`. It re-exports the named exports from every helper module so the package presents a single surface. Each module also ships its own subpath export for narrower imports.

## Exports

- Re-exports everything from `./money`, `./number`, `./relative`, `./list`, `./plural`, `./grammar`, `./text`, and `./validate`.
- No exports of its own.

## Source

`code/packages/shared/format/src/index.ts`
