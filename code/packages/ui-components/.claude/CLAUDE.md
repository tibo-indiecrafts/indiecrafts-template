# @indiecrafts/ui-components — shared page-builder blocks

Auto-loads under `code/packages/ui-components/**`. Generic block renderers + the composable
`BLOCK_RENDERERS` registry, so the app and the blog paint the **same** blocks. Area rules →
`../../.claude/CLAUDE.md`.

- **Renderers moved here; schemas stay in the blog** — a generic `module.*` = renderer here + schema in `code/modules/blog`.
- Mixed `.ts`/`.tsx` → resolved via the app's tsconfig `paths` + a `@source` line in `ui-tokens/globals.css`.
- Pure presentational; takes resolved Sanity data, never imports an app.
- Full reference → [`docs/packages/ui-components.md`](../../../../docs/packages/ui-components.md).
