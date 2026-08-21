---
description: Build shadcn-way — cn/cva, asChild/data-slot, no primitive forks.
---

# Component architecture

Load when adding or changing UI components (shadcn/ui + Tailwind v4).

**Reuse before create** (least → most effort): reuse an existing part → add a backward-compatible `cva` variant → wrap the primitive → compose primitives → new shared part (`src/user-interface/`) → page-specific. Never duplicate a part just because it has a different name.

**The shadcn way**

- Merge classes with `cn()` (`@indiecrafts/packages-shared-utils`) — never string-concatenate; passed `className` wins (component classes first, `{className}` last).
- Vary with `cva`, not forks — add a case to the map + its union type.
- `asChild` to change the rendered element; `data-slot` is the styling hook — target `[data-slot="…"]`, don't reach into internals.
- Semantic tokens over `dark:` — `bg-card`/`text-foreground` flip automatically.
- Container queries (`@container` on the wrapper + named `@4xl:` variants — not `@min-4xl:`) when a
  component's own width drives layout. **Required** for any reusable block renderer that appears in
  both the full-width slot AND the ~768px blog column (the inline `module.*` types) — put `@container`
  on the block's own wrapper (like `PersonList`/`CardList`/`StatList`), not on `ModuleSection`.

**Slots, not config props**

- A **dev-facing** component exposes **JSX slots** (`header`/`media`/`children`/`footer`) — the
  consumer owns content, the component owns layout. Don't grow a list of presentational props
  (`title`/`subtitle`/`icon`/`actionLabel`/`badge`…); that's a config language, not a component.
  `@indiecrafts/packages-web-ui`'s `Card`/`Empty`/`Item` (`Header`/`Content`/`Footer` parts) are the pattern.
- **Deliberate exception — data-driven renderers.** The page-builder block renderers
  (`@indiecrafts/packages-web-ui-components/src/web/{layout,collection,content,media,form}/*`) and the
  `system-pages`/`announcement` components take **resolved Sanity/i18n data** as props by design:
  the editor (Sanity) or the app (`messages/`) drives them, not a developer composing JSX. That's
  data-in, not a prop-bag — don't "fix" it into slots.

**Never**

- Hand-edit `@indiecrafts/packages-web-ui` primitives (shadcn, CLI-managed).
- Depend on an internal component library at runtime — copy from it, then adapt.
- Import from `next/link` / `next-intl/navigation` — use `@/i18n/routing`.
- Files > 200 lines (components) / 150 (page templates) — split at the seam.
