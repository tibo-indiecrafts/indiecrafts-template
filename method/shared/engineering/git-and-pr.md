# Git & PR convention

**One change → one branch → one PR.** Keep the diff surgical (see `tech-debt.md`).

## Branches

`<type>/<slug>` — `feat/`, `fix/`, `refactor/`, `chore/`, `docs/`.
Example: `feat/blog-taxonomy-flags`.

## Commits

Conventional prefix + imperative subject, ≤ 50 chars; body says **why**, not what.
`feat(blog): per-type taxonomy flags`. Squash noise before the PR.

## Pull request

Small, one concern. Body states: goal · approach · test evidence · screenshots for
UI · rollback (the flag). Link the feature brief. Self-review the diff first.

## Before opening the PR

Debt gate green (`tech-debt.md`) · tests pass · verify pipeline clean.

## Never

Commit to the default branch directly · mix two concerns in one PR · commit `.env`,
secrets, or generated artifacts.
