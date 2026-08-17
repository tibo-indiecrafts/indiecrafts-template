# 04 · BUILD — feature (full dev loop)

One change, one branch → one PR. Tight cycle. Inherits the project's system.
Build to `method/apps/web/architecture.md` + `api-and-data.md`.
**Aim: the simplest solution that still scales** — simple parts, clean seams, easy
to maintain (`principles.md`).

## The loop

```
plan → implement (TDD) → self-review → reduce debt (REQUIRED) → design/a11y check → run → commit
```

### 0. Branch

- Cut the feature branch. One branch → one PR.

### 1. Plan the change

- `codegraph_explore` first — blast radius before editing
- **`/plan` once for the whole branch** — not per checklist item. Use it when the
  change is non-trivial (≥3 files, refactor, migration, unclear approach); it
  proposes the approach, you approve, then it builds the steps without re-planning.
- **Skip** `/plan` for a one-liner, or when `03_PLAN`'s `/autoplan` already produced
  a detailed plan (don't double-plan). `/autoplan` = what+why · `/plan` = how.

### 2. Implement

- `test-driven-development` skill — failing test first
- **caveman:cavecrew-builder** agent — surgical 1–2 file edits
- **frontend-developer** / **refactoring-specialist** agents — bigger/isolated work
- **`frontend-design` plugin** — reach for it on any new/reshaped UI: commit to a
  real visual direction (no templated defaults), typography, layout
- Skills: `shadcn`, `vercel-react-best-practices`, `vercel-composition-patterns` ·
  obey `method/apps/web/rules/*`

### 3. Self-review (before asking anyone)

- **`/code-review`** — review the diff for correctness bugs + cleanup.
  `--fix` applies findings; `ultra` = deep cloud multi-agent review.
- **code-reviewer** or **caveman:cavecrew-reviewer** agent — second pass
- `/security-review` — if the diff touches auth, input, data

### 4. Reduce debt — **compulsory, blocks commit**

- Boy-scout the blast radius: leave every touched file cleaner or equal — fix the
  debt already in the files you touch, note (don't fix) untouched neighbors. Run the
  full gate in `method/shared/engineering/tech-debt.md` before you commit.
- **`ponytail-audit` skill** — reuse/simplify changed code (mandatory, not optional);
  pair with `pnpm doctor:changed` + lint for the machine half.
- Mark any deliberate corner with a `ponytail:` comment (ceiling + upgrade path);
  an unmarked corner is debt.

### 5. Design + a11y check (UI changes)

- `design-system-check` skill + **design-system-reviewer** agent — tokens/reuse/contrast
- `accessibility-pass` skill + **accessibility-reviewer** agent
- **ux-reviewer** agent — flow/hierarchy

### 6. Run + verify

- **`/run`** — launch app, screenshot, confirm it works (not just tests)
- `/goal "tests pass"` — loop until green
- `pnpm verify:quick`

### 7. Safety + commit

- `/guard` (= `/careful` + `/freeze`) when touching prod/billing
- **`/commit`** — smart commit; `/diff` to review first. **Do not commit until the
  step-4 debt gate is green** (`tech-debt.md`).

## Native commands used

`/code-review` `/security-review` `/run` `/plan` `/goal` `/commit` `/diff`
· debt: `ponytail-audit` skill · safety `/careful` `/freeze` `/guard`

## Out

Code + tests → repo. Build notes, key commits/PR → this folder. Review findings →
`09_OUTPUTS/reviews/`. Then → `05_REVIEW`.
