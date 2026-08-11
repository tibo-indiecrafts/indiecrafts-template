# Spinner

> shadcn `spinner` · `src/user-interface/ui/spinner.tsx`

**Use when** an action is running and you can't predict how long it takes (indeterminate wait). **Don't** use it when you know the progress percentage (use a progress bar) or the final layout (use a skeleton).

## Anatomy

- A single spinning Lucide `Loader2Icon` (`animate-spin`) — no track, no label, no wrapper. It carries `role="status"` + `aria-label="Loading"` so it announces itself.

## Variants

The base has no variant axis — it's one icon. Vary the visual by swapping the icon or recoloring via `className`.

| Variant         | Use for                                     | Base (Tailwind defaults + tokens)                                            |
| --------------- | ------------------------------------------- | ---------------------------------------------------------------------------- |
| Default         | Inline / standalone waits                   | `size-4 animate-spin text-muted-foreground`                                  |
| On-brand button | Inside a `bg-brand` action while submitting | `size-4 animate-spin text-brand-foreground` (inherits `currentColor`)        |
| Overlay         | Centered over a loading panel               | `size-6 animate-spin text-muted-foreground` inside a flex-centered container |

## Sizes

Size is set by the `size-*` utility (default `size-4` = 16px), not a prop. Match the spinner to its context — never larger than the text or icon beside it.

| Context                               | Class                            |
| ------------------------------------- | -------------------------------- |
| Inside button / inline with body text | `size-4` (16px)                  |
| Standalone / section-level wait       | `size-5`–`size-6` (20–24px)      |
| Full-panel / route-level              | `size-6`–`size-8`, flex-centered |

## States

A spinner has no interactive states — it is output, not a control.

- **Motion** — `animate-spin` only. Honor reduced motion: gate with `motion-reduce:animate-none` (or swap to a static dot) so it doesn't spin for users who opted out.
- Never attach hover / focus / disabled styling — if it lives inside a `disabled` button, the button owns those states, not the spinner.

## Hierarchy

One active spinner per waiting region. Multiple spinners on a screen read as a broken page — prefer a single region-level spinner or skeletons over one per row.

## Restrictions

- Never render it without an accessible name — keep `role="status"` + `aria-label` (or wrap in a labelled live region). Don't set `aria-hidden`.
- Never signal an error or success state by recoloring the spinner — swap to an icon + text. Never leave a spinner up as a dead-end "error" (color alone is not state).
- Never hardcode a color/size hex or px — use `size-*` + a token (`text-muted-foreground`, `text-brand-foreground`), never `text-blue-500` or `w-[18px]`.
- Never use it when progress is known (→ progress bar) or when the layout is known (→ skeleton); don't block the whole screen for a sub-second fetch.
- Never wrap it in a second `role="status"`/live region — one announcement is enough.

## Tokens

- **Color:** `text-muted-foreground` (default) · `currentColor` inside colored buttons (`text-brand-foreground`). Error/success never via spinner color.
- **Size:** `size-4` default; `size-*` scale, no raw px.
- **Motion:** `animate-spin`; `motion-reduce:animate-none` guard.
- **Radius / elevation / focus:** none — not a surface, not interactive.

Sources:

- https://ui.shadcn.com/docs/components/spinner
- https://m3.material.io/components/progress-indicators/guidelines (indeterminate vs determinate consensus)
