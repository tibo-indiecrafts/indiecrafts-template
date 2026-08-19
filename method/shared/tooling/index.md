# Toolchain — everything a dev needs to work

One index for the whole setup, in two layers. **Layer 1 runs, builds, and ships the product** —
it's the client-facing deliverable, documented in the shipped docs site. **Layer 2 is the studio's
per-developer agent toolchain** — optional productivity, gitignored, never shipped. Nothing in
Layer 2 is required to build or ship.

## Layer 1 — run the app (required, shipped in `docs/`)

| Step    | Command                                                                                                                                                    | Reference               |
| ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- |
| Runtime | `corepack enable && corepack use pnpm@10` (Node 22+)                                                                                                       | environment.md          |
| Install | `pnpm install` (a supply-chain gate can block a fresh dep)                                                                                                 | environment.md          |
| Env     | `cp code/projects/web/surfaces/website/.env.example code/projects/web/surfaces/website/.env.local` — the 3 Sanity vars are required for any Sanity feature | environment.md          |
| Run     | `pnpm dev` → `http://localhost:3000`                                                                                                                       | environment.md          |
| Gate    | commit → husky `pre-commit` (`lint-staged` + `tsc`); CI = `pnpm verify` + build                                                                            | scripts.md · testing.md |

Full guide: **`docs/apps/web/setup/environment.md`** (the shipped VitePress site — `pnpm docs`, :3002).
That is all a client dev needs.

## Layer 2 — the studio agent toolchain (per-developer, opt-in, gitignored)

Each has its own page here with install + verify. All are **local to the developer's machine** and
excluded from the client hand-off ([client-handoff](../process/client-handoff)).

| Tool                        | What it gives you                                                                                                                               | Page                                                       | Verify                                              |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- | --------------------------------------------------- |
| **CodeGraph**               | semantic index + the `UserPromptSubmit` prompt-hook that injects `<codegraph_context>`                                                          | [codegraph](./codegraph)                                   | `pnpm codegraph:status` + the context block appears |
| **MCP servers**             | Sanity/shadcn/terraform/vercel/supabase connectors + opt-in GTM/koboyo                                                                          | [mcp-servers](./mcp-servers)                               | `/mcp`                                              |
| **On-the-fly hooks**        | local Stop/PostToolUse gates — a11y-check · **change-hygiene** (docs + tests) · impeccable design                                               | `docs/apps/web/setup/on-the-fly-checks.md` · install below | a card fires on the next UI edit                    |
| **Behavior plugins**        | caveman (terse) · ponytail (least-code)                                                                                                         | [behavior-plugins](./behavior-plugins)                     | `/caveman` `/ponytail`                              |
| **Code intelligence (LSP)** | go-to-def / diagnostics for the agent                                                                                                           | [code-intelligence](./code-intelligence)                   | `/reload-plugins`                                   |
| **Headroom**                | context compression on long sessions                                                                                                            | [headroom](./headroom)                                     | `/context`                                          |
| **CLAUDE.md system**        | the layered auto-loaded context                                                                                                                 | [claude-md-system](./claude-md-system)                     | `/context`                                          |
| **Skills — Superpowers**    | obra's workflow-discipline skills (brainstorm · plan · TDD · debug · review · verify) — **the fallback when a task isn't covered by `method/`** | [rule below](#superpowers--the-method-fallback)            | `claude plugin list` shows `superpowers@…`          |

### Superpowers — the method fallback

**Superpowers** (obra plugin, user-scope — `superpowers@claude-plugins-official`) is a general
workflow-discipline skill set that **overlaps** the `method/` framework. **Method-first:** when you're running
a gstack sprint or any `method/` workflow, follow **method** — don't let Superpowers' aggressive
`using-superpowers` dispatcher ("brainstorm before plan mode; 1% chance → you MUST invoke it") pull the sprint
off its rails. **Reach for a Superpowers skill only when the task is NOT covered by `method/`** — an
ad-hoc/one-off task, or no matching method workflow. In-sprint, use the method equivalent:

| Superpowers skill                                     | `method/` equivalent (use this in-sprint) |
| ----------------------------------------------------- | ----------------------------------------- |
| `brainstorming`                                       | `/office-hours`                           |
| `writing-plans` · `executing-plans`                   | `/autoplan` + the phase workflow          |
| `test-driven-development` · `systematic-debugging`    | engineering-standards + `test-pass`       |
| `requesting-code-review` · `receiving-code-review`    | `/review` · `/codex` · `/cso`             |
| `verification-before-completion`                      | self-review + `/qa`                       |
| `using-git-worktrees` · `dispatching-parallel-agents` | method parallel sprints                   |

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
- **`method/shared/tooling/`** (this site, :3003; **tracked but `export-ignore`d**, so never in a hand-off) — Layer 2, the studio toolchain.

They don't cross-link as live URLs (separate sites); this page is the bridge.
