# Getting started — the platform

A config-first Next.js 16 template, structured as a **full-platform monorepo** with the
dev framework in-repo. New here? Read this first, then jump to
[New client setup](/apps/web/setup/new-client) for the web app.

## The two folders you work with

| Folder      | Role      | Holds                                                                                                             |
| ----------- | --------- | ----------------------------------------------------------------------------------------------------------------- |
| **`code/`** | EXECUTION | the pnpm + Turborepo workspace — `apps/web` (the Next app), plus `packages/ modules/ db/ infra/` slots for growth |
| **`docs/`** | CANON     | this site — product documentation, foldered like the code                                                         |

These are what you build and **deploy**. Full layout + the deployment rules →
[Workspace & deployment](/shared/architecture/workspace).

> The repo may also carry internal folders (`method/` · `work/`) — **private,
> gitignored, and excluded from client hand-offs**. `pnpm build` (the app deploy)
> never touches them.

## Run the monorepo

Everything runs from the **repo root** (scripts delegate to the app via Turborepo):

```bash
pnpm install       # installs the whole workspace (all of code/)
pnpm dev           # http://localhost:3000  (turbo → @indiecrafts/web)
pnpm build         # production build → code/apps/web/.next
pnpm verify        # tsc + lint + format + contrast + react-doctor (CI gate)
pnpm verify:quick  # tsc + lint (manual pre-PR check)
```

## Documentation site

`pnpm docs` → http://localhost:3002 — this site (product docs), its own npm package
isolated from the pnpm workspace.

## Deploy — app + docs only

The workspace installs at the **repo root**; the app builds to `code/apps/web/.next`.
**Deploy only `code/apps/web` (the site) and, optionally, `docs/`** — the internal
`method/` and `work/` folders stay private. Full guide and hosts →
[Workspace & deployment](/shared/architecture/workspace).

## Where to go next

- **Set up the web app** → [Environment](/apps/web/setup/environment) → [New client](/apps/web/setup/new-client) → [Launch checklist](/apps/web/setup/launch-checklist).
- **The growth slots** (empty until needed) → [Modules](/modules/README) · [Packages](/packages/README) · [Db](/db/README) · [Infra](/infra/README).
