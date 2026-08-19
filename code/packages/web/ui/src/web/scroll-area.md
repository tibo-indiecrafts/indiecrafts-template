# Scroll area

> shadcn `scroll-area` · `src/user-interface/ui/scroll-area.tsx`

**Use when** a bounded region (fixed height/width) overflows and you want a styled, cross-browser scrollbar that matches the theme. **Don't** wrap the whole page or a region that should grow — let the document scroll natively instead.

## Anatomy

- `ScrollArea` (Root) — `relative` positioning context, sets the clip bounds.
- `Viewport` — the scrollable layer; carries `rounded-[inherit]` + focus ring.
- `ScrollBar` (thumb track) — vertical (default) or horizontal, `w-2.5`/`h-2.5`.
- `Thumb` — draggable `bg-border rounded-full` handle.
- `Corner` — fills the vertical/horizontal intersection.

## Variants

| Variant            | Use for                                      | Base (Tailwind defaults + tokens)                                                     |
| ------------------ | -------------------------------------------- | ------------------------------------------------------------------------------------- |
| Vertical (default) | Long lists, panels, chat logs in a fixed box | `<ScrollArea className="h-[200px] w-full rounded-md border">` — `<ScrollBar>` implied |
| Horizontal         | Card rows, image strips, wide tables         | add `<ScrollBar orientation="horizontal" />`; give children `flex w-max`              |
| Both axes          | Wide + tall content (e.g. code, tables)      | render both `<ScrollBar>` orientations; `Corner` handles the join                     |

Visibility is Radix's `type` prop on Root, default `"hover"`: `hover` (show on hover/scroll), `scroll` (show while scrolling), `always`, `auto` (native-like). Keep `hover` unless the box is always overflowing and users need a persistent affordance (`always`).

## States

- **focus-visible** (Viewport): `focus-visible:ring-ring/50 focus-visible:ring-[3px]` — keyboard scroll target, do not remove.
- **hover** (scrollbar): thumb/track fade in via `transition-colors`; governed by `type`, not a class.
- No disabled/loading/error state — this is a layout primitive; put those on the content inside.

## Hierarchy

A local, contained scroller — one per bounded region. Never the page's primary scroll; at most a few per view (sidebar, panel, a horizontal strip).

## Restrictions

- Never use it as the page/body scroller — it swallows native document scroll, momentum, and scroll-anchoring.
- Never omit an explicit height/width on Root — with no bound there is nothing to overflow and no scrollbar appears.
- Never edit `scroll-area.tsx` to restyle — pass `className` to `ScrollArea`/`ScrollBar`; the file is shadcn CLI-managed.
- Never wrap a Radix/shadcn menu, popover, or select list — those primitives own their own scroll/keyboard handling.
- Horizontal: put `flex w-max` (or a grid) on the direct child, else content wraps instead of scrolling.
- Don't hand-roll a keyboard handler — native scrolling + the Viewport focus ring already cover arrow/Page keys.

## Tokens

- **Color:** thumb `bg-border`; container border `border-border`, surface `bg-background`/`bg-card`.
- **Radius:** `rounded-md` on the container; thumb is `rounded-full`; Viewport inherits via `rounded-[inherit]`.
- **Focus:** `focus-visible:ring-ring` (Viewport) — always present, keyboard scroll target.
- **Motion:** `transition-colors` on scrollbar fade; respects `motion-reduce:` (no layout animation here).
- **Elevation:** none intrinsic — pair with `card` (`ring-1 ring-border/60 shadow-sm`) on the wrapper when it needs to read as a surface.

Sources:

- https://www.radix-ui.com/primitives/docs/components/scroll-area
- https://ui.shadcn.com/docs/components/scroll-area
