# `@indiecrafts/packages-web-page-builder` — page-builder content model (schemas + GROQ)

Auto-loads under `code/packages/web/page-builder/**`. The generic `page` document, the 17 `module.*`
block **schemas**, the sidebar (`sidebar` · `sidebarBlocks` · `sidebarSettings`), the shared
`blockContent` / `link` / `cta` objects, and the `MODULES_FRAGMENT` GROQ. Pure Sanity schema + GROQ — **no React** (the renderers live in `packages-web-ui-components`).
Consumed by the app, the blog, and future apps without depending on the blog. Area rules →
`../../../.claude/CLAUDE.md`.

**Stack:** Sanity v6 · GROQ · TypeScript. Deps: shared-config · shared-ui-icons · web-sanity.

- **Exports:** `./*` → `src/*` — import a subpath (`.../sanity/queries`, `.../sanity/sidebar`, the
  `pageBuilderSanity({ sectionTypes, sidebarTypes, sidebarPages })` barrel: the app adds its own blocks).
- **Schemas here, renderers elsewhere** — adding a `module.<name>` block touches BOTH this brick
  (schema + insert-menu group + `LEAF` in `MODULES_FRAGMENT` + `pageBuilderSanity`) AND `ui-components`
  (`BlockModule` union + `BLOCK_RENDERERS`); miss one and the Studio picker, the `satisfies` build check,
  or doc counts break. The list → the doc's "Adding a block"; the `page-builder-reviewer` agent checks it.
- **Sidebar:** document → page type → default (`resolveSidebar`, `sanity/sidebar.ts`); `none` stops the
  chain. Page types are the app's (`sidebarPages`).
- **`custom-html` renders raw HTML** (`dangerouslySetInnerHTML`) — a trusted-editor escape hatch, keep
  it role-gated.

Full reference → [`code/docs/packages/web/page-builder.md`](../../../../docs/packages/web/page-builder.md).
