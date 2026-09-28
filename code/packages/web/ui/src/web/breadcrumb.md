> shadcn `breadcrumb` · `src/user-interface/ui/breadcrumb.tsx`

**Use when** a page sits 3+ levels deep in a real URL hierarchy and users may land mid-tree (search, external link). **Don't** use on flat/1–2-level sites, as primary nav, or as a session-history trail.

## Anatomy

- `Breadcrumb` — `<nav aria-label="breadcrumb">` wrapper.
- `BreadcrumbList` — the `<ol>`; wraps, `text-sm text-muted-foreground`.
- `BreadcrumbItem` — one `<li>` per level.
- `BreadcrumbLink` — clickable ancestor (use `asChild` + `@/i18n/routing` `Link`).
- `BreadcrumbSeparator` — chevron between items; `aria-hidden`, `role="presentation"`.
- `BreadcrumbPage` — current page, last item, non-interactive (`aria-current="page"`).
- `BreadcrumbEllipsis` — collapsed middle segments when the trail is long.

## Variants

| Variant      | Use for                         | Base (Tailwind defaults + tokens)                                                    |
| ------------ | ------------------------------- | ------------------------------------------------------------------------------------ |
| Link item    | Ancestor levels                 | `text-muted-foreground hover:text-foreground transition-colors`                      |
| Current page | Last item only                  | `text-foreground font-normal`, `aria-current="page"`, no link                        |
| Separator    | Between items                   | Chevron `[&>svg]:size-3.5`, `aria-hidden="true"`                                     |
| Ellipsis     | Collapsed middle on long trails | `MoreHorizontal size-4` + `sr-only "More"`; pair with a menu to expose hidden levels |

Separator default is `ChevronRight` (`>`). Slash (`/`) is the only other consensus option — pass via `children`; never mix both in one trail.

## States

- **hover** (links only) — `hover:text-foreground` over `transition-colors` (160ms ease-out).
- **focus-visible** (links only) — `focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none`. The `asChild` target (routing `Link`) must carry it.
- **current** — not a state to hover/focus; rendered as `BreadcrumbPage`, non-clickable.

Motion: guard the color transition with `motion-reduce:transition-none`.

## Hierarchy

Sits at the top of the page, just below global nav and directly above the `<h1>` — one breadcrumb per view, and it never competes with the page heading (`text-sm` vs the title role).

## Restrictions

- Never make the current page a link — it stays `BreadcrumbPage` (`aria-current="page"`), not a `BreadcrumbLink`.
- Never use `next/link` on `BreadcrumbLink` — `asChild` wrapping `@/i18n/routing` `Link`.
- Never reflect session history or breadcrumbs that don't map to real, linkable URLs (skip category labels with no page).
- Never expose separators to screen readers — keep `aria-hidden`; don't type `/` or `>` as text.
- Never let it wrap to multiple lines on mobile — collapse middle levels to `BreadcrumbEllipsis` (or truncate the current title) instead.
- Never hard-code separator glyphs or brand color for the current page — use tokens.
- Never bump size to compete with the heading; keep it `text-sm`.

## Tokens

- Color: `text-muted-foreground` (trail), `text-foreground` (current + hover), `border-border` (if a bottom rule is added).
- Type: `text-sm`, caption-scale role; current page `font-normal`.
- Radius / elevation: none — breadcrumb is flat, no card/ring/shadow.
- Focus: `focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none` on every link.
- Icons: Lucide `ChevronRight` at `size-3.5` (separator), `MoreHorizontal` at `size-4` (ellipsis), `aria-hidden`.
- Motion: `transition-colors` ~160ms ease-out; `motion-reduce:transition-none`.

Sources:

- https://ui.shadcn.com/docs/components/breadcrumb
- https://www.nngroup.com/articles/breadcrumbs/
- https://designsystem.digital.gov/components/breadcrumb/
- https://carbondesignsystem.com/components/breadcrumb/usage/
