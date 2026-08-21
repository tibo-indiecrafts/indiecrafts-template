# @indiecrafts/packages-web-ui — design-system component layer

Auto-loads under `code/packages/web/ui/**`. 61 shadcn/ui primitives + `use-mobile`, nested by platform
under `src/web/`. Area rules → `../../../.claude/CLAUDE.md`.

**Stack:** React 19 · shadcn/ui (Radix) · Tailwind v4 · TypeScript. CLI-managed primitives — don't hand-edit.

- **Platform-nested (`src/<platform>/`).** Web primitives live in `src/web/`, imported as
  `@indiecrafts/packages-web-ui/web/<name>` (+ `@indiecrafts/packages-web-ui/web/use-mobile`). `src/native/` is **reserved** for
  React-Native primitives (`src/native/README.md`); `src/shared/` holds any platform-agnostic contract
  (`@indiecrafts/packages-web-ui/shared/*`). A native design system stays **inside this brick** under `native/`, not
  a separate package — see the area brief's [Categorisation & platform](../../../.claude/CLAUDE.md).
- **NEVER hand-edit these** — CLI-managed (`shadcn add` regenerates them; `components.json` `ui`/`hooks`
  aliases point at `@indiecrafts/packages-web-ui/web`).
- **Slots, not config props** — a primitive is `Header`/`Content`/`Footer` slots + `asChild` +
  `data-slot`, never a presentational-prop bag (the CMS renderers in `ui-components` are the deliberate
  data-driven exception — see `projects/web/surfaces/website/.claude/rules/component-architecture.md`).
- **Styling lives in `@indiecrafts/packages-shared-ui-tokens`** (DESIGN.md + globals.css), not here.
- Each primitive's usage doc is colocated (`src/web/<name>.md` beside `<name>.tsx`), indexed from DESIGN.md.
- Full reference → [`code/docs/packages/ui.md`](../../../../docs/packages/ui.md).
