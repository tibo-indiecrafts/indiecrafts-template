# @indiecrafts/ui-components — shared page-builder blocks

Auto-loads under `code/packages/ui-components/**`. Generic block renderers + the composable
`BLOCK_RENDERERS` registry, so the app and the blog paint the **same** blocks. Area rules →
`../../.claude/CLAUDE.md`.

**Stack:** React 19 · TypeScript · Tailwind v4 · shadcn primitives. Shared page-builder block renderers.

- **Nested platform → domain (`src/<platform>/<domain>/`).** Web renderers live in `src/web/<domain>/` —
  `content/` (callout, prose, custom-html, code-block) · `media/` (gallery, gallery-carousel,
  featured-media) · `collection/` (card-list, stat-list, step-list, accordion-list, person-list,
  quote-list) · `layout/` (module-section, cta). Web infra (`registry.tsx`,
  `portable-text-components.tsx`, story helpers) sits at `src/web/`. `src/shared/types.ts` is the
  **platform-agnostic contract** (block types). `src/native/` is **reserved** for a future
  React-Native renderer set that mirrors the same domain folders + shares `shared/types` + tokens —
  empty until an RN app exists (see `src/native/README.md`). Consumers import
  `@indiecrafts/ui-components/web/<domain>/<Name>` (or `web/{registry,portable-text-components}`, `shared/types`).
- **Renderers moved here; schemas stay in the blog** — a generic `module.*` = renderer here + schema in `code/modules/blog`.
- Mixed `.ts`/`.tsx` → resolved via the app's tsconfig `paths` + a `@source` line in `ui-tokens/globals.css`.
- Pure presentational; takes resolved Sanity data, never imports an app.
- Full reference → [`docs/packages/ui-components.md`](../../../../docs/packages/ui-components.md).
