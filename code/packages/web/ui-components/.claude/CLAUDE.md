# @indiecrafts/packages-web-ui-components — shared page-builder blocks

Auto-loads under `code/packages/web/ui-components/**`. Generic block renderers + the composable
`BLOCK_RENDERERS` registry, so the app and the blog paint the **same** blocks. Area rules →
`../../../.claude/CLAUDE.md`.

**Stack:** React 19 · TypeScript · Tailwind v4 · shadcn primitives. Shared page-builder block renderers.

- **Nested platform → domain (`src/<platform>/<domain>/`).** Web renderers live in `src/web/<domain>/` —
  `content/` (callout, prose, custom-html, code-block) · `media/` (gallery, gallery-carousel,
  featured-media) · `collection/` (card-list, stat-list, step-list, accordion-list, person-list,
  quote-list, feature-grid, pricing) · `layout/` (module-section, cta, hero) · `form/` (shared form
  controls — PhoneInput, TurnstileWidget, Newsletter, Waitlist, LeadMagnet, DataRequestForm). Web infra (`registry.tsx`,
  `portable-text-components.tsx`, story helpers) sits at `src/web/`. `src/shared/types.ts` is the
  **platform-agnostic contract** (block types). `src/native/` is **reserved** for a future
  React-Native renderer set that mirrors the same domain folders + shares `shared/types` + tokens —
  empty until an RN app exists (see `src/native/README.md`). Consumers import
  `@indiecrafts/packages-web-ui-components/web/<domain>/<Name>` (or `web/{registry,portable-text-components}`, `shared/types`).
- **Renderers moved here; schemas live in page-builder** — a generic `module.*` = renderer here + schema in `@indiecrafts/packages-web-page-builder` (`code/packages/web/page-builder`), not the blog.
- Mixed `.ts`/`.tsx` → resolved via the app's tsconfig `paths` + a `@source` line in `ui-tokens/globals.css`.
- Pure presentational; takes resolved Sanity data, never imports an app.
- **Every rendered component ships a colocated `<Name>.stories.tsx` + a `<Name>.md` doc** — the
  `@indiecrafts/web-tools-storybook` package auto-discovers them, so a new component without a story is
  incomplete. Match a sibling (e.g. `form/PhoneInput.stories.tsx`): `title: "UI Components/<Name>"`,
  `tags: ["autodocs"]`, description from `./<Name>.md?raw`. A component that can't render without an
  env var / external key takes a prop override so a story can drive it (see `TurnstileWidget`'s `siteKey`).
- Full reference → [`code/docs/packages/ui-components.md`](../../../../docs/packages/ui-components.md).
