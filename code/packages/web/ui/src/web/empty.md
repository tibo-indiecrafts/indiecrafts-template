> shadcn `empty` · `src/user-interface/ui/empty.tsx`

**Use when** a region has no data to show and you must explain what belongs there plus the next step (first use, no results, cleared list, error, no access). **Don't** use it for transient loading (use a skeleton/spinner) or a whole-page 404 chrome swap when a section-level empty state fits inside the existing layout.

## Anatomy

- **`Empty`** — centered container (`flex-col items-center justify-center`, `text-center text-balance`). Fills its flex parent (`flex-1`); needs a sized ancestor or it collapses.
- **`EmptyHeader`** — groups the three below, capped at `max-w-sm`.
  - **`EmptyMedia`** — icon / avatar / illustration (top). Optional but usual.
  - **`EmptyTitle`** — one short line, `text-lg font-medium`. What is missing.
  - **`EmptyDescription`** — one–two lines, `text-muted-foreground`. What goes here + how to fill it. Inline `<a>` gets underline + `hover:text-primary`.
- **`EmptyContent`** — actions / input / form below the header (`max-w-sm`). Optional.

## Variants

The container ships **no visible border or fill** — it only sets `border-dashed` (inert without a width class). Opt into a frame at the call site. `EmptyMedia` carries the real `cva` axis.

| Variant                   | Use for                                                               | Base (Tailwind defaults + tokens)                                        |
| ------------------------- | --------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| `EmptyMedia default`      | Avatar, avatar-group, or custom illustration — renders the child bare | `bg-transparent`, no tile                                                |
| `EmptyMedia icon`         | A single Lucide glyph — the everyday case                             | `size-10 rounded-lg bg-muted text-foreground`, inner `[&_svg]:size-6`    |
| container: bare (default) | Empty nested inside a card/panel that already frames it               | no `border`, no `bg`                                                     |
| container: outline        | Standalone placeholder that needs its own edge                        | add `border` (activates the dashed `rounded-lg` edge on `border-border`) |
| container: filled         | Softer standalone placeholder                                         | add `bg-muted/50` (or a `bg-gradient-*`); drop the border                |

## States

Static display surface — no interactive state on `Empty`, `EmptyHeader`, or `EmptyMedia`. State classes live only on the controls you drop into `EmptyContent`:

- **focus-visible** (buttons/links/input) — `focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none`.
- **hover** (description link) — `hover:text-primary` (built in).
- **loading / error** — not props here; they are _sibling_ states you swap in place of `Empty` (skeleton while loading, an error-copy Empty when the fetch fails).

## Hierarchy

One `Empty` per region, occupying the space its data would fill. It is a fallback, not a section — never stack two, and never let it outrank the page's real heading.

## Restrictions

- Never keep the region's **primary CTA only inside** the empty state — the persistent action (e.g. "New post" in the toolbar) stays put whether the region is full or empty, so the layout doesn't shift as users learn it (Carbon). `EmptyContent` actions are _additional_ prompts, not the relocated primary.
- Never inline copy — title/description/action strings live in `messages/<locale>.json`.
- Never expect a border out of the box — `border-dashed` alone draws nothing; add `border` to see it.
- Never render `Empty` without a height-bearing parent — with only `flex-1` and no sized ancestor it collapses to nothing.
- Never drop a large raster illustration or a raw hex color — use the `icon` media tile (`bg-muted`) with a Lucide glyph, or a token-driven SVG.
- Never signal the state by icon color alone — the title text carries the meaning; the icon is `aria-hidden`.
- Never reach for `Empty` as a toast, dialog, or loading spinner — it is the no-data placeholder only.
- Don't fabricate a `size` prop — there is no size axis; scale via `p-6 md:p-12` (default) or a `className` override.

## Tokens

- **Color:** `text-foreground` (title, icon glyph) · `text-muted-foreground` (description) · `bg-muted` (icon tile) · `border-border` (outline variant) · `hover:text-primary` (description links). Primary action inside `EmptyContent` = `bg-brand text-brand-foreground`; destructive = error token only.
- **Radius:** `rounded-lg` (container edge, 0.75rem) · icon tile `rounded-lg`.
- **Elevation:** flat by default; the outline variant is a dashed border, no shadow. Don't add elevation — an empty state is not a raised card.
- **Type:** title `text-lg font-medium tracking-tight` · description `text-sm/relaxed` · content `text-sm`. Roughly the _title_ / _body_ / _caption_ roles.
- **Icon:** Lucide, `size-6` (24px) inside the `size-10` tile, 2px stroke, `aria-hidden`.
- **Focus:** `focus-visible:ring-2 ring-ring` on `EmptyContent` controls only.
- **Motion:** none by default. If the state fades in after an async fetch, ≤240ms `ease-out`, guarded with `motion-reduce:`.

Sources:

- https://ui.shadcn.com/docs/components/empty
- https://ant.design/components/empty
- https://carbondesignsystem.com/patterns/empty-states-pattern/
- https://atlassian.design/components/empty-state
