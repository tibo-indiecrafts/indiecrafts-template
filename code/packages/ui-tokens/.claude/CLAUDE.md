# @indiecrafts/ui-tokens — the design system

Auto-loads under `code/packages/ui-tokens/**`. `globals.css` (OKLCH tokens) · `typeset.css` ·
`DESIGN.md`. Area rules → `../../.claude/CLAUDE.md`.

- **OKLCH in `globals.css` is the authoritative color source** — the DESIGN.md hex are tooling mirrors.
- **Add a `@source` line whenever a new package renders classes**, or its styles vanish (Tailwind v4 skips node_modules).
- `DESIGN.md` (colocated here) is the visual contract → [`DESIGN.md`](../DESIGN.md). Run `pnpm verify:contrast` after any token change.
- Full reference → [`docs/packages/ui-tokens.md`](../../../../docs/packages/ui-tokens.md).
