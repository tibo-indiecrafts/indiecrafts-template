---
title: "Sanity CLI config (website)"
description: "Sanity CLI configuration that resolves project/dataset from env and adds a Rollup workspace-index fallback for the hosted Studio build."
status: stable
---

# Sanity CLI config (website)

> Lets `sanity` subcommands find the project and dataset, and makes the hosted Studio build resolve workspace subpaths.

## Purpose

Configures the Sanity CLI for the website. It resolves `projectId` and `dataset` from the same env the app uses, so `sanity` subcommands (typegen, dataset export/import) work. Schema-reading commands read `sanity.config.ts` and need no network; `dataset export/import` hit the API and need a token. It also pins the hosted-Studio `deployment.appId` so later `studio:deploy` runs do not prompt.

Its main job beyond that is a Vite/Rollup plugin, `workspaceIndexFallback`, that makes `sanity build`/`deploy` resolve the app's `@/*` alias and workspace `@indiecrafts/*` subpaths. Rollup honours Node's exports spec strictly and does not index-fall-back, so the plugin tries the direct path first (files resolve) and retries `…/index` only when that fails (directories) — letting the hosted Studio build without editing every package's exports map.

## Exports

- Default export: the Sanity CLI config (`defineCliConfig({ … })`).

## Source

`code/projects/web/surfaces/website/sanity.cli.ts`
