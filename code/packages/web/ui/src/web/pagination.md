> shadcn `pagination` · `src/user-interface/ui/pagination.tsx`

**Use when** splitting a long list/table (roughly >25 items) into ordered pages the user steps through. **Don't** use for endless feeds or <2 pages — use infinite scroll / load-more, or render nothing.

## Anatomy

- `Pagination` — `<nav role="navigation" aria-label="pagination">` wrapper, centered.
- `PaginationContent` — `<ul>` row of items, `gap-1`.
- `PaginationPrevious` — leading control: ChevronLeft + "Previous" (label hides below `sm`).
- `PaginationItem` → `PaginationLink` — page-number links; the current one is `isActive`.
- `PaginationEllipsis` — collapsed run of hidden pages (MoreHorizontal, `aria-hidden`, sr-only "More pages").
- `PaginationNext` — trailing control: "Next" + ChevronRight (label hides below `sm`).

## Variants

| Variant        | Use for                                              | Base (Tailwind defaults + tokens)                 |
| -------------- | ---------------------------------------------------- | ------------------------------------------------- |
| Standard       | Known page count                                     | Prev · numbers + ellipsis · Next                  |
| Number-only    | Compact / data tables                                | drop Prev/Next, keep `PaginationLink` numbers     |
| Prev/Next-only | Unknown total, or paired with a rows-per-page select | keep only `PaginationPrevious` / `PaginationNext` |

Active page = `PaginationLink` `isActive` → `variant="outline"` (`border-border`, `bg-background`); inactive = `ghost` (transparent, `hover:bg-muted`). This is the primary signal — no `bg-brand` needed for the current page.

## Sizes

| Size                      | Height          | Padding  | Text   |
| ------------------------- | --------------- | -------- | ------ |
| `icon` (numbers, default) | `size-9` (36px) | —        | `body` |
| `default` (Prev/Next)     | 40px            | `px-2.5` | `body` |

Numbers use the button `icon` size (`size-9`), so keep the whole control on one 40px touch row — do not shrink below it on mobile.

## States

- **hover** — inactive link `hover:bg-muted hover:text-foreground`.
- **focus-visible** — `focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none` (inherited from `buttonVariants`; never strip it).
- **active/current** — `aria-current="page"` + `data-active` + outline variant. Never signal the current page by color alone — the outline border carries it.
- **disabled** — at first/last page, disable (or omit) Prev/Next: `aria-disabled`, `pointer-events-none opacity-50`. Do not render a dead clickable link.

## Hierarchy

One pagination per list/table, at the list's foot (a table may mirror it at the top). It is secondary navigation — never the page's primary CTA; keep it quiet (`ghost`/`outline`, no `bg-brand`).

## Restrictions

- Never `import Link from "next/link"` in this file's consumers — route through `@/i18n/routing` (locale-aware). The shadcn default `<a>` breaks i18n.
- Never place `PaginationEllipsis` at the very start or end of the number run — it only stands in for a _middle_ gap (Carbon).
- Never inline "Previous"/"Next"/"More pages" — move to `messages/<locale>.json`; keep `aria-label`s translated too.
- Never render numbers with no active state, or two active pages — exactly one `isActive`.
- Never use `bg-brand` for the current page — the brand color is reserved for the primary action; the outline variant is the correct signal.
- Never hand-roll disabled Prev/Next as a styled span with an onClick that no-ops silently — set `aria-disabled` + remove pointer events.
- Ellipsis is decorative (`aria-hidden`) — never make it focusable/clickable.

## Tokens

- Color: `bg-background`, `text-foreground`, `text-muted-foreground`; hover `bg-muted`; border `border-border` (active outline). No `bg-brand`.
- Radius: inherits button `rounded-md` (0.5rem).
- Elevation: flat — no shadow.
- Type: `body`; the optional "Page X of Y" helper is `caption` (`text-muted-foreground`).
- Focus: `focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none`.
- Motion: `transition-colors` ~160ms ease-out on hover/focus; `motion-reduce:transition-none`.
- Icons: Lucide ChevronLeft/Right + MoreHorizontal, 16px here (`size-4`), 2px stroke, `aria-hidden`.

Sources:

- https://ui.shadcn.com/docs/components/pagination
- https://carbondesignsystem.com/components/pagination/usage/
- https://ant.design/components/pagination/
