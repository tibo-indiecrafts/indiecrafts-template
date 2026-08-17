# work — the lab (think · plan · develop · reflect)

Auto-loads when you work under `work/**`. Where thinking happens, **separate from the
canon** (`docs/`). Messy, dated, per-sprint. `MEMORY.md` is the index; `backlog.md` the
queue; `apps/<app>/` and `apps/<app>/features/YYYY-MM-DD_<name>/` are sprints (`00_BRIEF · 01_REFERENCE ·
02_THINK…08_REFLECT · 09_OUTPUTS`); plus `archive/` + `scratch/`.

**Stack:** VitePress (npm-isolated). The private sprint-lab site (:3004).

## Rules

- **Draft freely here — never write drafts into `docs/`.** `docs/` is canon; only what _sticks_ graduates (a decision → an ADR, a proven pattern → the matching `docs/` page).
- **`scratch/` is gitignored + throwaway** — raw personal thinking, never relied on by anything committed.
- **Stamp a sprint** from `method/shared/templates/{app,feature}` (`cp -R`), don't hand-build the phase folders. gstack state is symlinked in per-sprint as `_gstack/` → `~/.gstack/projects/<slug>/` (gitignored); its repo-level reports land in `.gstack/` (also gitignored).
- The _why_ ships with the _what_: promote a keeper in the **same PR** as the code it explains.
- Log lab/process notes in `work/CHANGELOG.md` if they matter beyond one sprint.
