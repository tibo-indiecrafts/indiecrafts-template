# Issue tags — triage vocabulary

How to flag a problem in code so it is greppable.

**This repo fixes debt in the same diff — tags are not a backlog.** Default: fix it now
(the fix-in-diff default). Tag only for (1) a deliberate corner you keep — pair with a
`ponytail:` comment naming the ceiling — or (2) an out-of-blast-radius note (surgical-diff
rule: note, don't fix). Inside your blast radius: fix it, don't tag it.

Format: `@family QUALIFIER - description`, inline. Families + qualifiers are fixed;
`pnpm check:tags` fails on anything off-list.

- `@complexity` — `MEDIUM` `HIGH`
- `@refactor` — `SPLIT` `EXTRACT` `CONSOLIDATE` `COLOCATE` `SIMPLIFY` `RENAME` `DUPLICATE` `TYPES` `BARREL`
- `@debt` — `PERFORMANCE` `SECURITY` `TESTING` `E2E` `HARDCODED` `COUPLING` `DEPRECATED` `VESTIGIAL` `MIGRATION` `BACKWARD_COMPAT` `ACCESSIBILITY` `LOGGING`
- `@bug` — (no qualifier; describe the symptom)
- `@optimisation` — (no qualifier; describe the gain)

**In docs (footer, for visibility).** A content doc MAY end with an `## Issue tags` footer — the
relevant tags as backtick-wrapped tokens + a one-line note — to surface a real, owned gap it describes
(architectural coupling, a known-debt area). `pnpm tags:report` scans `.md` too, so these count; the
vocabulary/meta docs (`issue-tags.md`, `scripts.md`) and changelogs are excluded. It mirrors real gaps
for visibility — not a wishlist; fix-in-diff stays the default.

```markdown
## Issue tags

- `@debt COUPLING` — one-line note on the real gap.
```

`pnpm tags:report` inventories them; `pnpm check:tags` guards the vocabulary. A rising
tag count is a smell here — flags are being parked instead of paid.
