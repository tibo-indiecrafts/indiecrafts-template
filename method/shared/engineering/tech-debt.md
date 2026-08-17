# Reduce debt while coding (compulsory)

Debt is paid down **in the same change that creates or passes it** — never logged
for "later." Every feature build includes this gate; **commit is blocked until it
passes.** This is a required step in `04_BUILD`, not a quality nicety.

## The rule (boy-scout, bounded)

Leave every file you touch cleaner than you found it — **within the change's blast
radius, not a repo-wide crusade.** Reducing debt while coding is not scope creep:
you clean what you already open, not what you don't.

## Net-complexity test

The change must not raise the net complexity of the code it touches. Add a concept
→ remove or simplify one in the same diff, or justify it in the PR.

## Two halves of the same diff

- **Half A — spread no new debt.** The change must not raise net complexity (above).
- **Half B — fix the debt it's linked to.** Run a **blast-radius debt scan**: for
  every file the diff touches, fix the debt _already_ in it. Bounded — touched files
  only; an untouched neighbor's debt gets a **note, never a fix** (that's the
  surgical-diff rule, and it's what stops Half B becoming an infinite crusade).

## Concrete moves (run before commit)

- Delete dead code you passed through — unused vars, imports, branches, files.
- Collapse duplication you introduced; reuse an existing helper, not a near-copy.
- Remove a needless abstraction — one-impl interface, factory-for-one,
  config-for-a-constant.
- Tighten types — kill `any`, name the real type.
- No new lint/type suppression without a one-line `ponytail:` reason naming the ceiling.
- **`ponytail-audit` on the diff — mandatory, not optional** (the simplify pass;
  pair with `pnpm doctor:changed` + lint for the machine half).

## Deliberate corners are allowed — if marked

Cutting a corner on purpose (global lock, O(n²) scan, naive heuristic) is fine —
mark it with a `ponytail:` comment naming the ceiling and the upgrade path. An
**unmarked** corner is debt; a **marked** one is a recorded decision. Add an
[issue tag](./issue-tags.md) (`@debt PERFORMANCE`, …) for a searchable family —
but tags never replace the fix: inside your blast radius, fix it, don't tag it.

## Boundary vs surgical-changes

Clean **within the blast radius only.** Don't reformat or "improve" code the change
doesn't touch — that violates the surgical-diff rule and buries the real change.
In doubt: touched it → clean it; didn't → leave it (note it, don't fix it).

## Gate — blocks commit

- [ ] **Half A** — no new debt: net complexity not raised; no duplication or needless
      abstraction introduced; no unexplained `any` / lint suppression
- [ ] **Half B** — blast-radius debt scan done: every touched file left cleaner or
      equal, dead code cleared; untouched neighbors noted, not fixed
- [ ] `ponytail-audit` run on the diff
- [ ] every deliberate corner marked `ponytail:`

Only then → commit.
