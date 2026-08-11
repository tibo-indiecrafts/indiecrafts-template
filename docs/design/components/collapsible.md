# Collapsible

> shadcn `collapsible` · `src/user-interface/ui/collapsible.tsx`

**Use when** a single standalone region toggles open/closed — one "show more", a filter drawer, an expandable row detail (the WAI-ARIA Disclosure pattern). **Don't** use it for a set of related sibling sections with managed open state — that is Accordion.

## Anatomy

- **Root** (`Collapsible`) — container; owns `open` / `defaultOpen`, controlled or uncontrolled. Renders no chrome.
- **Trigger** (`CollapsibleTrigger`) — the toggle. **Unstyled** — you provide the button (or `asChild` an existing one) and any indicator.
- **Content** (`CollapsibleContent`) — the region revealed on open. Also unstyled; exposes `--radix-collapsible-content-height/width` for animating.

## Variants

Collapsible ships **no variants** — it is an unstyled behavior primitive. Style the trigger and content yourself with tokens. Common shapes:

| Shape              | Use for                               | Base (Tailwind defaults + tokens)                                                                               |
| ------------------ | ------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Inline "show more" | Expand a truncated block in flow      | Trigger = ghost `Button` (`text-sm text-muted-foreground`) + chevron; content flat, no chrome                   |
| Card panel         | Standalone toggleable block with edge | Wrap in `rounded-md ring-1 ring-border/60 shadow-sm`; trigger row `flex items-center justify-between px-4 py-2` |
| Row detail         | Reveal detail under a list item       | Trigger = the row; content `pl-4 text-sm text-muted-foreground`                                                 |

## States

- **hover** — trigger only. If a `Button`, inherits its hover token (`hover:bg-accent` for ghost); a bare label uses `hover:underline`. Whole trigger is the hit target.
- **focus-visible** — `focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none` (always on the trigger; free if the trigger is a `Button`).
- **open** — `data-[state=open]`; carry it with a chevron rotate (`[&[data-state=open]>svg]:rotate-180`), never by color alone.
- **disabled** — `disabled:pointer-events-none disabled:opacity-50` on the trigger; pair real disablement with the dim.

## Hierarchy

One self-contained disclosure — secondary to the content around it. Fine to have several independent Collapsibles on a page; each owns its own state (no shared "one open at a time" — that is Accordion).

## Restrictions

- Never reach for Collapsible when you have **multiple coordinated sections** — use Accordion (`type="single"`/`"multiple"`), don't hand-roll shared state across Collapsibles.
- Never leave the trigger a **bare `<div>`** — it must be a button (Trigger renders one, or `asChild` a `Button`); a div breaks Space/Enter and focus.
- Never hide **critical or always-relevant** content (pricing, errors, active form fields) behind a collapsed region.
- Never animate height with a **hardcoded pixel duration** on a fixed height — animate from `--radix-collapsible-content-height` so it works at any content size.
- Keep the chevron `aria-hidden`; the trigger's text is the accessible name.
- Don't add a second click target — the entire trigger toggles; put links inside `CollapsibleContent`.

## Tokens

- **Color** — `text-foreground` label, `text-muted-foreground` chevron/secondary, `border-border` + `bg-background` if wrapped. Neutral — no `bg-brand`.
- **Radius** — none when flat; `rounded-md` (0.5rem default) for the card shape.
- **Elevation** — flat by default; card shape = card (`ring-1 ring-border/60 shadow-sm`).
- **Type** — trigger `text-sm font-medium` (title), content `text-sm` body / `caption` muted.
- **Focus** — `focus-visible:ring-2 focus-visible:ring-ring` (always; do not remove).
- **Motion** — 160ms standard, ≤240ms for the height reveal; ease-out enter / ease-in leave; guard with `motion-reduce:`.
- **Sizing** — trigger row ≥ 40px tap target (44px touch), `px-4` (16px) horizontal padding; chevron `size-5` (20px) / `size-4` (16px compact), 2px stroke.

Sources:

- https://www.radix-ui.com/primitives/docs/components/collapsible
- https://ui.shadcn.com/docs/components/collapsible
