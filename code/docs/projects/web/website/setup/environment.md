---
title: "Environment setup — from clone to running"
description: "Tier 1 runs the app — all you need to develop."
status: stable
---

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

Run every command from the **repo root** — turbo delegates to `@indiecrafts/web-surfaces-website`. Don't `cd` into `code/projects/web/surfaces/website` to run scripts. `.env.example` lives in the app (`code/projects/web/surfaces/website/`), so its copy does too. That's a working dev environment; nothing below is required to build or ship.

> **`pnpm install` blocked?** The workspace pins a supply-chain policy in `pnpm-workspace.yaml`:
> a **3-day** `minimumReleaseAge` (a fresh version waits 3 days — malware is usually caught +
> unpublished within 24–72h) plus `trustPolicy: no-downgrade` (rejects a version that lost its npm
> provenance). Fast-moving trusted toolchains (Cloudflare/Workers, expo/react-native,
> next/sanity/vitest/playwright…) are in `minimumReleaseAgeExclude`, and a handful of
> provenance-gap false positives (undici-types, `@aws-sdk/*`, `@smithy/*`, flow-*, …) in
> `trustPolicyExclude`. If a **new** legitimate package trips either gate, add its name to the
> matching exclude list — don't disable the gate. (Build scripts: pnpm 10 blocks them by default;
> the ones that must run — esbuild · workerd · @swc/core · @parcel/watcher — are in
> `onlyBuiltDependencies`.)

Optional app extras:

```bash
pnpm seed                       # demo Sanity blog content (needs SANITY_API_WRITE_TOKEN)
pnpm docs:install && pnpm docs  # VitePress docs → http://localhost:3002
```

### Remote dev — the workers run on Cloudflare's edge

