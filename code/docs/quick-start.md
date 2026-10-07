---
title: Quick start
description: From clone to a running local stack — install, configure, run, check.
status: stable
order: 1
---

# Quick start

Get the platform running locally, then follow the fast inner loop.

## 1. Prerequisites

- Node 22 and pnpm 10.
- macOS (the scripts assume a POSIX shell).
- Access to the project's Cloudflare account. The workers run with
  `wrangler dev --remote`: they execute on Cloudflare against the real **dev** D1, KV
  and R2, so you must be logged in — run `npx wrangler login` once.

## 2. Install and configure

From the repo root:

```bash
pnpm install
pnpm dev:setup
```

`dev:setup` checks your Cloudflare login and creates each worker's `.dev.vars` from its
`.dev.vars.example`. Fill in the secret **values** it leaves empty, then run it again.
For the website, copy `code/projects/web/surfaces/website/.env.example` to `.env.local`
and fill it. An unset key turns its feature off; it does not break the stack. Which key
serves what → [Installation](/projects/web/website/setup/environment).

## 3. Run the stack

```bash
pnpm dev
```

`pnpm dev` first runs `dev:doctor`, a preflight. It warns about missing secrets, an
`admin` / `app` `.env.local` without its required keys, or placeholder resource ids, but
never blocks — except when you are not logged in to Cloudflare, because nothing can work then. It then starts:

| Service   | Port    | Check                        |
| --------- | ------- | ---------------------------- |
| website   | `:3000` | `http://localhost:3000`      |
| `api`     | `:8787` | `curl localhost:8787/health` |
| `cron`    | `:8789` | `curl localhost:8789/health` |
| `workers` | `:8790` | `curl localhost:8790/health` |

Each worker answers `{"ok":true}`. The first visit to a page compiles it, so allow
10–30 s before you call it down.

## 4. Open it

Open `http://localhost:3000`. The English home renders at the root (`/en` redirects
to `/`). French is at `/fr`.

## 5. The other surfaces

`admin` and `app` are not in `pnpm dev`. Run each on its own port — every Next surface
defaults to `3000`:

```bash
PORT=3001 pnpm --filter @indiecrafts/web-surfaces-admin dev
PORT=3002 pnpm --filter @indiecrafts/web-surfaces-app dev
```

- **admin** fails closed: signed out (or without Clerk keys) every route redirects to
  `/sign-in`.
- **app** needs its own `.env.local` (from its `.env.example`). Set
  `NEXT_PUBLIC_WEBSITE_URL=http://localhost:3000`, so the legal links and the live legal
  version point at your local website.
- The **mobile shell** loads the app from `:3002` →
  [Mobile shell](/projects/mobile/main/).
- The **docs site** (`pnpm docs`) also uses `:3002` — stop `app` first, or run one of
  them on another port.

## 6. Next steps

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
