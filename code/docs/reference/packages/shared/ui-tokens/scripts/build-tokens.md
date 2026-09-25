---
title: "Design token generator"
description: "Compiles the DTCG token source plus colocated component fragments into the web, React Native, NativeWind, and manifest outputs."
status: stable
---

# Design token generator

> Turns `tokens.json` plus colocated `*.tokens.json` fragments into every platform's generated token file.

## Purpose

This CLI script is the token build step for `@indiecrafts/packages-shared-ui-tokens`. It reads the DTCG (OKLCH) source `src/shared/tokens.json` plus every colocated `*.tokens.json` component fragment under `code/`, then emits four generated files. It also validates the fragments (component tier only, allowed reference targets, unique names) and checks for sidecar drift against sibling `.tsx` components. Run it with `pnpm tokens:build`; `--check` verifies the outputs are in sync without writing.

## Outputs

- `src/generated/tokens.css` — web `:root` (light) plus the two dark blocks.
- `src/native/tokens.ts` — React Native `{ light, dark }` hex objects.
- `src/generated/nativewind.css` — NativeWind `:root` plus `.dark:root` hex vars.
- `src/generated/hex.ts` — hex mirror for the PWA manifest.

## Exports

No public exports (CLI script; run via `pnpm tokens:build`).

## Usage

```bash
pnpm tokens:build          # regenerate the four output files
pnpm tokens:check          # fail if a generated file or sidecar drifted (used in verify)
```

## Source

`code/packages/shared/ui-tokens/scripts/build-tokens.mjs`
