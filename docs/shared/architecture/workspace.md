# Workspace & deployment

How the monorepo is laid out and what you deploy.

## Layout

The repo is a pnpm + Turborepo monorepo. The deliverable is two folders — `code/` and `docs/`.

| Folder      | Deployed?   | Role                                                                              |
| ----------- | ----------- | --------------------------------------------------------------------------------- |
| **`code/`** | ✅ the app  | The workspace — `apps/web` (the Next site), plus `packages/ modules/ db/ infra/`. |
| **`docs/`** | ✅ optional | This documentation site (VitePress). Product docs, safe to share.                 |

The repo may also carry internal folders (`method/`, `work/`) that are **private, gitignored,
and never part of a handoff** — they sit outside the pnpm/turbo workspace, so `pnpm build`
(the app deploy) never touches them.

## Run it

Everything runs from the **repo root** (scripts delegate to the app via Turborepo):

```bash
pnpm install       # installs the whole workspace (all of code/)
pnpm dev           # http://localhost:3000  (turbo → @indiecrafts/web)
pnpm build         # production build → code/projects/web/.next
pnpm verify        # tsc + lint + format + contrast + react-doctor (CI gate)
pnpm docs          # http://localhost:3002  (this site)
```

## Deployment — app + docs only

**Deploy `code/projects/web` (the site), and optionally `docs/`. Nothing else.**

- **App** — Cloudflare Workers via OpenNext: per-app `code/projects/web/wrangler.toml` +
  `open-next.config.ts`, deployed by GitHub Actions (`wrangler deploy --env <env>`) or
  `pnpm deploy:web:<env>`. Install stays at the repo root. Runbook →
  [Deployment (Cloudflare)](/apps/web/setup/deployment).
- **Docs** (optional) — its own npm package; `pnpm docs:build` → `docs/.vitepress/dist`.
  Deploy it only if the client should read the product docs.

Most clients never touch the repo at all: they get the **live site**, the **Sanity Studio**
(content editing), and — if you choose — this **docs site**.

### One namespace per client (multi-instance under one account)

Every reuse of the template gets a unique **namespace** via `pnpm project:rename <slug>` — it sets
`DEFAULT_SITE_PREFIX` (`@indiecrafts/config`) + the `<slug>-web*` Worker/R2 names together. The prefix
namespaces the browser keys (consent · theme · locale) and the Cloudflare resources, so **many clients
under one Cloudflare account never collide** — and a `staging`/`prod` deploy is blocked until you
rename (a shared-account clobber guard). New-client runbook → [New client](/apps/web/setup/new-client).
