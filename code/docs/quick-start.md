---
title: Quick start
description: From clone to a running local stack in five steps.
status: stable
order: 1
---

# Quick start

Get the platform running locally in five steps. Then follow the fast inner loop.

## 1. Prerequisites

- Node 22
- pnpm 10
- macOS (the scripts assume a POSIX shell)

## 2. Install

Run once, from the repo root:

```bash
pnpm install
```

## 3. Run the stack

```bash
pnpm dev
```

This starts the website on `:3000` plus the `api`, `cron`, and `workers`
Cloudflare Workers on their own ports.

## 4. Open it

Open `http://localhost:3000`. The English home renders at the root. French is at
`/fr`.

## 5. Next steps

- [Installation](/projects/web/website/setup/environment) — env tiers, keys, and
  what each service needs.
- [New client](/projects/web/website/setup/new-client) — fork the template into a
  client site.
- [Platform overview](/getting-started) — the concepts behind the monorepo.

## The fast inner loop

Use the fast commands while you work. They keep local memory and time low.

- `pnpm tsc:fast` — typecheck via `tsgo` (the TS 7 Go port, ~10× faster). This is
  the local inner loop. CI still runs the real `tsc`.
- `pnpm oxlint` — repo-wide lint in ~3s (Rust, AST-only). Advisory; covers every
  surface.
- `pnpm lint` / `pnpm lint:fix` — ESLint with `--cache`.
- `turbo run build test verify --concurrency=50%` — parallel fan-out.

**Do not run `tsc` or `lint` by hand after every edit.** The commit hook, the live
lint cards, and the `typescript-lsp` plugin are the gate. Manual full runs are the
main cause of a slow local loop. See
[Scripts](/projects/web/website/setup/scripts) and
[On-the-fly checks](/projects/web/website/setup/on-the-fly-checks).
