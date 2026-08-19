---
title: work — the lab
---

# work — the lab

Where thinking happens (think · plan · develop · reflect), **separate from the canon**
(`docs/`). Per-sprint, dated, messy. This site surfaces the **lab guide** and the
**[Deliverables index](/DELIVERABLES)** — every sprint's finished `09_OUTPUTS/` in one place.

## The sprint shape

Each app/feature is a self-contained, numbered sprint (stamp from `method/shared/templates`):

```
apps/<app>/[features/YYYY-MM-DD_<name>/]
  00_BRIEF/       the brief
  01_REFERENCE/   inputs (screens · competitors · moodboards · flows · research)
  02_THINK … 08_REFLECT/   the 7 phases
  09_OUTPUTS/     curated deliverables (indexed on the Deliverables page)
```

Flow: **think in `work/` → build in `code/` → promote what sticks to `docs/`.** Draft
freely here; `scratch/` is throwaway (gitignored). `MEMORY.md` is the running index.

## Start a sprint

Launch chain (in the **[method](http://localhost:3003)** site): **Machine setup → Project
bootstrap → 0 · Intake** (`node method/scripts/new-sprint.mjs "<name>"`) → fill `00_BRIEF/`
→ run the phases → land deliverables in `09_OUTPUTS/` and list them on **[Deliverables](/DELIVERABLES)**.

## The four pillars

- **Code** — the app (`code/projects/web/surfaces/website`) · runs at <http://localhost:3000>
- **[Docs](http://localhost:3002)** — product canon (what it is + why)
- **[Method](http://localhost:3003)** — how we work (the 7-phase sprint, rules, engineering brain)
- **Lab** (this site) — the deliverables + working memory
