---
title: "Worker secret sync"
description: "Bulk-uploads non-public server secrets from .dev.vars to a Cloudflare Worker environment."
status: stable
---

# Worker secret sync

> Provisions all of a Worker env's secrets in one command.

## Purpose

Syncs server secrets to a Cloudflare Worker env via `wrangler secret bulk`. Reads `.dev.vars` (falling back to `.env.local`), keeps only non-public keys with real values, and bulk-uploads them — provisioning many secrets per env in one call instead of `wrangler secret put` per key. `NEXT_PUBLIC_*` keys are skipped (they are build-time vars in `wrangler.toml`), as are placeholder values. The temporary JSON file it writes is mode `0600` and always deleted. Guards against clobbering the wrong Worker via `assertRenamed`.

## Exports

No public exports (CLI script).

## Usage

```bash
pnpm secrets:sync:web:website:dev   # or :staging | :prod
```

## Source

`code/projects/web/surfaces/website/scripts/sync-secrets.mjs`
