# Issue tags — a shared triage vocabulary

A small, fixed vocabulary for flagging a problem in code, comments, or a review.
One word for one idea, so a flag is greppable and unambiguous.

> **This is not a backlog.** [`tech-debt.md`](./tech-debt.md) is the law here: debt is
> paid down **in the same change**, never logged for "later." So a tag is a _fix-now
> marker_ or a _recorded decision_, never a to-do you leave behind. A tag count that
> grows over time is a smell in this repo (the opposite of a triage-later codebase).

## When to tag vs fix

Default: **fix it in the same diff** — that is the `tech-debt.md` gate. Tag only in two cases:

1. **A deliberate corner you are keeping** — mark it with a `ponytail:` comment naming
   the ceiling and the upgrade path, and add the family for search. The tag makes the
   decision findable; the `ponytail:` prose makes it accountable.
   ```ts
   // ponytail: global lock, fine at this scale — @debt PERFORMANCE, per-account locks if throughput matters
   ```
2. **Something outside the change's blast radius** — the surgical-diff rule says _note,
   don't fix_ an untouched neighbor. A tag is that note. It does not authorize scope creep.

If the problem is inside your blast radius and you can fix it now, **fix it — don't tag it.**

## The vocabulary

Format: `@family QUALIFIER - short description`. Inline (`//`, `#`, `--`, `{/* */}`).
Families and qualifiers are fixed — `pnpm tags:check` fails on anything off-list.

| Family          | Qualifiers                                                                                                                                                             | Meaning                                                                                                                                                                                                  |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@complexity`   | `MEDIUM` · `HIGH`                                                                                                                                                      | Too much in one place; hard to follow.                                                                                                                                                                   |
| `@refactor`     | `SPLIT` · `EXTRACT` · `CONSOLIDATE` · `COLOCATE` · `SIMPLIFY` · `RENAME` · `DUPLICATE` · `TYPES` · `BARREL`                                                            | A shape change: split, extract a helper, group scattered files, move next to its use, simplify, rename, de-duplicate, tighten types (`any`), add/fix an index barrel.                                    |
| `@debt`         | `PERFORMANCE` · `SECURITY` · `TESTING` · `E2E` · `HARDCODED` · `COUPLING` · `DEPRECATED` · `VESTIGIAL` · `MIGRATION` · `BACKWARD_COMPAT` · `ACCESSIBILITY` · `LOGGING` | A known shortcut: slow path, security concern, missing test / e2e, magic value, tight coupling, deprecated API, dead code, needs migration, removable back-compat shim, WCAG gap, missing observability. |
| `@bug`          | —                                                                                                                                                                      | Known broken behavior; describe the symptom.                                                                                                                                                             |
| `@optimisation` | —                                                                                                                                                                      | A performance or UX win worth taking; describe the gain.                                                                                                                                                 |

## Relationship to `ponytail:`

- `ponytail:` = a **deliberate corner**, in prose, naming the ceiling + upgrade path (see [`tech-debt.md`](./tech-debt.md)).
- `@tags` = a **searchable family** on top, so `pnpm tags:report` can list every `@debt SECURITY` at once.
- Use them together on a kept corner; use `@tags` alone for an out-of-radius note.

## Tooling

```bash
pnpm tags:report            # inventory: counts by family + qualifier, per area
pnpm tags:report --debt     # one family (--complexity|--refactor|--debt|--bug|--optimisation)
pnpm tags:check             # CI: fail on any non-canonical family/qualifier (guards the vocabulary)
```

`tags:check` runs in `pnpm verify` **and** CI (`.github/workflows/test.yml`, fail-first), so a
typo (`@debt HARDCODE`) or an invented family never lands. Because this repo fixes debt in-diff,
also watch the **totals** — a climbing count means flags are being parked instead of paid.

## Searching

```bash
git grep -nE "@(complexity|refactor|debt|bug|optimisation)" -- code docs
```

The gate ([`tech-debt.md`](./tech-debt.md)) still governs: a tag inside your blast radius is
a fix you owe this commit, not a marker you get to keep.
