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
.claude/{settings.json, rules/}        # settings (ROOT-ONLY) + global rules (writing-style)
code/apps/web/.claude/
  CLAUDE.md                            # the app's how-to-code
  rules/                               # auto-loading rules (import method canon) + code-patterns + self-review
  skills/  agents/                     # web-scoped design + review tooling
code/packages/<name>/.claude/CLAUDE.md # per-brick specifics
code/modules/blog/.claude/CLAUDE.md    # the module
```

## What nests, and what doesn't

| Component | Nested per sub-project? | Loads |
| --- | --- | --- |
| `CLAUDE.md` | ✅ | ancestors at launch; subtree on-demand |
| `rules/` | ✅ | with the subtree CLAUDE.md; `paths:` frontmatter scopes further |
| `skills/` · `agents/` · `commands/` | ✅ | on-demand when working in that subtree |
| **`settings.json` / `settings.local.json`** | ❌ **root only** | start dir only — **never nest it** |

Bare `<dir>/CLAUDE.md` and `<dir>/.claude/CLAUDE.md` are interchangeable; we use `.claude/` so
rules/skills/agents live beside it.

## Rules are importers, not copies

Enforceable rules live once in `method/` (the canon + published site). Each auto-loading rule is
a thin `.claude/rules/<topic>.md` that `@import`s the method file — so the rule **auto-applies by
location** with zero duplication (`@path` expands the target inline). The gstack sprint,
`method/shared/process/`, and the sprint templates are **never** moved into `.claude/`.

## The three-doc triad

Per unit: **`CLAUDE.md`** (how to build) · **`DESIGN.md`** (how it looks — tokens) ·
**`PRODUCT.md`** (who & why). Each owns its facts; the others link, never duplicate.

## House conventions

- **Keep each `CLAUDE.md` short** (aim < ~100 lines) and **specific** — exact versions, a real
  structure tree, **verifiable** NEVERs. If an agent can't tell whether a rule was followed, cut it.
- **Show, don't tell** — concrete wrong→right examples live in `code/apps/web/.claude/rules/code-patterns.md` (the ❌/✅ library), which auto-loads.
- **Self-audit before finishing** — `.claude/rules/self-review.md`.
- **New unit?** Stamp `method/shared/templates/claude-md/` and register it (`_registry.md` + docs page + sidebar + area changelog).
- Committed to git (never secrets — describe config, never values); updated in the same change as the code it describes.
