# 04 · BUILD — project (architecture)

The set-once foundation every feature inherits. Wide, slow, reviewed at the
system level. Do this before feature work.

**Aim: simple yet hyper-scalable, easy to maintain** — an architecture of simple
parts composed at clean seams, not a clever monolith (`method/shared/engineering/principles.md`).

## Scope

- Scaffold, folder structure, conventions (`CLAUDE.md`, `method/apps/web/rules/`) —
  build to `method/apps/web/architecture.md` + `api-and-data.md`
- Per-repo toolchain — run `method/shared/process/project-bootstrap.md` (hooks, CI, tests, tracking)
- **Design system** → `DESIGN.md` (tokens, type scale, elevation)
- Base components, layout chrome, data model, CI, deploy prep

## gstack

- `/design-consultation` — zero-to-complete visual identity → `DESIGN.md`
- `/design-shotgun` — explore visual directions
- `/plan-eng-review` — lock architecture, data flow, boundaries

## Native commands

- `/plan` — plan mode **once** before large scaffolding / architecture work
  (not per file). `/autoplan` sets scope; `/plan` sets how you build it.
- `/code-review` — review the scaffold/architecture diff (`ultra` for deep)
- `/doctor` — config health, trim `CLAUDE.md`
- `/commit` — commit the foundation in logical chunks

## Agents (separate context window)

- **system-architect** — overall architecture, tech-stack, component interactions
- **backend-architect** — APIs, server logic, scalability
- **database-schema-designer** — schema, relations, indexing
- **Plan** (native) — implementation plan for the scaffold
- **design-system-reviewer** (yours) — audit `DESIGN.md` tokens once set

## Skills

**`frontend-design` plugin** (distinctive visual direction) · `design-systems:*` ·
`designer-skills:*` · `web-design-guidelines`

## Out

`code/packages/tokens/DESIGN.md` + `code/apps/web/CLAUDE.md` (app briefs) · decisions → `docs/apps/web/design/decisions.md` ·
notes → `09_OUTPUTS/design/`. Runs rarely; re-run when the system evolves.
