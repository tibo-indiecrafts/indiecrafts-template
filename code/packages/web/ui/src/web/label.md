> shadcn `label` · `src/user-interface/ui/label.tsx`

**Use when** naming a single form control (input, checkbox, radio, switch, select) so it is clickable and screen-reader announced. **Don't** use it for section headings, helper/error text, or as a substitute for a placeholder.

## Anatomy

- Label text (`text-sm font-medium`) — the visible name.
- Optional required marker (`*`) or `(optional)` hint, inline after the text via the `gap-2` flex row.
- The control it names — bound by `htmlFor={id}` ↔ `id` (programmatic association, never proximity alone).

## Variants

The component ships **no `cva` variants** — one visual style. Compose the differences with children + tokens.

| Variant         | Use for                                                     | Base (Tailwind defaults + tokens)                                                              |
| --------------- | ----------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Default         | Every labelled control                                      | `flex items-center gap-2 text-sm leading-none font-medium select-none` (component default)     |
| Required        | Field that must be filled                                   | append `<span aria-hidden className="text-error">*</span>` + a form-level "\* required" legend |
| Optional        | The few optional fields in a mostly-required form           | append `<span className="text-muted-foreground text-xs font-normal">(optional)</span>`         |
| Visually hidden | Control whose purpose is obvious visually (search, toolbar) | add `sr-only` — present for AT, never `display:none` and never omitted                         |

## States

- **disabled** — never set on the label itself; it inherits. Wrap the group with `data-disabled` or mark the control `peer disabled` → label auto-dims via built-in `group-data-[disabled=true]:opacity-50 group-data-[disabled=true]:pointer-events-none` / `peer-disabled:opacity-50 peer-disabled:cursor-not-allowed`.
- **error** — the label text stays `text-foreground`; signal the error on the field + a `FieldError` message (`text-error`), not by recoloring the label. Never signal state by color alone.

No hover / focus / active states: the label is not itself interactive (clicking forwards focus to the bound control).

## Hierarchy

One label per control, sitting directly **above** the field (top-aligned reads fastest and survives mobile reflow); it ranks below the field's section heading and above its helper text.

## Restrictions

- Never use a placeholder as the label — placeholders vanish on input and fail AT.
- Never leave a control unlabelled — use `sr-only` before omitting, or `aria-label` only when no visible text exists.
- Never point `htmlFor` at a wrapper `div`; it must match the focusable control's `id`.
- Never wrap a heading, paragraph, or multiple controls in one `<Label>` — one label, one control.
- Never hardcode the disabled dim or a required-color hex — use the built-in `peer-disabled`/`group-data-[disabled]` classes and `text-error`.
- Never inline the label string — it lives in `messages/<locale>.json`.
- Never add a size prop or heading-scale classes; a label is always `text-sm`.

## Tokens

- **Color:** `text-foreground` (inherited default), `text-muted-foreground` for the optional hint, `text-error` for the required marker.
- **Type:** `text-sm font-medium leading-none` — fixed; the `caption`/`eyebrow` roles do not apply here.
- **Spacing:** `gap-2` between text and marker; stack the field below with the form's field gap (do not add margin on the label).
- **Radius / elevation / motion:** none — a label has no box, border, shadow, or transition.
- **Focus:** none on the label; the bound control owns `focus-visible:ring-2 focus-visible:ring-ring`.

Sources:

- https://ui.shadcn.com/docs/components/label
- https://m2.material.io/components/text-fields/web
- https://polaris.shopify.com/components/forms/label
- https://atlassian.design/components/form
