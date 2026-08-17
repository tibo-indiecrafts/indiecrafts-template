# The CLAUDE.md system (monorepo)

How this template feeds AI coding agents their rules of engagement — layered per sub-project,
so an agent working in `code/apps/web` gets Next/React rules and one in `code/packages/utils`
gets leaf-brick rules, without you switching modes.

## The `.claude/` per sub-project

Every unit owns a `.claude/` folder. Claude Code **concatenates** the `CLAUDE.md` files from the
filesystem root down to your working directory (ancestors at launch; deeper subtrees on-demand
when their files are read), so rules layer instead of overriding:

```
CLAUDE.md                              # root — universal laws (platform, four-folder layout, principles)
.claude/{settings.json, rules/, skills/, agents/}   # settings (ROOT-ONLY) + global rule (writing-style)
                                       # + skills/agents at ROOT so they're available wherever you start
code/apps/web/.claude/
  CLAUDE.md                            # the app's how-to-code
  rules/                               # auto-loading rules (import method canon) + code-patterns + self-review
code/packages/<name>/.claude/CLAUDE.md # per-brick specifics
code/modules/blog/.claude/CLAUDE.md    # the module
```

## What nests, and what doesn't — the two loading behaviors

The catch: **CLAUDE.md and rules load by the *files Claude reads*, but skills/agents/commands are
discovered by *walking up from where you launched Claude*.** Since you run from the repo root,
skills/agents live at **root** (always available) while CLAUDE.md + rules nest (auto-load by location).

| Component | Where we put it | Loads |
| --- | --- | --- |
| `CLAUDE.md` | nested per unit | ancestors at launch; a subtree's file when Claude reads a file under it — **no `cd`** |
| `rules/` | nested (app) + root (global) | with the subtree's CLAUDE.md; `paths:` frontmatter scopes further — **no `cd`** |
| `skills/` · `agents/` · `commands/` | **root** | discovered by walking **up** from the start dir → nest them and they vanish unless you launch inside that subtree |
| **`settings.json` / `settings.local.json`** | **root** | start dir only — **never nest it** |

Bare `<dir>/CLAUDE.md` and `<dir>/.claude/CLAUDE.md` are interchangeable; we use `.claude/` so the
nested rules live beside their CLAUDE.md.

## Rules are importers, not copies

Enforceable rules live once in `method/` (the canon + published site). Each auto-loading rule is
a thin `.claude/rules/<topic>.md` that `@import`s the method file — so the rule **auto-applies by
location** with zero duplication (`@path` expands the target inline). The gstack sprint,
`method/shared/process/`, and the sprint templates are **never** moved into `.claude/`.

## The three-doc triad

Per unit: **`CLAUDE.md`** (how to build) · **`DESIGN.md`** (how it looks — tokens) ·
**`PRODUCT.md`** (who & why). Each owns its facts; the others link, never duplicate.

## Agents — vendored + phase-mapped

The template is **packaged**: the general agent suite (~79, from
[contains-studio/agents](https://github.com/contains-studio/agents)) is **vendored** under
`.claude/agents/` — phase-wired agents in the topic folders, the rest in `bench/<topic>/` — so a
clone needs no `~/.claude` setup. The **template-tuned** reviewers
live in `.claude/agents/project/` (`design-system` · `accessibility` · `ux` · `copy` · `page-builder` ·
`config-consistency`). Refresh the general suite with `pnpm agents:sync` (it never touches
`project/`).

**Which agent at which sprint step** is the canonical map in
[`method/shared/process/my-skills-and-agents.md`](../../../method/shared/process/my-skills-and-agents.md)
(THINK→REFLECT, with `[vendored]`/`[local]`/`[gstack]`/`[plugin]` source tags); the
[`workflow.md`](../../../method/shared/process/workflow.md) phase chain and
[`decision-matrix.md`](../../../method/shared/process/decision-matrix.md) (which review per change)
sit alongside it.

## House conventions

- **Keep each `CLAUDE.md` short** (aim < ~100 lines) and **specific** — exact versions, a real
  structure tree, **verifiable** NEVERs. If an agent can't tell whether a rule was followed, cut it.
- **Show, don't tell** — concrete wrong→right examples live in `code/apps/web/.claude/rules/code-patterns.md` (the ❌/✅ library), which auto-loads.
- **Self-audit before finishing** — `.claude/rules/self-review.md`.
- **New unit?** Stamp `method/shared/templates/claude-md/` and register it (`_registry.md` + docs page + sidebar + area changelog).
- Committed to git (never secrets — describe config, never values); updated in the same change as the code it describes.
