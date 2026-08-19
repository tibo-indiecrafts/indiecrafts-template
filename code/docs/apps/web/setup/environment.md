# Environment setup — from clone to running

**Tier 1 runs the app** — all you need to develop. Optional AI coding tooling is internal (per-developer, global, never committed) — see the note at the end.

## Tier 1 — the app (required)

```bash
# prerequisites: Node 22+, pnpm 10 (corepack enable && corepack use pnpm@10)
pnpm install                                              # supply-chain gate? see the note below
cp code/projects/web/surfaces/website/.env.example code/projects/web/surfaces/website/.env.local    # fill Sanity keys if features.blog / studio are on
pnpm dev                        # http://localhost:3000
pnpm verify:quick               # tsc + lint (manual; the commit hook already runs tsc)
```

Run every command from the **repo root** — turbo delegates to `@indiecrafts/website`. Don't `cd` into `code/projects/web/surfaces/website` to run scripts. `.env.example` lives in the app (`code/projects/web/surfaces/website/`), so its copy does too. That's a working dev environment; nothing below is required to build or ship.

> **`pnpm install` blocked?** The workspace pins a supply-chain policy in `pnpm-workspace.yaml`:
> a **3-day** `minimumReleaseAge` (a fresh version waits 3 days — malware is usually caught +
> unpublished within 24–72h) plus `trustPolicy: no-downgrade` (rejects a version that lost its npm
> provenance). Fast-moving trusted toolchains (Cloudflare/Workers, electron, expo/react-native,
> next/sanity/vitest/playwright…) are in `minimumReleaseAgeExclude`, and a handful of
> provenance-gap false positives (undici-types, `@aws-sdk/*`, `@smithy/*`, flow-*, …) in
> `trustPolicyExclude`. If a **new** legitimate package trips either gate, add its name to the
> matching exclude list — don't disable the gate. (Build scripts: pnpm 10 blocks them by default;
> the ones that must run — esbuild · workerd · @swc/core · electron · @parcel/watcher — are in
> `onlyBuiltDependencies`.)

Optional app extras:

```bash
pnpm seed                       # demo Sanity blog content (needs SANITY_API_WRITE_TOKEN)
pnpm docs:install && pnpm docs  # VitePress docs → http://localhost:3002
```

## Environment variables

All live in `.env.example`. The template **boots** with none set (marketing pages render), but the
three Sanity vars (`NEXT_PUBLIC_SANITY_PROJECT_ID` · `_DATASET` · `_API_VERSION`) are **required for
any Sanity feature** — the blog, the Studio, `pnpm seed`, and the e2e journeys — and `pnpm doctor:env`
fails fast if they're missing. Copy `.env.example` to `.env.local` and fill what your enabled features
need. **Never commit `.env*`** (only `.env.example`); the pre-commit gate and `.gitignore` guard it. Never put a server-only token under a `NEXT_PUBLIC_` prefix — that ships it to the browser.

