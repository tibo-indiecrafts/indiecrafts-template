# Workspace & deployment

How the monorepo is laid out, what you deploy for a client, and how the internal
folders stay private.

## Layout

The repo is a pnpm + Turborepo monorepo. Two folders are client-facing and deployable;
two are internal and private.

| Folder | Deployed? | Role |
| --- | --- | --- |
| **`code/`** | ✅ the app | The workspace — `apps/web` (the Next site), plus `packages/ modules/ db/ infra/`. |
| **`docs/`** | ✅ optional | This documentation site (VitePress). Product docs, safe to share. |
| **`method/`** | ❌ **private** | The dev framework — sprint process, rules, engineering brain. Internal only. |
| **`work/`** | ❌ **private** | The sprint lab — thinking, `MEMORY`, `backlog`, `scratch`. Internal only. |

`method/` and `work/` are their own npm-managed VitePress sites, **outside** the pnpm/turbo
workspace — so `pnpm build` (the app deploy) never touches them. They only ever reach a
client if you deploy them to a public URL or hand over the whole repo. Don't.

## Run it

Everything runs from the **repo root** (scripts delegate to the app via Turborepo):

```bash
pnpm install       # installs the whole workspace (all of code/)
pnpm dev           # http://localhost:3000  (turbo → @indiecrafts/web)
pnpm build         # production build → code/apps/web/.next
pnpm verify        # tsc + lint + format + contrast + react-doctor (CI gate)
pnpm docs          # http://localhost:3002  (this site)
```

## Deployment — app + docs only

**Deploy `code/apps/web` (the site), and optionally `docs/`. Nothing else.**

- **App** — install at the repo root, build `pnpm build`, output `code/apps/web/.next`; set
  the host's Root/Package directory to `code/apps/web`. Netlify uses the per-app
  `code/apps/web/netlify.toml`. Vercel/Cloudflare/anywhere: point at the repo, keep install
  at the root. First-deploy steps → [New client](/apps/web/setup/new-client).
- **Docs** (optional) — its own npm package; `pnpm docs:build` → `docs/.vitepress/dist`.
  Deploy it only if the client should read the product docs.
- **`method/` + `work/`** — **do not create a public deploy for these.** They build with
  `pnpm method:build` / `pnpm work:build` for local/internal use, not for a client URL.

## Private folders — keeping `method/` + `work/` from clients

Two surfaces could leak them; close both.

**1. Deployment.** Never give `method`/`work` a client-reachable URL. If your team wants
them hosted, put each on a **separate private project with authentication** (e.g. Vercel
Authentication / password protection) — clients never get the URL, and it's gated anyway.
The docs site's internal cross-links to the Method/Lab sites are **dev-only** (hidden when
`NODE_ENV=production`), so a deployed docs site never points inward.

**2. Repo hand-off.** If a client ever receives code, they get **`code/` (+ `docs/`) only** —
never the monorepo. Two clean ways:

- **Separate private repo (best):** keep `method/` + `work/` in their own private repo from
  the start; the client repo carries `code/` + `docs/`. No per-hand-off filtering.
- **Filtered export:** ship a mirror of `code/` (+ `docs/`) via `git subtree split` or a
  scripted export. Do **not** `git rm --cached method work` on a shared branch — it fights
  your own history.

> Most clients never touch the repo at all: they get the **live site**, the **Sanity
> Studio** (content editing), and — if you choose — this **docs site**. In that model
> `method/` and `work/` are already invisible; the only thing to double-check is that you
> haven't deployed their sites to a public URL.
