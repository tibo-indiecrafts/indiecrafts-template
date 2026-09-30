---
title: "Env preflight check"
description: "Validates .env.local before dev, seed, or content operations and prints the per-client site identity."
status: stable
---

# Env preflight check

> Confirms the environment is set up before dev, seed, or content commands run.

## Purpose

Reads `.env.local` directly (not via `--env-file`, so a missing file is reported clearly) and checks the required Sanity keys are present, warning on missing recommended keys. Exits 1 on any missing required key. Then prints the four scattered per-client identity values — site prefix, deploy slug, Sanity project, and site URL — and warns on prefix/deploy drift (the Worker name must start with `<prefix>-`) or a shared-project dataset collision. The `--for=seed` flag also requires `SANITY_API_WRITE_TOKEN`.

## Exports

No public exports (CLI script).

## Usage

```bash
pnpm doctor:web:website:env              # check the base config
pnpm doctor:web:website:env -- --for=seed   # also require the write token
```

## Source

`code/projects/web/surfaces/website/scripts/doctor-env.mjs`
