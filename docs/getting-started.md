# Getting started — the platform

A config-first Next.js 16 template, structured as a **full-platform monorepo** with the
dev framework in-repo. New here? Read this first, then jump to
[New client setup](/apps/web/setup/new-client) for the web app.

## Four root folders that mirror each other

Same `apps/web · modules · packages · db · infra` spine in each:

| Folder | Role | Holds |
| --- | --- | --- |
| **`code/`** | EXECUTION | the pnpm + Turborepo workspace — `apps/web` (the Next app), plus `packages/ modules/ db/ infra/` slots for growth |
| **`method/`** | HOW we work | the dev framework — the 7-phase sprint, the engineering brain, rules, workflows. Its own site (see below) |
| **`work/`** | DOING | the lab — per-sprint thinking, `MEMORY`, `backlog`, `scratch`. Draft here; promote keepers to docs |
| **`docs/`** | CANON | this site — product documentation, foldered like the code |

**Flow:** think in `work/` → build in `code/` → promote what sticks to `docs/`.

## Run the monorepo

Everything runs from the **repo root** (scripts delegate to the app via Turborepo):

```bash
pnpm install       # installs the whole workspace (all of code/)
pnpm dev           # http://localhost:3000  (turbo → @indiecrafts/web)
pnpm build         # production build → code/apps/web/.next
pnpm verify        # tsc + lint + format + contrast + react-doctor (CI gate)
pnpm verify:quick  # tsc + lint (manual pre-PR check)
```

## Two documentation sites

Each is its own npm package, isolated from the pnpm workspace:

- **Product docs** — this site. `pnpm docs` → http://localhost:3002. How the template works.
- **Method / framework** — `pnpm method` → http://localhost:3003. How we work (the sprint, rules, engineering brain).

## Deploy — not locked to one host

The workspace installs at the **repo root**; the app builds to `code/apps/web/.next`.

- **Netlify** — per-app manifest `code/apps/web/netlify.toml` (`command = pnpm build`, `publish = code/apps/web/.next`); set Package directory = `code/apps/web`, Base unset. First-deploy steps → [the app README](/apps/web/setup/new-client).
- **Vercel / Cloudflare / anywhere** — point at the repo, keep install at the repo root, set build `pnpm build` and Root Directory / output to `code/apps/web`. Each `apps/<name>` you add later is its own deploy target.

## Where to go next

- **Set up the web app** → [Environment](/apps/web/setup/environment) → [New client](/apps/web/setup/new-client) → [Launch checklist](/apps/web/setup/launch-checklist).
- **The growth slots** (empty until needed) → [Modules](/modules/README) · [Packages](/packages/README) · [Db](/db/README) · [Infra](/infra/README).
- **Working with an AI agent** (optional, per-developer, all global/uncommitted) → [Environment § Tier 2](/apps/web/setup/environment) — CodeGraph, [code intelligence (LSP)](/shared/tooling/code-intelligence), Headroom, behavior plugins.
