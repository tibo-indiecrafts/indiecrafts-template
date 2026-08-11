# Slider

> shadcn `slider` · `src/user-interface/ui/slider.tsx`

**Use when** picking a numeric value (or range) from a bounded, continuous scale where an approximate choice with live visual feedback beats typing — volume, opacity, price range, zoom. **Don't** use for precise/known values (number input), binary on/off (switch), unbounded ranges, or non-numeric choices (select/radio).

## Anatomy

- **Track** — full-width rail showing the selectable extent (`bg-muted`, `rounded-full`, `h-1.5`).
- **Range** — filled portion from min to thumb, the fill token (`bg-primary`, i.e. the brand action color).
- **Thumb** — draggable handle, one per value; two = range selection (`size-4`, `rounded-full`, bordered, `shadow-sm`).
- Optional (compose, not shipped): value tooltip/indicator on drag, tick marks + min/max labels for discrete steps.

## Variants

| Variant             | Use for                              | Base (Tailwind defaults + tokens)                           |
| ------------------- | ------------------------------------ | ----------------------------------------------------------- |
| Single (continuous) | One value on a smooth scale          | `defaultValue={[50]}` — one thumb, `step` omitted/`1`       |
| Range (dual thumb)  | A min–max interval                   | `defaultValue={[20, 80]}` — two thumbs render automatically |
| Discrete (stepped)  | Snap to fixed increments             | `step={10}` — thumb snaps; add marks if steps carry meaning |
| Vertical            | Space-constrained / spatial metaphor | `orientation="vertical"` — needs a height, e.g. `min-h-44`  |

## States

- **hover** — `hover:ring-4` on thumb (`ring-ring/50` halo); cursor grab.
- **focus-visible** — `focus-visible:ring-4 focus-visible:outline-hidden` on thumb (keyboard = the only precise path; never remove).
- **active/dragging** — thumb follows pointer; surface the live value (tooltip or a bound `<output>`) so the choice is readable without color alone.
- **disabled** — `data-[disabled]:opacity-50` on root, `disabled:pointer-events-none` on thumb; skip in tab order.
- No loading or error state — a slider is always within valid bounds by construction; validate the committed value elsewhere.

## Hierarchy

An inline control inside a form row or settings panel — pair it with a visible label and current value; at most a handful per view, never as a primary page action.

## Restrictions

- Never use a slider when the exact number matters — pair it with, or replace it by, a number input for precise entry.
- Never ship without a live value readout — a thumb position alone is not an accessible or usable value.
- Never strip the focus ring or rely on `hover:ring` only — keyboard arrow/Home/End/PageUp control must stay visible (Radix owns the WAI-ARIA keyboard pattern; don't hand-roll drag).
- Never label state by fill color alone — pair range/disabled cues with text or the value.
- Vertical sliders need an explicit height or they collapse; touch thumbs must keep a ≥40px hit area even at `size-4` visual.
- Keep `min`/`max`/`step` numeric and honest — don't fake a discrete slider with a continuous one plus rounding.

## Tokens

- **Color** — track `bg-muted`; filled range `bg-primary` (brand action); thumb border `border-primary`, thumb face neutral, halo `ring-ring/50`.
- **Radius** — `rounded-full` on track, range, and thumb.
- **Elevation** — thumb `shadow-sm` (flat control, not a floating surface).
- **Focus** — `focus-visible:ring-4 ring-ring focus-visible:outline-hidden` on the thumb (always).
- **Motion** — `transition-[color,box-shadow]` only (≈160ms ease-out); the ring, not the thumb position, animates. Guard any added motion with `motion-reduce:`.

Sources:

- https://m3.material.io/components/sliders/specs
- https://www.radix-ui.com/primitives/docs/components/slider
- https://ant.design/components/slider
- https://ui.shadcn.com/docs/components/slider
