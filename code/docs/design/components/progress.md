# Progress

> shadcn `progress` · `src/user-interface/ui/progress.tsx`

**Use when** showing determinate completion of a known-length task (upload, install, multi-step form, %-scored meter). **Don't** use for unknown-duration waits (use a `Spinner`/skeleton), or as a decorative accent bar.

## Anatomy

- **Label** (optional, above the track) — what is progressing, `text-sm font-medium text-foreground`.
- **Track** — the full-width rail, `bg-muted h-2 w-full rounded-full`.
- **Indicator** — the filled portion, `bg-brand`, width driven by `value` (0–100).
- **Value text** (optional, beside/below) — `text-sm text-muted-foreground` (e.g. "60%"). Never inside the track.

## Variants

| Variant               | Use for                 | Base (Tailwind defaults + tokens)                                      |
| --------------------- | ----------------------- | ---------------------------------------------------------------------- |
| Default (determinate) | Known progress 0–100    | track `bg-muted rounded-full`, indicator `bg-brand transition-all`     |
| Success               | Completed/passing meter | indicator swaps to a success role token (add to `DESIGN.md` if absent) |
| Error                 | Failed/blocking process | indicator `bg-error` — pair with a status icon/text, never color alone |

There is no `indeterminate` variant here — Radix supports the state but this component only maps `value`. For unknown waits reach for a spinner, not an animated bar.

## States

- **complete** — at `value=100`, Radix sets `data-state="complete"`; announce completion via the label/value text, not the fill alone.
- **error** — indicator `bg-error` + a Lucide icon (`aria-hidden`) and text; color is never the only signal.
- No hover / focus / active / disabled — Progress is **non-interactive** (a status display, role `progressbar`). It never receives focus and has no focus ring. If a user can act on it, that control is a separate element.

## Hierarchy

One primary progress per task/view; secondary meters (e.g. per-file rows) sit smaller and muted beneath it. Pair with a numeric label so screen readers and glances both land.

## Restrictions

- Never make it focusable or add `focus-visible:ring` — it is not a control.
- Never animate it as a fake loader for indeterminate work — use a spinner/skeleton.
- Never put the percentage text _inside_ the track/indicator — place it above or beside.
- Never let the fill decrease — determinate progress only moves 0 → 100.
- Never signal error/success by bar color alone — add icon or text.
- Never hard-code the fill color — use `bg-brand` (or a semantic role token), never a raw hex.
- Always pass `value` and, for a11y, a label via `aria-label`/`aria-labelledby` and `getValueLabel` when the raw number needs units.

## Tokens

- **Color:** track `bg-muted`; indicator `bg-brand` (primary), `bg-error` (failure). Text `text-foreground` (label) / `text-muted-foreground` (value).
- **Radius:** `rounded-full` (track + indicator).
- **Elevation:** flat — no ring, no shadow.
- **Height:** `h-2` default; `h-1` compact, `h-3` prominent. Width `w-full`.
- **Type:** label `text-sm font-medium`; value `caption` (`text-sm text-muted-foreground`).
- **Motion:** `transition-all` on the indicator ~160ms ease-out; guard with `motion-reduce:transition-none`.
- **Focus:** none (non-interactive).

Sources:

- https://m3.material.io/components/progress-indicators/guidelines
- https://www.radix-ui.com/primitives/docs/components/progress
- https://ant.design/components/progress
- https://carbondesignsystem.com/components/progress-bar/usage/