`pnpm dev` runs the website locally (`next dev`, :3000) but the three workers as
`wrangler dev --env dev --remote` — live edge sessions against the **one shared remote `dev`**
D1/KV/R2 (there is no miniflare tier; local dev and `db:migrate:*:dev` share the dev database).
The session **hot-reloads** on save, so the **local loop** needs no redeploy — but the _deployed_
`indiecrafts-dev-*` Workers, cron schedules, and Terraform edge config only change on an explicit
command. What needs a command to reach dev → [Local development § live-vs-command](/shared/architecture/local-development#live-on-save-vs-needs-a-command-to-reach-dev) (the `redeploy→dev` hook also prints it as you edit).

Because it runs on the edge, remote dev silently 500s when you're logged out, a worker has no
`.dev.vars` (its session then has no secrets), or a `[env.dev]` id is still a placeholder. Three
commands keep that flawless:

```bash
pnpm dev:setup        # ONE-SHOT bootstrap: verify login → scaffold each worker's .dev.vars from
                      # .dev.vars.example (you fill the secrets) → migrate + deploy + sync secrets to dev
pnpm dev:doctor       # preflight: logged in? each worker has .dev.vars? no PASTE_…_HERE ids?
                      # (also runs automatically as `predev` before every `pnpm dev`)
pnpm dev:doctor:deep  # + a remote D1 migration-drift check (network)
pnpm dev:refresh:dev  # re-align remote dev — migrations + WORKER secrets only (no code redeploy,
                      # no next-cf secrets, no cron/infra); use deploy:*:dev for those
```

`dev:doctor` **warns** without blocking (fix it or ignore it) and hard-fails only when you're not
logged in. Bypass the `predev` check entirely with `SKIP_DEV_DOCTOR=1 pnpm dev`. **Heads-up:** all
developers share the one `dev` database, so two people working at once can clobber each other's data.

## Environment variables

All live in `.env.example`. The template **boots** with none set (marketing pages render), but the
three Sanity vars (`NEXT_PUBLIC_SANITY_PROJECT_ID` · `_DATASET` · `_API_VERSION`) are **required for
any Sanity feature** — the blog, the Studio, `pnpm seed`, and the e2e journeys — and `pnpm doctor:web:website:env`
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

The public/private split is load-bearing: everything a browser may read carries `NEXT_PUBLIC_`; the two Sanity tokens deliberately don't. Environment behaviour (which env indexes, CSP tightening) is detailed in [`robots-and-environments.md`](/projects/web/website/seo/robots-and-environments).

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
`pnpm --filter @indiecrafts/web-surfaces-website exec wrangler login`. Prerequisites are already in-repo: **wrangler
`^4`** (a devDep — invoke via `pnpm exec wrangler`, no global install needed), Node 22, pnpm 10. Do
**not** use `npx skills` or `claude mcp add` — the plugin commands register both skills and MCP servers.
Source: [`developers.cloudflare.com/agent-setup`](https://developers.cloudflare.com/agent-setup/).

### TypeScript LSP (types on the fly)

Live type diagnostics as you edit — the "types on the fly" tier
([on-the-fly-checks](/projects/web/website/setup/on-the-fly-checks)). Per-file `tsc` isn't feasible in this monorepo
(whole-program), so type feedback comes from the official LSP plugin instead. Install once (global,
per-developer):

```bash
claude plugin install typescript-lsp@claude-plugins-official
```

Then **`/reload-plugins`**. It surfaces the same errors the commit hook + CI `tsc` enforce, in real
time. Nothing to configure — it reads each project's `tsconfig.json`.

### Expo / React Native (the `mobile` surface)

The `mobile` surface (`code/projects/mobile/surfaces/main`, Expo SDK 52 · RN 0.76) gets the **official
Expo plugin** — Expo Skills (`expo-router` · `expo-native-ui` · `expo-design-system` · `expo-tailwind-setup`
/ NativeWind · `expo-animation` · `expo-upgrade` · the `eas-*` build/deploy/update workflows) **plus the
Expo MCP server** for version-correct docs (your SDK 52 is bleeding-edge, where model priors are stale).
Install once (global, per-developer), from the same `claude-plugins-official` marketplace as the LSP:

```bash
claude plugin install expo@claude-plugins-official
```

Then **`/reload-plugins`**. Reach for its skills when working under `code/projects/mobile/**` (and, for the
shared RN bits, `code/packages/mobile/ui-native`). Source:
[`docs.expo.dev/agents/claude`](https://docs.expo.dev/agents/claude/).

### Security guidance

Anthropic's official secure-coding reviewer for Claude-generated code — pattern-based warnings on
edits, an LLM diff review on Stop, and an agentic commit reviewer catching injection, XSS, SSRF,
hardcoded secrets, and 25+ other vulnerability classes. It reinforces this repo's config-first NEVERs
(no leaked tokens, no secret under `NEXT_PUBLIC_`). From the same `claude-plugins-official` marketplace
as the LSP:

```bash
claude plugin install security-guidance@claude-plugins-official
```

Then **`/reload-plugins`**. Source:
[`claude-plugins-official/plugins/security-guidance`](https://github.com/anthropics/claude-plugins-official/tree/main/plugins/security-guidance).

### Persistent memory (claude-mem)

Compresses context across sessions so Claude Code recalls earlier work instead of re-deriving it — a
per-developer memory store (global, `~/.claude`, never committed). A community plugin, so add its
marketplace first:

```bash
claude plugin marketplace add thedotmack/claude-mem
claude plugin install claude-mem@thedotmack
```

Then **`/reload-plugins`**. Source: [`github.com/thedotmack/claude-mem`](https://github.com/thedotmack/claude-mem).

### Project MCP servers (`.mcp.json`)

The repo commits its MCP servers in `.mcp.json` (approve them on first run): **shadcn** + **magicui**
(component registries), **sanity** (`@sanity/mcp-server` — query the dataset + schema; reads
`SANITY_API_READ_TOKEN`), **supabase** (read-only, for the DB surfaces), **terraform** (Cloudflare IaC,
via Docker), and **figma** (the remote Dev-Mode MCP at `mcp.figma.com/mcp` — OAuth on first use, all
plans/seats, no local app) for the
[figma-handoff](../../../projects/web/surfaces/website/.claude/rules/figma-handoff.md) workflow. For the
richer Figma experience (MCP **+** Agent Skills) install the plugin instead:
`claude plugin install figma@claude-plugins-official`. (The `vercel` MCP was removed — this repo deploys
to **Cloudflare** via OpenNext, not Vercel.)

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
[On-the-fly checks](/projects/web/website/setup/on-the-fly-checks) (stop tier).
