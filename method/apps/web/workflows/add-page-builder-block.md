# Workflow — add a page-builder block

Adding a `module.<name>` touches ~8 code locations + 4 doc count-refs. Miss one
and the Studio picker, the TS exhaustiveness check, or the docs go stale. Follow
in order. Decide first: **inline-embeddable** (can sit in a post body) or
**layout-slot only** (`postModules` only)?

Post-extraction, a **generic** block (`stat-list`, `card-list`, …) — renderer, registry
entry, and type — lives in `@indiecrafts/ui-components` (shared by the app + blog); its
**schema** lives in `@indiecrafts/page-builder`. A **blog-specific** block (`blog-post-list`, …)
lives entirely in the blog. Paths below name both homes.

## Code

1. **Schema** — generic: `code/packages/page-builder/src/sanity/schema/modules/<name>.ts` (blog-specific: `code/modules/blog/src/sanity/schema/modules/<name>.ts`) via `defineModule({ name: "module.<name>", title, icon?, description?, fields, preview })` (import `defineModule` from `@indiecrafts/page-builder/sanity/schema/objects/define-module`).
2. **Schema index** — generic: `@indiecrafts/page-builder` `schema/modules/index.ts` — `import` it, add to `moduleSchemas` (right group) + `"module.<name>"` to `MODULE_TYPES`. Blog-specific: the blog's `schema/modules/index.ts` (`blogModuleSchemas` + `BLOG_MODULE_TYPES`).
3. **Type** — generic: add `export type <Name>Module = ModuleBase & { _type: "module.<name>"; … }` to the `BlockModule` union in `code/packages/ui-components/src/types.ts`. (Blog-specific post types stay in `code/modules/blog/src/sanity/types.ts`.)
4. **Renderer** — generic: `code/packages/ui-components/src/renderers/web/<domain>/<Name>.tsx` (`<domain>` = content · media · collection · layout); blog-specific: `code/modules/blog/src/user-interface/renderers/<Name>.tsx`. Server by default; split a `"use client"` child if it needs hooks (see `renderers/web/media/{Gallery,GalleryCarousel}.tsx`).
   - **Doc + story** — colocate a `<Name>.md` usage doc (mirror `renderers/web/content/Callout.md` / a `ui/src/*.md`) **and** a `<Name>.stories.tsx` (mirror `renderers/web/content/Callout.stories.tsx`: `Meta`/`StoryObj` from `@storybook/nextjs-vite`, mock the module shape via `renderers/web/_mock.ts`, and `import docs from "./<Name>.md?raw"` → `parameters.docs.description.component`). Both surface in `@indiecrafts/storybook` (`pnpm storybook`). Same rule for a new `@indiecrafts/ui` primitive — its `.md` (already the convention) + a colocated `.stories.tsx`.
5. **Registry** — generic: `import` + add to `BLOCK_RENDERERS` in `code/packages/ui-components/src/renderers/web/registry.tsx` (the `satisfies` check enforces exhaustiveness — a miss is a compile error). Context-aware blog blocks (`blog-post-list`/`blog-post-content`) special-case in the blog's `user-interface/renderers/ModuleRenderer.tsx` instead (it spreads `{ ...BLOCK_RENDERERS, … }`).
6. **Inline (only if body-embeddable)** — add `"module.<name>"` to `INLINE_MODULES` in `@indiecrafts/page-builder`'s `sanity/schema/blockContent.ts` **and** `INLINE_TYPES` in `code/packages/ui-components/src/web/portable-text-components.tsx` (keep the two in lockstep; update the "N types" comment).
7. **Query (only if it has references)** — add a `_type == "module.<name>" => { … }` projection to `MODULES_FRAGMENT` in `code/packages/page-builder/src/sanity/queries.ts` (a blog-specific block's projection goes in the blog's `queries.ts`, which appends to the generic fragment). Ref-less modules pass through the leading `...`. **Images:** project `image { asset->{ url, metadata }, alt }` (not just `url`) so the renderer can pass `placeholder="blur"` + `blurDataURL={lqip}`, and set `options: { metadata: ["lqip"] }` on the schema field. Render with `next/image` + `sizes` — the CDN loader sizes it (`method/apps/web/rules/sanity-images.md`).
8. **Copy** — any UI strings → `messages/{en,fr}.json` under `pages.blog.*` (never inline).

## Docs (keep counts in sync — the step that's easiest to forget)

Bump the module total + the inline/layout-slot split in: `code/modules/blog/CLAUDE.md`
(3 spots + the inline/layout-slot lists), `docs/modules/blog/blog-architecture.md`
(`MODULE_TYPES` listing, `<N module schema files>`, "N of the M"),
`docs/modules/blog/sanity-setup.md` (module table row, catalog count, file tree,
`<N module component files>`), and — for a **generic** block — the renderer count in
`docs/packages/ui-components.md`.

## Finish

- `pnpm tsc` (the `satisfies` maps catch a missing registry/type entry).
- Log it: a blog block → `code/modules/CHANGELOG.md`; a generic renderer touching
  `ui-components` → also `code/packages/CHANGELOG.md`. Plain-language _why_.
- Rules that apply: `method/apps/web/rules/{component-architecture,naming,accessibility}.md`.
