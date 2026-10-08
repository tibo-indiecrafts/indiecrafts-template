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

Its Vite `define` adds two things to the hosted Studio bundle:

- **Every `NEXT_PUBLIC_*` value.** `sanity build` passes only `SANITY_STUDIO_*` to the browser, and the shared config reads `NEXT_PUBLIC_SANITY_PROJECT_ID` (and dataset, site URL). Without this the hosted Studio throws "Missing NEXT_PUBLIC_SANITY_PROJECT_ID" on load. The values are public by definition.
- **`SANITY_STUDIO_PREVIEW_ORIGINS`.** The sites the Aperçu tab may show, prod first: each env's `NEXT_PUBLIC_SITE_URL` from `wrangler.toml` (else the domain registry), then `http://localhost:3000`. `sanity.config.ts` opens the first and allows the others. Redeploy the Studio after a site URL changes.

## Exports

- Default export: the Sanity CLI config (`defineCliConfig({ … })`).

## Source

`code/projects/web/surfaces/website/sanity.cli.ts`
