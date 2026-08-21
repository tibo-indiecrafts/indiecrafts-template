# Getting started — the platform

A config-first Next.js 16 template, structured as a **full-platform monorepo** with the
dev framework in-repo. New here? Read this first, then jump to
[New client setup](/apps/web/setup/new-client) for the web app.

## What you build and deploy

Everything lives under **`code/`** (the pnpm + Turborepo workspace); `code/projects/` holds the
deployable surfaces:

| Path                                     | Role      | Holds                                                                                      |
| ---------------------------------------- | --------- | ------------------------------------------------------------------------------------------ |
| **`code/projects/web/surfaces/website`** | EXECUTION | the Next app (+ the hub Sanity Studio). The workspace also holds `packages/ modules/ db/`. |
| **`code/docs`**                          | CANON     | this site — product documentation, foldered like the code (**npm-isolated**).              |
| **`code/projects/web/tools/storybook`**  | REFERENCE | the component gallery (Storybook).                                                         |

The site + docs are what you build and **deploy**. Full layout + the deployment rules →
[Workspace & deployment](/shared/architecture/workspace).

## Run the monorepo

Everything runs from the **repo root** (scripts delegate to the app via Turborepo):

```bash
pnpm install       # installs the whole workspace (all of code/)
pnpm dev           # http://localhost:3000  (turbo → @indiecrafts/web-surfaces-website)
pnpm build         # production build → code/projects/web/surfaces/website/.next
pnpm verify        # tsc + lint + format + contrast + react-doctor (CI gate)
pnpm verify:quick  # tsc + lint (manual pre-PR check)
```

## Documentation site

`pnpm docs` → http://localhost:3002 — this site (product docs), its own npm package
isolated from the pnpm workspace.

## Deploy — app + docs only

The workspace installs at the **repo root**; the app builds to `code/projects/web/surfaces/website/.next`.
**Deploy only `code/projects/web/surfaces/website` (the site) and, optionally, `docs/`.** Full guide and hosts →
[Workspace & deployment](/shared/architecture/workspace).

## Where to go next

- **Set up the web app** → [Environment](/apps/web/setup/environment) → [New client](/apps/web/setup/new-client) → [Launch checklist](/apps/web/setup/launch-checklist).
- **The growth slots** (empty until needed) → [Modules](/modules/README) · [Packages](/packages/README) · [Db](/db/README) · [Infra](/infra/README).
