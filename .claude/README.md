# `.claude/` — the agent-config contract

How Claude Code guidance is structured in this repo, and how it grows **without bloat**. This file is the
canonical reference; `.claude/agents/README.md` and `.claude/skills/README.md` index their folders.
Source of truth for load behavior: [code.claude.com/docs/en/memory](https://code.claude.com/docs/en/memory)
and [large codebases](https://code.claude.com/docs/en/large-codebases).

## Anatomy — what loads, when

| Item                     | Lives                              | Loads                                                         | Holds                                  |
| ------------------------ | ---------------------------------- | ------------------------------------------------------------- | -------------------------------------- |
| `CLAUDE.md` (brief)      | root + any `<unit>/.claude/`       | root at launch; a unit's when Claude reads a file under it    | facts for every session in that folder |
| `@path` imports          | inside a brief                     | **at launch, with the brief** — they cost context like inline | rarely worth it; mention in backticks  |
| `rules/*.md`             | root `.claude/rules/` (+ a unit's) | no `paths:` → always; `paths:` → with a matching file         | a rule for one file type / area        |
| `skills/<name>/SKILL.md` | root `.claude/skills/`             | name + description always; body when invoked / relevant       | procedures, checklists, reference      |
| `agents/**`              | root only                          | on demand, in a separate context                              | reviewers                              |
| `hooks/*` + wiring       | root only (`settings.json`)        | at fixed lifecycle events — deterministic                     | must-happen checks and nudges          |
| `settings.json`          | root only                          | always                                                        | permissions + hook wiring              |

**The cascade.** Working on a file loads every brief from the root down to that file's folder
(root → `code/.claude` → `code/packages/.claude` → `code/packages/shared/logger/.claude` → …). A leaf brief
inherits its parents — it states only what is **new at its altitude**. Never restate a parent's rules.

**Where rules live.** A rule that governs one unit sits in that unit's `.claude/rules/`
(`code/projects/web/surfaces/website/.claude/rules/`). A rule that governs a file type across units sits at
the root with `paths:` (`.claude/rules/web/*` → every web `.tsx`/`.css`/schema file in projects, packages,
and modules). A rule's `description:` frontmatter is for humans; Claude Code reads only `paths:`.

**AGENTS.md.** Claude Code (v2.1.277+) reads `AGENTS.md` only when no `CLAUDE.md` sits at or above the working
directory. Where a tool writes one (Next.js `next dev` writes `AGENTS.md` in each Next app), keep a sibling
`CLAUDE.md` containing `@AGENTS.md` — the documented way to share one file with other agents.

## How to extend — put each fact where it loads

| You learned…                               | Put it in                                            |
| ------------------------------------------ | ---------------------------------------------------- |
| a fact every session in a unit needs       | that unit's brief (`/brief <unit>`)                  |
| a rule for one file type or area           | a `rules/<topic>.md` with `paths:`                   |
| a multi-step procedure or checklist        | a root skill (`skills/<name>/SKILL.md`, < 500 lines) |
| reference detail (routes, tables, how-tos) | the unit's `code/docs/` page — the brief links to it |
| something that must happen every time      | a hook or a `pnpm check:*` — never prose             |
| a new brick / app / module                 | `<dir>/.claude/CLAUDE.md` — run `/brief <dir>`       |

A skill for one surface still lives at the root — a nested `.claude/skills/` is invisible to `/name` until
Claude touches that folder. Add `paths:` only when the skill is strictly file-bound. Commands are legacy
skills: add a skill, not a command.

## The budget (enforced)

- A brief is a **map**, not a log: edit in place, cut stale lines, no changelog entries (history lives in
  `CHANGELOG.md`). Prefer a link to the `code/docs/` page over restating it.
- **≤ 90 lines** per brief or rule — `pnpm check:claude-md` warns past it.
- **≤ 200 lines including `@imports`** — the official per-file target; the guard **fails** past it.
- **Dead `@imports` fail** — Claude Code drops them silently. Backtick a mention: `` `@scope/pkg` ``.
- Block-level `<!-- … -->` comments are stripped before loading — use them for maintainer notes.

## Automation — the evolve loop

1. **SessionStart** — `hooks/claude-contract.mjs` injects this contract's short form before the first edit.
2. **While working** — `hooks/claude-hygiene.mjs` (Stop) **proposes** a brief review when a unit's public
   surface changed but its brief didn't; `/brief` does the edit and routes overflow per the table above.
3. **Every Stop** — `hooks/claude-md-check.mjs` runs the guard and surfaces any COMMAND · SIZE · IMPORT ·
   PLACE error or BLOAT warning this session introduced (the repo sits at zero of both).
4. **Gate** — `pnpm check:claude-md` (`code/shared/scripts/checks/claude-md.mjs`, in `pnpm verify` + CI):
   cited `pnpm` commands resolve · size with imports · dead imports · no nested `agents/`/`commands/`.
5. **Periodic** — `/doctor prompt-audit` (Claude Code v2.1.283+) finds stale, conflicting, or
   older-model instructions across briefs, rules, skills, and agents. Run it after a model upgrade.

`hooks/change-hygiene.sh` (Stop) is the sibling gate for docs + tests + changelogs.
