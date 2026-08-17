# Toolchain — everything a dev needs to work

One index for the whole setup, in two layers. **Layer 1 runs, builds, and ships the product** —
it's the client-facing deliverable, documented in the shipped docs site. **Layer 2 is the studio's
per-developer agent toolchain** — optional productivity, gitignored, never shipped. Nothing in
Layer 2 is required to build or ship.

## Layer 1 — run the app (required, shipped in `docs/`)

| Step | Command | Reference |
| --- | --- | --- |
| Runtime | `corepack enable && corepack use pnpm@10` (Node 22+) | environment.md |
| Install | `pnpm install` (a supply-chain gate can block a fresh dep) | environment.md |
| Env | `cp code/apps/web/.env.example code/apps/web/.env.local` — the 3 Sanity vars are required for any Sanity feature | environment.md |
| Run | `pnpm dev` → `http://localhost:3000` | environment.md |
| Gate | commit → husky `pre-commit` (`lint-staged` + `tsc`); CI = `pnpm verify` + build | scripts.md · testing.md |

Full guide: **`docs/apps/web/setup/environment.md`** (the shipped VitePress site — `pnpm docs`, :3002).
That is all a client dev needs.

## Layer 2 — the studio agent toolchain (per-developer, opt-in, gitignored)

Each has its own page here with install + verify. All are **local to the developer's machine** and
excluded from the client hand-off ([client-handoff](../process/client-handoff)).

| Tool | What it gives you | Page | Verify |
| --- | --- | --- | --- |
| **CodeGraph** | semantic index + the `UserPromptSubmit` prompt-hook that injects `<codegraph_context>` | [codegraph](./codegraph) | `pnpm codegraph:status` + the context block appears |
| **MCP servers** | Sanity/shadcn/terraform/vercel/supabase connectors + opt-in GTM/koboyo | [mcp-servers](./mcp-servers) | `/mcp` |
| **On-the-fly hooks** | local Stop/PostToolUse gates — a11y-check · **change-hygiene** (docs + tests) · impeccable design | `docs/apps/web/setup/on-the-fly-checks.md` · install below | a card fires on the next UI edit |
| **Behavior plugins** | caveman (terse) · ponytail (least-code) | [behavior-plugins](./behavior-plugins) | `/caveman` `/ponytail` |
| **Code intelligence (LSP)** | go-to-def / diagnostics for the agent | [code-intelligence](./code-intelligence) | `/reload-plugins` |
| **Headroom** | context compression on long sessions | [headroom](./headroom) | `/context` |
| **CLAUDE.md system** | the layered auto-loaded context | [claude-md-system](./claude-md-system) | `/context` |

### Installing the on-the-fly hooks (fresh clone)

The hook **scripts** (`.claude/hooks/*`) and their **wiring** (`.claude/settings.local.json`) are
gitignored — a clone starts with none. The canonical copies live here in
`method/shared/tooling/hooks/` (`change-hygiene.sh`, `a11y-check.mjs`, `settings.local.example.json`).
Install them:

```bash
bash method/shared/tooling/hooks/install.sh   # copies scripts → .claude/hooks/, seeds settings.local.json
```

Then restart Claude Code and **approve** the hooks on first run. The impeccable design card needs the
global `~/.claude/skills/impeccable` skill installed separately. Why local-by-design: see the
"hooks are local" section of `docs/apps/web/setup/on-the-fly-checks.md`.

## The two homes

- **`docs/`** (shipped VitePress, :3002) — Layer 1, the client deliverable.
- **`method/shared/tooling/`** (this site, :3003, gitignored) — Layer 2, the studio toolchain.

They don't cross-link as live URLs (separate sites); this page is the bridge.
