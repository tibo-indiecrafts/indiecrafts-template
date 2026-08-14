# Tooltip

> shadcn `tooltip` · `src/user-interface/ui/tooltip.tsx`

**Use when** labelling an icon-only control or adding brief, non-essential context on hover/focus. **Don't** put anything essential, interactive, or long inside it — that's a Popover, Dialog, or inline text.

## Anatomy

- **Provider** (`TooltipProvider`) — wraps the app/subtree, owns global `delayDuration`. Required ancestor.
- **Root** (`Tooltip`) — open-state controller.
- **Trigger** (`TooltipTrigger`) — the focusable element being described (`asChild` to reuse a real button).
- **Content** (`TooltipContent`) — portalled floating label + `Arrow` pointer.

## Variants

Base shadcn ships **one** variant — a plain, non-interactive label. There is no color or intent axis; a tooltip is never brand/destructive-colored.

| Variant         | Use for                                                          | Base (Tailwind defaults + tokens)                                                                                      |
| --------------- | ---------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Plain (default) | Icon-button labels, short hints (1–4 words / one short sentence) | `bg-foreground text-background rounded-md px-3 py-1.5 text-xs w-fit text-balance` + matching `Arrow` `fill-foreground` |

Need a subhead, links, or buttons? That is a **Rich tooltip / Popover** — build it as a Popover, not by extending this file.

## Sizes

No size axis. One padding/type step (`px-3 py-1.5 text-xs`). Do not scale it up to hold more content — shorten the content instead.

## States

- **hover / focus-visible** — the trigger opens the tooltip; both must work (keyboard users get it via `focus-visible`). Content enters `animate-in fade-in-0 zoom-in-95` + directional slide, exits `data-[state=closed]:animate-out fade-out-0 zoom-out-95`.
- **active** — no distinct state; activating the trigger (Enter/Space/click) closes the tooltip.
- **disabled** — never wrap a disabled trigger. A disabled element fires no hover/focus events, so the tooltip is unreachable. Keep the control enabled, or move the reason to visible text.
- **loading / error** — N/A. A tooltip carries static label text only.

## Hierarchy

Lowest-priority affordance in a view: supplemental, dismissible, one per focused element. Never the only place a critical fact appears. If two tooltips could show at once, the design is wrong.

## Restrictions

- Never put **essential** information in a tooltip — low discoverability, invisible on touch (no hover).
- Never put **interactive** content (links, buttons, form fields) inside — it's non-actionable by contract; use a Popover.
- Never attach to a **disabled** or non-focusable element — wrap a `<span tabIndex={0}>` or keep it enabled.
- Never hard-code the copy — tooltip text is user-facing → `messages/<locale>.json`.
- Don't add a tooltip that just repeats the trigger's own visible label.
- Don't raise `delayDuration` on icon-only controls; the label should appear promptly.
- Keep it plain — no brand/error colors, no size bump, no rich layout.

## Tokens

- **Color** — inverted by design: `bg-foreground` surface + `text-background` text (both flip in dark mode automatically); `Arrow` uses `fill-foreground`. No `bg-brand`/`error`.
- **Radius** — `rounded-md` (0.5rem, default).
- **Elevation** — flat: no ring/shadow in base (the inverted fill is the separation). Keep it flat; don't promote to `card`/`overlay`.
- **Type** — `text-xs` caption-scale, `text-balance`.
- **Focus** — the _trigger_ owns `focus-visible:ring-2 ring-ring` (it's the interactive element); the content is `role="tooltip"`, never focused.
- **Motion** — `fade-in-0 zoom-in-95` enter / `fade-out-0 zoom-out-95` exit, well under 240ms; respects `motion-reduce:` via the animation utilities.

Sources:

- https://m3.material.io/components/tooltips/guidelines
- https://carbondesignsystem.com/components/tooltip/usage/
- https://atlassian.design/components/tooltip/usage/
- https://www.radix-ui.com/primitives/docs/components/tooltip
