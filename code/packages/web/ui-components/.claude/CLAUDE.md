# `@indiecrafts/packages-web-ui-components` — shared page-builder blocks

Auto-loads under `code/packages/web/ui-components/**`. Generic block renderers + the composable
`BLOCK_RENDERERS` registry, so the app and the blog paint the **same** blocks. Area rules →
`../../../.claude/CLAUDE.md`.

**Stack:** React 19 · TypeScript · Tailwind v4 · shadcn primitives. Shared page-builder block renderers.

- **Nested platform → domain (`src/<platform>/<domain>/`).** Web renderers live in `src/web/<domain>/` —
  `content/` (callout, prose, custom-html, code-block) · `media/` (gallery, gallery-carousel,
  featured-media) · `collection/` (card-list, stat-list, step-list, accordion-list, person-list,
  quote-list, feature-grid, pricing, more-on-topic — a bare list of
  `{title, href}` links for a sidebar card · author-bio — an end-of-article "Written by" card · **PostCard** — the shared
  post-card primitive (renders one `PostCardItem`), extracted for `FeaturedPosts`/`SpotlightRow`/`Carousel`
  to share · **FeaturedPosts** — a header + lead card over a grid or beside a list (`FeaturedEditorial`); `blog-featured`, any page ·
  **SpotlightRow** — a curated post picks row + "view all" link (`blog-category-spotlight`,
  `blog-trending`) · **Carousel** — client, an embla-driven scroller of pinned posts (`blog-collection`))
  · `layout/`
  (module-section, cta, hero, **WithSidebar** + **SidebarCard** (the sidebar of cards) · category-nav — a top-level category bar with sub-category dropdowns
  over resolved `{title, href}` items · share-buttons — X/LinkedIn/Facebook + copy-link row over
  an optional `url` (omitted → resolves the current page URL client-side, for client-only surfaces
  like the app) + `title` + an optional `networks` filter (editor-driven, from the
  site's `siteSettings.share`); intent URLs from `@indiecrafts/packages-shared-utils/share` · **PostHero** — a full-width lead-post hero (image/video, category chip, author/date)
  for the blog frontpage (`blog-hero`) · **TopicCards** — one to three large clickable category/tag
  cards (`blog-topic-cards`)) · `form/` (shared form
  controls — PhoneInput, TurnstileWidget, Newsletter, Waitlist, LeadMagnet, DataRequestForm; every public
  form is built on `useGuardedSubmit` + `FormFrame` + `GuardedFields`, its server wrapper on `formBlock` —
  recipe in `form/FormFrame.md`). Web infra (`registry.tsx`,
  `portable-text-components.tsx`, story helpers) sits at `src/web/`. `src/shared/types.ts` is the
  **DOM-free contract** (block types) — also home to **`PostCardItem`**, the resolved
  post-card shape every collection primitive above shares. Consumers import
  `@indiecrafts/packages-web-ui-components/web/<domain>/<Name>` (or `web/{registry,portable-text-components}`, `shared/types`).
- **Renderers moved here; schemas live in page-builder** — a generic `module.*` = renderer here + schema in `@indiecrafts/packages-web-page-builder` (`code/packages/web/page-builder`), not the blog.
- Mixed `.ts`/`.tsx` → resolved via the app's tsconfig `paths` + a `@source` line in `ui-tokens/globals.css`.
- Pure presentational; takes resolved Sanity data, never imports an app.
- **Every rendered component ships a colocated `<Name>.stories.tsx` + a `<Name>.md` doc** — the
  `@indiecrafts/web-tools-storybook` package auto-discovers them, so a new component without a story is
  incomplete. Match a sibling (e.g. `form/PhoneInput.stories.tsx`): `title: "UI Components/<Name>"`,
  `tags: ["autodocs"]`, description from `./<Name>.md?raw`. A component that can't render without an
  env var / external key takes a prop override so a story can drive it (see `TurnstileWidget`'s `siteKey`).
- Full reference → [`code/docs/packages/web/ui-components.md`](../../../../docs/packages/web/ui-components.md).
