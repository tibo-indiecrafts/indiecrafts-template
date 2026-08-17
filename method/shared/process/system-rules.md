# System rules

Rules Claude must follow in this workspace. Read this first, every session.

**Engineering principles** (Karpathy-style: simple, hyper-scalable, maintainable) →
`method/shared/engineering/principles.md`. Apply them in every build: simplest thing
that works, simple parts at clean seams, verify don't trust.

## Navigation

- `method/shared/process/` — these rules. Obey them.
- `method/shared/context/` — stable knowledge. Read what's relevant; don't copy it into projects.
- `work/` — active work. Each project starts at its `00_BRIEF/`.
- Each sprint's `09_OUTPUTS/` — finished work; save deliverables there, dated (no global outputs bucket — everything tracks with its app/feature).
- `work/archive/` — old. Search only; never treat as current.

## Doing work

1. Read the project's `00_BRIEF/` before anything else (feature → `BRIEF.md`, app → `PROJECT-BRIEF.md`).
2. Pull reusable context from `method/shared/context/` when needed — reference, don't duplicate.
3. Work inside the sprint's numbered folders — `00_BRIEF · 01_REFERENCE ·
   02_THINK → 08_REFLECT · 09_OUTPUTS`, stamped from `templates/{app,feature}`.
4. **Reduce debt in the same change.** Leave every file you touch cleaner or equal
   and run the debt gate before commit (`method/shared/engineering/tech-debt.md`).
   Compulsory — a commit that adds net debt is not done.
5. Save the finished result to the sprint's `09_OUTPUTS/` as `YYYY-MM-DD_topic_final.md`, and add a linked row to `work/DELIVERABLES.md` (the browsable index).

## Files

- Name files `YYYY-MM-DD_topic_status.md`. Status in the name (`draft-v1`, `final`).
- Never `final_v2`, `new_final_REAL`. The date + status carry the version.
- Markdown for instructions and text. Numbers for order. Dates for search.
- **Feature sprints are date-prefixed folders** — `features/YYYY-MM-DD_<name>/` — so they sort in time order (the app folder stays the bare `<slug>`, the gstack identity).
- **Deliverables get no sequence number and no `feat/fix` label.** `git log` is the order and the commit `type(scope):` is the type; the `09_OUTPUTS/` **subfolder** is the kind (research/design/qa/…); the **Source (PR/commit)** goes in `work/DELIVERABLES.md`. Don't fork what git already holds.

## Don't

- Never commit real secrets or client PII — reference by location; keep `.env` and
  keys out of the tree, example files only. (`.gitignore` covers `.env*`, keys, `_gstack`.)
- Don't defer cleanup of code you just touched — pay it down in the same diff, not
  a later "tech-debt pass." Clean the blast radius only, never a repo-wide crusade.
- Don't guess which file is current — the newest date + `final` status wins.
- Don't mix active work into `context/` or `archive/`.
- Don't reorganize the whole tree; add structure where work already happens.
