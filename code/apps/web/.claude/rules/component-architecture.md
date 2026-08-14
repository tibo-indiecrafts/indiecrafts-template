---
description: Build shadcn-way — cn/cva, asChild/data-slot, no primitive forks.
---

# Component architecture

Load when adding or changing UI components (shadcn/ui + Tailwind v4).

**Reuse before create** (least → most effort): reuse an existing part → add a backward-compatible `cva` variant → wrap the primitive → compose primitives → new shared part (`src/user-interface/`) → page-specific. Never duplicate a part just because it has a different name.

**The shadcn way**

- Merge classes with `cn()` (`@indiecrafts/utils`) — never string-concatenate; passed `className` wins (component classes first, `{className}` last).
- Vary with `cva`, not forks — add a case to the map + its union type.
- `asChild` to change the rendered element; `data-slot` is the styling hook — target `[data-slot="…"]`, don't reach into internals.
- Semantic tokens over `dark:` — `bg-card`/`text-foreground` flip automatically.
- Container queries (`@container` on the wrapper + named `@4xl:` variants — not `@min-4xl:`) when a
  component's own width drives layout. **Required** for any reusable block renderer that appears in
  both the full-width slot AND the ~768px blog column (the inline `module.*` types) — put `@container`
  on the block's own wrapper (like `PersonList`/`CardList`/`StatList`), not on `ModuleSection`.

**Never**

- Hand-edit `@indiecrafts/ui` primitives (shadcn, CLI-managed).
- Depend on an internal component library at runtime — copy from it, then adapt.
- Import from `next/link` / `next-intl/navigation` — use `@/i18n/routing`.
- Files > 200 lines (components) / 150 (page templates) — split at the seam.
