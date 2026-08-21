# Storybook — component gallery

The design-system gallery for **indiecrafts.dev**: a browse-only Storybook documenting the shared UI
bricks (`ui`, `ui-components`, `ui-tokens`, plus `announcement` / `locale-suggest` stories). It consumes
the bricks and ships nothing to production — the website **copies** components from here and adapts them,
never depending on this package at runtime.

## Commands

Run from the repo root:

```bash
pnpm --filter @indiecrafts/web-tools-storybook storybook        # dev gallery → http://localhost:6006
pnpm --filter @indiecrafts/web-tools-storybook storybook:build  # static build → storybook-static/
pnpm --filter @indiecrafts/web-tools-storybook test:stories     # run every story as a component + a11y test
```

## Layout

- `stories/` — the stories, one per documented brick/variant.
- `.storybook/` — config (`main.ts`, `preview.tsx`), Tailwind, and mocks for the Next-coupled edges
  (`next-intl-mock.tsx`, `shiki-mock.ts`).

See [`code/docs/packages/storybook.md`](../../../../docs/packages/storybook.md) for the full reference and
`.claude/CLAUDE.md` for the conventions.
