---
title: "Project namespace rename"
description: "Swaps the client namespace prefix across shared config, every wrangler.toml, Terraform tfvars, and the Capacitor shell identity."
status: stable
---

# Project namespace rename

> Rebrands the whole repo's namespace to a new client slug in one command.

## Purpose

Renames the project namespace in one command when reusing this template per client. Cloudflare resource names are `<prefix>-<env>-<platform>-<slug>`, so only `<prefix>` is client-specific. The script rewrites `DEFAULT_SITE_PREFIX` in `@indiecrafts/packages-shared-config`, the leading resource-name prefix on every `wrangler.toml` and `.tfvars` found by a repo-wide walk of `code/`, and the Capacitor shell identity (`shell.json` + the Android and iOS projects). `--dry-run` prints what would change and writes nothing. The slug must be lowercase, 3-41 characters, and unique per client.

## Exports

No public exports (CLI script).

## Usage

```bash
pnpm project:rename <slug>            # e.g. acme
pnpm project:rename <slug> --dry-run  # preview only, write nothing
```

## Source

`code/projects/web/surfaces/website/scripts/project-rename.mjs`
