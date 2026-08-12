# Environment setup — from clone to running

Two tiers. **Tier 1 runs the app** — all you need to develop. **Tier 2** is the optional, per-developer AI tooling (global, never committed).

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

## Tier 2 — AI coding tooling (optional, per-developer, global)

Recommended for working with an AI agent on this repo. All global (`~/.claude`), none committed, so client sites never depend on them.

| Tool | Install | Guide |
| --- | --- | --- |
| **CodeGraph** — semantic code index | `npm i -g @colbymchenry/codegraph && codegraph install`, then `pnpm codegraph:init` | [codegraph.md](../../../shared/tooling/codegraph.md) |
| **Code intelligence (LSP)** — find-refs + type errors, no `tsc` | `npm i -g typescript-language-server typescript` then `claude plugin install typescript-lsp@claude-plugins-official` | [code-intelligence.md](../../../shared/tooling/code-intelligence.md) |
| **Headroom** — context compression | `pipx install "headroom-ai[all]"` | [headroom.md](../../../shared/tooling/headroom.md) |
| **caveman + ponytail** — terse output / least code | see guide | [behavior-plugins.md](../../../shared/tooling/behavior-plugins.md) |

### Full AI toolchain (one-time, per machine)

Prerequisites:

```bash
curl -fsSL https://bun.sh/install | bash     # gstack needs bun
brew install yt-dlp pipx                      # youtube-transcript; headroom
```

Behavior + workflow plugins:

```bash
claude plugin marketplace add JuliusBrussee/caveman     && claude plugin install caveman@caveman
claude plugin marketplace add DietrichGebert/ponytail   && claude plugin install ponytail@ponytail
claude plugin marketplace add hadufer/claude-storm      && claude plugin install storm@storm-marketplace
claude plugin install feature-dev@claude-plugins-official
claude plugin install pr-review-toolkit@claude-plugins-official
```

Code intelligence (LSP — go-to-def / find-refs / type errors without `tsc`; this repo is
TS/React so `typescript-lsp` fits — see [code-intelligence.md](../../../shared/tooling/code-intelligence.md)):

```bash
npm i -g typescript-language-server typescript          # the binary the plugin needs
claude plugin install typescript-lsp@claude-plugins-official
```

Knowledge-work plugins (skip what you don't need — many need MCP connectors):

```bash
claude plugin marketplace add anthropics/knowledge-work-plugins
for p in marketing legal data productivity cowork-plugin-management; do
  claude plugin install "$p@knowledge-work-plugins"; done
```

Skills (global, on-demand — `npx skills`):

```bash
# design + build
npx -y skills add anthropics/skills --skill '*' --agent claude-code --global --yes   # frontend-design, docx, pdf…
npx -y skills add shadcn/ui@shadcn --global --yes
npx -y skills add vercel-labs/agent-skills --skill '*' --global --yes
npx -y skills add obra/superpowers --skill '*' --global --yes
# web + docs + content
npx -y skills add firecrawl/cli --skill '*' --global --yes
npx -y skills add upstash/context7 --skill find-docs --global --yes
npx -y skills add netlify/context-and-tools --skill '*' --global --yes
```

gstack (engineering sprint — see `~/.claude/GSTACK-SPRINT.md`):

```bash
git clone --single-branch --depth 1 https://github.com/garrytan/gstack.git ~/.claude/skills/gstack \
  && cd ~/.claude/skills/gstack && ./setup
```

> The authoritative command list lives in `~/.claude/COMMANDS.md`; `~/.claude/TOOLING.md` maps what each does.
