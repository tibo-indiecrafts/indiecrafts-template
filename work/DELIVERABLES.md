# Deliverables

Every finished work item — the curated files in each sprint's `09_OUTPUTS/`. This is the
one place to **find** a deliverable. Raw phase output stays in gstack's ignored `.gstack/`
/ `.context/`; the keepers get promoted here and **linked below**.

**Timing + type come from git, not a new number.** `git log` is the total order and the
commit `type(scope):` carries feat/fix/etc — so deliverables get **no sequence number and no
`feat/fix` label**. What this index adds is **Kind** (the artifact class) + **Source** (a
pointer to the commit/PR that produced it), so you can trace an output back to its change.

## The rule (lockstep)

When a deliverable lands in `apps/<app>/[features/YYYY-MM-DD_<name>/]09_OUTPUTS/`:

1. Name it `YYYY-MM-DD_topic_final.ext` (status in the name — `draft-v1` / `final`; newest date + `final` wins).
2. **Add a linked row here** — same change that produces the file (like the docs page+sidebar rule) — with its **Kind** + **Source**.

- **Kind** — matches the `09_OUTPUTS/` subfolders: `research · design · review · qa · retro · doc`.
- **Source** — the commit/PR that shipped it (`#123` or a short SHA). The _why_ ships in the same PR as the _what_, so record that PR here.

## Index

_No sprints stamped yet._ As sprints land, list their deliverables, newest first:

| Date | Kind | App / Feature | Deliverable | Source | Link |
| ---- | ---- | ------------- | ----------- | ------ | ---- |
| _YYYY-MM-DD_ | design | `apps/<app>` · `<feature>` | what it is | [#123](#) | [file](./apps/<app>/features/YYYY-MM-DD_<name>/09_OUTPUTS/YYYY-MM-DD_topic_final.md) |

> Links resolve once the sprint's `09_OUTPUTS/` file exists and its brief is filled (an
> unfilled `<placeholder>` brief won't render — see the site config note).
