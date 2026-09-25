# `.claude/` — the agent-config contract

How Claude Code guidance is structured in this repo, and how to **extend it without bloat**. This file is
the canonical reference; every folder-level `.claude/README.md` points here.

## Anatomy — what a `.claude/` dir may hold

| Item            | Scope              | Auto-loads?                                       | Purpose                                              |
| --------------- | ------------------ | ------------------------------------------------- | ---------------------------------------------------- |
| `CLAUDE.md`     | **per-folder**     | yes — cascades from root → `code/` → layer → leaf | the folder's _brief_: how to work here               |
| `rules/*.md`    | **per-folder**     | yes, when working under that folder               | focused, topic-scoped rules (a11y, tokens, testing…) |
| `commands/*.md` | **project** (root) | invoked as `/name`                                | slash commands (repeatable workflows)                |
| `agents/**`     | **project** (root) | on demand                                         | subagent definitions                                 |
| `skills/**`     | **project** (root) | on trigger                                        | packaged skills                                      |
| `hooks/*`       | **project** (root) | wired in `settings.json`                          | Pre/PostToolUse + Stop gates                         |
| `settings.json` | **project** (root) | always                                            | permissions + hook wiring                            |

**The load cascade.** Working on a file loads every `CLAUDE.md` from the repo root down to that file's
folder (root → `code/.claude` → `code/packages/.claude` → `code/packages/shared/logger/.claude` → …), plus
any `rules/` in that chain. So a leaf brief inherits the platform rules — it only states what's **new at
its altitude**. Never restate a parent's rules in a child.

## Per-folder vs project-wide (important)

- **Per-folder extension = `CLAUDE.md` + `rules/`.** These are the two things that live at any depth and
  load by location. Add a brief when a new brick/app/module appears; add a `rules/<topic>.md` when a
  folder needs a focused, always-on rule (see `code/projects/web/surfaces/website/.claude/rules/` for the
  pattern).
- **Commands · agents · skills · hooks are project-wide** — they live only in the **repo-root** `.claude/`
  and apply everywhere. There is no reliable per-folder slash-command; if a workflow is folder-specific,
  make it a root command that takes the folder as an argument (see `commands/brief.md`).

## How to extend

- **New brick/app/module** → add `<dir>/.claude/CLAUDE.md` (a short brief). Run `/brief <dir>` to draft it.
- **A folder needs a focused rule** → `<dir>/.claude/rules/<topic>.md`; reference it from that folder's
  `CLAUDE.md`.
- **A repeatable workflow** → a root `commands/<name>.md`.
- **A gate** → a root `hooks/<name>.{mjs,sh}` wired into `settings.json`.

## The anti-bloat rule (briefs are maps, not logs)

A `CLAUDE.md` is a **map an agent reads before working**, not a history. Keep it terse (the leanest briefs
here are ~10–20 lines). **Edit in place; never append changelog-style entries** (history lives in
`CHANGELOG.md`). State only what's true now + specific to this altitude; cut stale lines. Prefer a link to
the `code/docs/` page over restating it.

**Length clause (enforced).** A brief stays **≤ ~90 lines** — `pnpm check:claude-md` warns past it. Over
budget means it has drifted from map to manual: move the detail to a `code/docs/` page and link it.

## Automation

- **`/brief [path]`** (`commands/brief.md`) — reviews and concisely updates (or creates) the nearest
  brief.
- **`pnpm check:claude-md`** (`code/shared/scripts/checks/claude-md.mjs`, in `verify`) — the guard: every
  `pnpm` command a brief cites must resolve to a real root/unit script; `commands/`·`skills/`·`agents/`
  live only at the repo-root `.claude/`; briefs stay within the length budget (warn).
- **`hooks/claude-md-check.mjs`** (Stop) — runs that guard live, surfacing only hard errors (drift · misplacement).
- **`hooks/claude-contract.mjs`** (SessionStart) — surfaces this contract + "capture new learnings in the
  nearest brief" before the first edit.
- **`hooks/claude-hygiene.mjs`** (Stop) — **proposes** (never auto-edits) a brief review when a code
  unit's public surface changed (a new file, changed `exports`) but its brief didn't, or when a unit has
  no brief. It asks for a concise, reflect-only-what-changed edit — pair it with `/brief`.
- **`hooks/change-hygiene.sh`** (Stop) — the sibling gate for docs + tests + changelogs.
