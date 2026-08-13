# Environment setup — from clone to running

**Tier 1 runs the app** — all you need to develop. Optional AI coding tooling is internal (per-developer, global, never committed) — see the note at the end.

## Tier 1 — the app (required)

```bash
# prerequisites: Node 22+, pnpm 10 (corepack enable && corepack use pnpm@10)
pnpm install
cp .env.example .env.local      # every var is optional — fill Sanity keys if features.blog / studio are on
pnpm dev                        # http://localhost:3000
pnpm verify:quick               # tsc + lint (manual; the commit hook already runs tsc)
```

Run every command from the **repo root** — turbo delegates to `@indiecrafts/web`. Don't `cd` into `code/apps/web` to run scripts. That's a working dev environment; nothing below is required to build or ship.

Optional app extras:

```bash
pnpm seed                       # demo Sanity blog content (needs SANITY_API_WRITE_TOKEN)
pnpm docs:install && pnpm docs  # VitePress docs → http://localhost:3002
```

## Environment variables

All live in `.env.example` and **all are optional** — the template runs as-is with none set. Copy it to `.env.local` and fill what you need. **Never commit `.env*`** (only `.env.example`); the pre-commit gate and `.gitignore` guard it. Never put a server-only token under a `NEXT_PUBLIC_` prefix — that ships it to the browser.

| Variable | Public? | Default | Purpose |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | yes | placeholder `https://example.com` | Production origin (scheme + host, no trailing slash). Feeds `site.url` → canonical, sitemap, JSON-LD, OG, robots. **Set only on the production deploy** — while unset, `isSiteConfigured` stays false and robots serves `Disallow: /`. |
| `NEXT_PUBLIC_ENVIRONMENT` | yes | unset (NODE_ENV decides) | Overrides `getCurrentEnvironment()`. Drives CSP + robots: only `production` is indexable; every other value serves `Disallow: /`. Valid: `development` \| `test` \| `staging` \| `production`. Set `staging` on preview deploys for the tighter CSP. |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | yes | — | Sanity project. Required for the Studio at `/studio` and any Sanity query. Find under sanity.io/manage → your project → API. |
| `NEXT_PUBLIC_SANITY_DATASET` | yes | `production` | Sanity dataset name. |
| `NEXT_PUBLIC_SANITY_API_VERSION` | yes | `2025-01-01` | Pinned API version — bump intentionally so query semantics stay stable. |
| `SANITY_API_READ_TOKEN` | **no — server only** | — | Viewer role. Required for draft-mode preview (`/api/draft-mode/enable`) and the live-fetch wrapper on blog routes. |
| `SANITY_API_WRITE_TOKEN` | **no — server only** | — | Editor role. Used by `pnpm seed` and the write scripts. **Not** needed at runtime — leave unset in production. |

The public/private split is load-bearing: everything a browser may read carries `NEXT_PUBLIC_`; the two Sanity tokens deliberately don't. Environment behaviour (which env indexes, CSP tightening) is detailed in [`robots-and-environments.md`](../seo/robots-and-environments.md).

## AI coding tooling

Optional AI coding tooling is **internal** — per-developer, global (`~/.claude`), and never
committed, so client sites never depend on it. It is not part of this deliverable and is set up
outside this repo.
