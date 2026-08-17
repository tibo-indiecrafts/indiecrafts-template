# work — the lab (think · plan · develop · reflect)

Where thinking happens, **separate from the official docs** (`docs/`). Messy, dated,
per step/feature. Draft here freely; only what _sticks_ graduates to `docs/`
(a design decision → `docs/apps/web/design/decisions.md`, a proven pattern → the matching `docs/` concern page).

## Layout

| Path                   | What                                                                                                  |
| ---------------------- | ----------------------------------------------------------------------------------------------------- |
| `apps/<app>/` and `apps/<app>/features/YYYY-MM-DD_<name>/` | a sprint — fully self-contained: `00_BRIEF/` · `01_REFERENCE/` (inputs) · `02_THINK … 08_REFLECT/` (phases) · `09_OUTPUTS/` (deliverables). Stamp from `method/shared/templates/{app,feature}` |
| `backlog.md`           | ideas · next · icebox                                                                                 |
| `archive/`             | old, searchable                                                                                       |
| `scratch/`             | raw personal thinking — **gitignored**, throwaway                                                     |

## Flow

1. **Stamp a sprint:** `node method/scripts/new-sprint.mjs "<name>" --title "<card>" --desc "<why>"` (from the repo root; `--kind app` for an app-altitude sprint). See [0 · Intake](../method/shared/process/intake.md).
2. **Think → plan → develop → reflect** in the phase folders; gstack drives and writes here (per-sprint state symlinked as `_gstack/`, repo reports in `.gstack/` — both gitignored).
3. **Graduate**: an approved plan → an ADR in `docs/apps/web/design/decisions.md`; a keeper deliverable → the sprint's `09_OUTPUTS/`. The _why_ ships in the same PR as the _what_.

Rule: **write drafts and thinking here, never into `docs/`.** `docs/` is canon; `work/` is the draft space.

## Links

- **Live:** `<production URL>` · **Repo:** `<git URL>` · **Deploy:** `<Netlify/Vercel dashboard>`
- **Internal dev site:** `http://localhost:3004` — private, **not publicly deployed**.

<!-- Template placeholders — fill per project; canonical URLs live in the root README. -->
