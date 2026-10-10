---
title: "Page builder (content model + blocks)"
description: "The site-wide page-builder content model — the generic page document, the 17 generic module.* blocks, the sidebar and the GROQ that resolves them."
status: stable
---

# Page builder (content model + blocks)

The site-wide **page-builder content model**:

- the generic `page` document;
- the 17 generic `module.*` block **schemas**;
- the **sidebar** (`sidebar`, `sidebarBlocks`, the per-locale `sidebarSettings`);
- the reusable `blockContent` / `link` / `cta` objects;
- the `quote` / `person` entities the blocks reference;
- the `MODULES_FRAGMENT` GROQ that resolves them.

It lives in **`@indiecrafts/packages-web-page-builder`** (`code/packages/web/page-builder`), consumed as source. It is pure Sanity schema + GROQ, with no React. The **renderers** live in `@indiecrafts/packages-web-ui-components`.

The app, the blog and future apps compose pages from the same blocks **without depending on the blog module**. The blog adds its own 12 `blog-*` blocks on top.

## How it fits together

| Step   | What happens                                                                                                                                                                                                          |
| ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Schema | Each block is a `defineModule` object: its own fields + `anchor` + `hidden`. An array lists the block types it accepts.                                                                                               |
| Studio | Every block array has an insert menu (`blockInsertMenu`): Mise en page · Contenu · Médias · Formulaires · Blog · Autres. Each block has an icon and a description.                                                    |
| Query  | `MODULES_FRAGMENT` spreads each block and resolves its images, galleries, refs, CTAs and form switch, at the top level and inside a container's rich text. The blog's `MODULES_FRAGMENT` adds its own blocks' refs.   |
| Render | The blog's `Modules` dispatcher paints a block list: its own blocks first, then the generic ones through `renderBlock` / `BLOCK_RENDERERS`. A hidden block renders nothing, at the top level and inline in rich text. |

## What it owns

| Surface      | Contents                                                                                                                                                                                                  |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Documents    | `page` (slug · seo · `sections[]` · `sidebar` · i18n), `sidebarSettings` (one per locale), `quote`, `person`                                                                                              |
| Objects      | `blockContent`, `link` (page **or** post internal target), `cta`, `sidebar`, `sidebarBlocks`                                                                                                              |
| Modules (17) | `hero · feature-grid · pricing · accordion-list · callout · card-list · gallery · person-list · prose · stat-list · step-list · quote-list · custom-html · newsletter · waitlist · lead-magnet · contact` |
| Inline (13)  | `INLINE_MODULES` — the blocks an editor can drop into rich text: all but `hero`, `feature-grid`, `pricing`, `prose`. A test keeps it equal to the renderer's `INLINE_TYPES`.                              |
| GROQ         | `MODULES_FRAGMENT` (+ `LINK_FRAGMENT` / `CTA_FRAGMENT`); `sidebarProjection` and `sidebarSettingsQuery` (`sanity/sidebar.ts`)                                                                             |
| Barrel       | `pageBuilderSanity({ sectionTypes, sidebarTypes, sidebarPages })` (`SanityModule`) — schema + desk (Accueil · Pages · Barre latérale · Témoignages · Équipe) + i18n templates                             |

## Blog blocks on any page

`pageBuilderSanity({ sectionTypes })` adds the app's blocks to `page.sections[]`. The website passes the blog's `BLOG_SECTION_TYPES`, so a page or the home page can promote the blog:

`blog-featured` · `blog-trending` · `blog-post-list` · `blog-collection` · `blog-category-spotlight` · `blog-topic-cards` · `blog-hero` · `blog-explore`.

The blog's own page chrome (`blog-index`, `blog-post-content`) stays out. `blog-featured` has an `editorial` layout (a lead card beside a short list); the home page's "Articles à la une" strip is that block. With the blog turned off (`features.blog`), the website drops every `blog-*` block (`siteBlocks`).

## Sidebar

Any page type can show a column of **cards** beside its content. Each card is a page-builder block.

**Which cards** — the most specific choice wins:

1. the document's own `sidebar` (`page`, `post`): `inherit` · `custom` (its cards) · `none`;
2. its page type in Site web → Barre latérale (`sidebarSettings-<locale>.byType.<type>`), with the same three modes;
3. the default cards of that locale (`sidebarSettings-<locale>.default`).

`none` at any level stops there: no sidebar. `resolveSidebar` (`sanity/sidebar.ts`) holds the rule and its tests.

