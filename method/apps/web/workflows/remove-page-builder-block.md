# Workflow — remove a page-builder block

The inverse of `add-page-builder-block.md`. Same ~8 code locations + 4 doc count-refs.
Grep first, delete in dependency order, sync the counts down.

## Map it first

```
grep -rn 'module\.<name>\|<Name>Module\|from "\./<Name>"' code/modules/blog/src
```

Also check the seed (`scripts/seed-blog-demo.mjs`) — if it creates instances of
this module, remove them too, or the seed writes an unknown `_type`.

## Delete (order matters)

1. **Renderer files** — generic: `code/packages/ui-components/src/renderers/web/<domain>/<Name>.tsx`
   (+ any client child) **and its colocated `<Name>.stories.tsx` + `<Name>.md`**; blog-specific:
   `code/modules/blog/src/user-interface/renderers/<Name>.tsx`.
2. **Schema file** — `code/modules/blog/src/sanity/schema/modules/<name>.ts`.
3. **Schema index** — `schema/modules/index.ts`: drop the `import`, the
   `moduleSchemas` array entry, and the `"module.<name>"` in `MODULE_TYPES`.
4. **Type** — generic: remove the `<Name>Module` type **and** its `BlockModule` union
   member in `code/packages/ui-components/src/types.ts`.
5. **Registry** — generic: `code/packages/ui-components/src/renderers/web/registry.tsx`: drop the
   `import` + `BLOCK_RENDERERS` entry (the `satisfies` check will error if you miss the pair).
   Context-aware blog blocks: also the blog's `user-interface/renderers/ModuleRenderer.tsx`.
6. **Inline lists (if it was inline)** — remove from `INLINE_MODULES` (the blog's
   `sanity/schema/blockContent.ts`) **and** `INLINE_TYPES`
   (`code/packages/ui-components/src/renderers/web/portable-text-components.tsx`); fix the "N types" comment.
7. **Query** — remove its `MODULES_FRAGMENT` projection if it had one.
8. **Copy** — delete its `pages.blog.*` keys from `messages/{en,fr}.json`
   **unless** another component still uses them (grep the key first — e.g.
   `breadcrumbsLabel` stayed because `DefaultPostLayout` still uses it).

## Now-dead code

Check for attributes/props that existed only to feed this module (e.g. removing
`module.search` orphaned `data-search-title` on `BlogCard`). Grep the consumer;
if this module was the only one, remove it too.

## Docs + finish

- Sync counts **down** in the same four docs as `add-page-builder-block.md`.
- `grep -rn 'module\.<name>'` again → must be empty (ignore `docs/.vitepress/dist`).
- `pnpm tsc`, then log in the app changelog `code/apps/web/CHANGELOG.md`.