| Variable                         | Public?              | Default                               | Purpose                                                                                                                                                                                                                                                                                                    |
| -------------------------------- | -------------------- | ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`           | yes                  | placeholder `https://example.com`     | Production origin (scheme + host, no trailing slash). Feeds `site.url` → canonical, sitemap, JSON-LD, OG, robots. **Set only on the production deploy** — while unset, `isSiteConfigured` stays false and robots serves `Disallow: /`.                                                                     |
| `NEXT_PUBLIC_ENVIRONMENT`        | yes                  | unset (NODE_ENV decides)              | Overrides `getCurrentEnvironment()`. Drives CSP + robots: only `production` is indexable; every other value serves `Disallow: /`. Valid: `development` \| `test` \| `staging` \| `production`. Set `staging` on preview deploys for the tighter CSP.                                                       |
| `NEXT_PUBLIC_SITE_PREFIX`        | no                   | `DEFAULT_SITE_PREFIX` (`indiecrafts`) | Per-deployment namespace → `site.prefix`. Prefixes the consent/theme/locale browser keys so two instances never collide. Normally set via `pnpm project:rename <slug>` (which writes the config default); this env var is the escape hatch to override it without editing code. Must be unique per client. |
| `NEXT_PUBLIC_SANITY_PROJECT_ID`  | yes                  | —                                     | Sanity project. Required for the Studio at `/studio` and any Sanity query. Find under sanity.io/manage → your project → API.                                                                                                                                                                               |
| `NEXT_PUBLIC_SANITY_DATASET`     | yes                  | `production`                          | Sanity dataset name.                                                                                                                                                                                                                                                                                       |
| `NEXT_PUBLIC_SANITY_API_VERSION` | yes                  | `2025-01-01`                          | Pinned API version — bump intentionally so query semantics stay stable.                                                                                                                                                                                                                                    |
| `SANITY_API_READ_TOKEN`          | **no — server only** | —                                     | Viewer role. Required for draft-mode preview (`/api/draft-mode/enable`) and the live-fetch wrapper on blog routes.                                                                                                                                                                                         |
| `SANITY_API_WRITE_TOKEN`         | **no — server only** | —                                     | Editor role. Used by `pnpm seed` and the write scripts. **Not** needed at runtime — leave unset in production.                                                                                                                                                                                             |

The public/private split is load-bearing: everything a browser may read carries `NEXT_PUBLIC_`; the two Sanity tokens deliberately don't. Environment behaviour (which env indexes, CSP tightening) is detailed in [`robots-and-environments.md`](../seo/robots-and-environments.md).

## AI coding tooling

Optional AI coding tooling is **internal** — per-developer, global (`~/.claude`), and never
committed, so client sites never depend on it. It is not part of this deliverable and is set up
outside this repo.

### Cloudflare (Workers · Pages · D1 · KV · R2)

This repo ships to Cloudflare (a `wrangler.toml` per app in `code/projects/*`). To give Claude Code the
official Cloudflare skills + docs/API MCP servers, run once (global, `~/.claude`, per-developer):

```bash
claude plugin marketplace add cloudflare/skills
claude plugin install cloudflare@cloudflare
```

Then, inside Claude, run **`/reload-plugins`** to activate. This installs the `cloudflare` · `wrangler` ·
`workers-best-practices` · `durable-objects` · `agents-sdk` skills plus five MCP servers —
`cloudflare-docs` (public, no auth) and `cloudflare-api` · `-bindings` · `-builds` · `-observability`
(**OAuth on first use**). For the CLI, authenticate with
`pnpm --filter @indiecrafts/website exec wrangler login`. Prerequisites are already in-repo: **wrangler
`^4`** (a devDep — invoke via `pnpm exec wrangler`, no global install needed), Node 22, pnpm 10. Do
**not** use `npx skills` or `claude mcp add` — the plugin commands register both skills and MCP servers.
Source: [`developers.cloudflare.com/agent-setup`](https://developers.cloudflare.com/agent-setup/).

### Browser verification

The `visual-verification` rule (`code/projects/web/surfaces/website/.claude/rules/visual-verification.md`) requires
**rendering a UI change and screenshotting it at 375 / 768 / 1280** before it is done — a screen you
have not looked at is not done. What a developer needs for that loop (per-developer, global — not part
of the deliverable):

- **`claude-in-chrome`** — the Chrome extension installed + the MCP connected (the tab Claude drives +
  screenshots through).
- **The dev server running** — `pnpm dev` → `http://localhost:3000` (the app); `pnpm docs` → `:3002`
  (the docs site). There has to be a live tab to connect to.
- **Connect the dev tab** — `/connect-chrome` attaches Claude to the **running** localhost tab (not a
  fresh blank one, which is claude-in-chrome's default); `/setup-browser-cookies` for an
  authenticated / stateful session.
- **Playwright browsers** — `pnpm exec playwright install` (once) for `webapp-testing` + the `e2e/`
  specs (`pnpm e2e`).

The **visual-verify** Stop hook nudges when a UI file changed without a browser check — see
[On-the-fly checks](./on-the-fly-checks.md) (stop tier).