**Page types** are the app's: the website lists `home · page · blogIndex · post · blogListing` in `src/sanity/sidebar-pages.ts`. A new site adds a type there and wraps its route in `PageSidebar`.

**Cards** — `sidebarBlocks` accepts at most 6, from:

- the generic `GENERIC_SIDEBAR_TYPES`: callout · card-list · prose · quote-list · stat-list · custom-html · newsletter · lead-magnet · waitlist;
- the blog's `BLOG_SIDEBAR_TYPES`: blog-toc · blog-related (the post being read) · blog-trending · blog-featured · blog-post-list · blog-collection (a compact list of links in a card).

**Layout** (`WithSidebar`, `SidebarCard` in ui-components):

- From `lg`: content + an 18rem column; the cards stick below the header.
- Below `lg`: the cards follow the content. DOM order is reading order.
- The TOC card shows from `lg`; a phone opens the same list above the article (`MobileToc`).
- A card that renders nothing leaves no gap.

The seed gives articles the post's TOC + related posts; the other types inherit an empty default. `scripts/sidebar-migrate.mjs` does the same for an existing dataset (dry run first).

## Consumers

- **Website** — `sanity.config.ts` (`pageBuilderSanity({ … })`), the home and `/[locale]/[...slug]` routes (the blog's `MODULES_FRAGMENT` + `Modules`, then `PageSidebar`), and every blog route (`PageSidebar`, or `postSidebar` beside a post body).
- **Blog** — imports `MODULES_FRAGMENT`, `sidebarProjection`, `defineModule`, `blockInsertMenu`; references `blockContent` / `link` / `cta` / `sidebar` by type name.
- **ui-components** — the renderers (`BLOCK_RENDERERS`), `WithSidebar` and `SidebarCard`.

## Adding a block

A `module.<name>` block is easy to half-wire. A miss breaks the Studio picker, the TS exhaustiveness `satisfies` check, or leaves doc counts stale. Touch **every** file in the same change:

1. **Schema** — `code/packages/web/page-builder/src/sanity/schema/modules/<name>.ts` (via `defineModule`, with an icon and a description); register it in `modules/index.ts` (`moduleSchemas` + `MODULE_TYPES`; a test keeps them equal).
2. **Picker** — its group in `GROUPS` (`schema/objects/insert-menu.ts`). An ungrouped block lands in "Autres".
3. **Inline / sidebar** — add it to `INLINE_MODULES` (and `INLINE_TYPES`) if it belongs in rich text, to `GENERIC_SIDEBAR_TYPES` if it fits a card.
4. **GROQ** — extend `LEAF` (`src/sanity/queries.ts`) if it holds images, refs or CTAs. `...` already spreads scalar fields.
5. **Type** — add `<Name>Module` to the `BlockModule` union (`@indiecrafts/packages-web-ui-components` `src/shared/types.ts`).
6. **Renderer + registry** — `src/web/<domain>/<Name>.tsx`, built on `ModuleSection` (honour `inline`) and sized with `@container`, never viewport breakpoints. Add it to `BLOCK_RENDERERS` (`src/web/registry.tsx`); the `satisfies` clause fails the build if the `_type` is missing.
7. **Story + doc** — colocated `<Name>.stories.tsx` + `<Name>.md`.
8. **Docs + changelog** — this page's counts + the packages `CHANGELOG.md`.

The `page-builder-reviewer` agent checks the list.

## Removing a field

Drop it from the schema, the `<Name>Module` type, the block `.md`, `seed.mjs`, and the website `schema.json` (`sanity schema extract --path schema.json --force`). Documents that still hold the value show an "unknown field" warning in Studio. Clear them once with `client.patch(id).unset([path])` from a script (see `scripts/sidebar-migrate.mjs`: dry run by default, `--apply` to write). Walk `page.sections`, `post.body` and `blog.postModules` / `frontpageModules` recursively, because blocks nest inside `blockContent`.

## Ceiling

- `custom-html` renders raw HTML (`dangerouslySetInnerHTML`) — a trusted-editor escape hatch, not the modelled default; keep it role-gated.
- GROQ cannot recurse: a block inside a container inside a container is not resolved (`LEAF` covers one level).
- Site pages dispatch through the blog's `Modules` and drop blog blocks by their `module.blog-` prefix (`siteBlocks`). A second content module (shop, events) needs a renderer registry that modules register into.
- Not built yet: reusable section documents (one block shared by several pages), insert-menu preview images, and the Presentation preview for `page` (pages read the published perspective).
