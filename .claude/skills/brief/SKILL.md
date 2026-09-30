---
name: brief
description: Review and concisely update (or create) the nearest .claude/CLAUDE.md brief
argument-hint: [path or brick/app/module name]
---

Review the `.claude/CLAUDE.md` **brief** for **$ARGUMENTS** (if empty: the brick/app/module you most
recently edited this session).

1. **Find the unit** — the nearest ancestor dir with a `package.json`. Read its `.claude/CLAUDE.md` if
   present; otherwise you'll create one.
2. **Gather facts** — the unit's `package.json` (`name` + `exports`), `src/index.*`, and its
   `code/docs/**` page if one exists. Nothing else.
3. **Write/update the brief** to hold only what an agent needs to work here: the package `name` + a
   one-line what-it-is, 2–3 sentences of purpose, the public surface (`exports`), 1–3 rules/gotchas
   specific to this unit, and a link to its docs page. Match the terse style of
   `code/packages/web/sanity/.claude/CLAUDE.md`.
4. **Keep it a map, not a log** — edit in place, cut stale lines, never append changelog-style entries
   (history lives in `CHANGELOG.md`). Do **not** restate rules inherited from a parent brief. Aim ~10–20
   lines. Anatomy + conventions → [`.claude/README.md`](../../README.md).
5. **Route what doesn't fit a map** (a brief stays ≤ 90 lines; ≤ 200 with its `@imports`):
   a multi-step procedure → a skill · a rule for one file type → a `paths:`-scoped rule · reference
   detail → the unit's `code/docs/` page · a must-happen check → a hook or a `pnpm check:*`.
   Mention a file in backticks; a bare `@path` imports it at launch.
6. **Verify** every relative link resolves, then `pnpm check:claude-md`.

Touch only the brief (and whatever you routed out of it) — no code. Then report the one-line change you made.
