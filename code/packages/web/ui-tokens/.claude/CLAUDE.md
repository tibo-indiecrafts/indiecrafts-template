# `@indiecrafts/packages-web-ui-tokens` — the design system

Auto-loads under `code/packages/web/ui-tokens/**`. `globals.css` (OKLCH tokens) · `typeset.css` ·
`DESIGN.md`. Area rules → `../../../.claude/CLAUDE.md`.

**Stack:** Tailwind v4 · OKLCH design tokens (globals.css) · TypeScript. The design system.

- **`src/shared/tokens.json` (DTCG 2025.10, OKLCH) is the SOURCE OF TRUTH.** `src/generated/tokens.css`
  (imported by `globals.css`) and `src/generated/hex.ts` (every semantic color as hex — for the manifest and
  email) are **GENERATED** by `pnpm tokens:build` (`scripts/build-tokens.mjs`, uses `culori`). **Never hand-edit
  the generated files.** `pnpm tokens:check` (in `verify`) fails if they drift from the JSON.
- **Exports:** `./globals.css` · `./typeset.css` · `./tokens.json` (the DTCG source) · `./hex` (semantic hex mirror: manifest + email).
- **`globals.css` = hand-authored Tailwind scaffolding** (`@import`/`@source`/`@theme`/`@custom-variant`/
  `@utility` + animations) + `@import "./generated/tokens.css"`. **Add a `@source` line whenever a new package
  renders classes**, or its styles vanish (Tailwind v4 skips node_modules).
- `DESIGN.md` (colocated here) is the visual contract → [`DESIGN.md`](../DESIGN.md). Run `pnpm verify:contrast` after any token change.
- Full reference → [`code/docs/packages/web/ui-tokens.md`](../../../../docs/packages/web/ui-tokens.md).
