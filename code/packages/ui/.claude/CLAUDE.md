# @indiecrafts/ui — design-system component layer

Auto-loads under `code/packages/ui/**`. 61 shadcn/ui primitives + `use-mobile`, nested by platform
under `src/web/`. Area rules → `../../.claude/CLAUDE.md`.

**Stack:** React 19 · shadcn/ui (Radix) · Tailwind v4 · TypeScript. CLI-managed primitives — don't hand-edit.

- **Platform-nested (`src/<platform>/`).** Web primitives live in `src/web/`, imported as
  `@indiecrafts/ui/web/<name>` (+ `@indiecrafts/ui/web/use-mobile`). `src/native/` is **reserved** for
  React-Native primitives (`src/native/README.md`); `src/shared/` holds any platform-agnostic contract
  (`@indiecrafts/ui/shared/*`). A native design system stays **inside this brick** under `native/`, not
  a separate package — see the area brief's [Categorisation & platform](../../.claude/CLAUDE.md).
- **NEVER hand-edit these** — CLI-managed (`shadcn add` regenerates them; `components.json` `ui`/`hooks`
  aliases point at `@indiecrafts/ui/web`).
- **Styling lives in `@indiecrafts/ui-tokens`** (DESIGN.md + globals.css), not here.
- Each primitive's usage doc is colocated (`src/web/<name>.md` beside `<name>.tsx`), indexed from DESIGN.md.
- Full reference → [`docs/packages/ui.md`](../../../../docs/packages/ui.md).
