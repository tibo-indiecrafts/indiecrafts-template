# @indiecrafts/ui-tokens — the design system

Auto-loads under `code/packages/shared/ui-tokens/**`. `globals.css` (OKLCH tokens) · `typeset.css` ·
`DESIGN.md`. Area rules → `../../../.claude/CLAUDE.md`.

**Stack:** Tailwind v4 · OKLCH design tokens (globals.css) · TypeScript. The design system.

- **`src/shared/tokens.json` (DTCG 2025.10, OKLCH) is the SOURCE OF TRUTH.** `src/generated/tokens.css`
  (imported by `globals.css`), `src/native/tokens.ts` (React Native, hex), and `src/generated/hex.ts` (manifest
  mirror) are **GENERATED** by `pnpm tokens:build` (`scripts/build-tokens.mjs`, uses `culori`). **Never hand-edit
  the generated files.** `pnpm tokens:check` (in `verify`) fails if they drift from the JSON.
- **Exports:** `./globals.css` (web) · `./native` (React Native object) · `./tokens.json` (the DTCG source).
- **`globals.css` = hand-authored Tailwind scaffolding** (`@import`/`@source`/`@theme`/`@custom-variant`/
  `@utility` + animations) + `@import "./generated/tokens.css"`. **Add a `@source` line whenever a new package
  renders classes**, or its styles vanish (Tailwind v4 skips node_modules).
- `DESIGN.md` (colocated here) is the visual contract → [`DESIGN.md`](../DESIGN.md). Run `pnpm verify:contrast` after any token change.
- Full reference → [`code/docs/packages/ui-tokens.md`](../../../../docs/packages/ui-tokens.md).
