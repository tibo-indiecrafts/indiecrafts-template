# Field

> shadcn `field` · `src/user-interface/ui/field.tsx`

**Use when** wrapping a form control (input, select, textarea, checkbox, switch, radio) with its label, helper text, and error. **Don't** use it as a layout grid, a card, or to wrap non-form content.

## Anatomy

- `FieldSet` + `FieldLegend` — optional group wrapper for _related_ controls (a radio/checkbox group); the legend names the group.
- `FieldGroup` — stacks sibling `Field`s with one consistent gap; owns the container query for responsive orientation.
- `Field` — one control's wrapper (`role="group"`), carries `data-orientation` and `data-invalid`.
- `FieldLabel` — always-visible label, `text-foreground`, medium weight; required/optional marker sits inline here.
- The control itself — passed as a child (`Input`, `Select`, `Checkbox`…), owns its own focus/border.
- `FieldContent` — flex column holding label + description when a control sits beside them (horizontal).
- `FieldDescription` — helper text below the control, `text-muted-foreground`.
- `FieldError` — validation message below, `text-destructive`; replaces or joins the description.
- `FieldSeparator` — optional divider between sections of a `FieldGroup`.

## Variants

`Field` has one axis: **orientation** (label ↔ control position). No color/style forks.

| Variant              | Use for                               | Base (Tailwind defaults + tokens)                                                               |
| -------------------- | ------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `vertical` (default) | Most text inputs, selects, textareas  | `flex-col gap-3` — label above control, full-width children                                     |
| `horizontal`         | Switches, checkboxes, compact toggles | `flex-row items-center` — control beside label, `FieldContent` holds the text                   |
| `responsive`         | Fields that reflow by container width | `flex-col` → `@md/field-group:flex-row` (needs a `FieldGroup` ancestor for the container query) |

## States

The **wrapper has no focus/hover/active/loading state** — the control child owns those. Only these apply to `Field`:

- **disabled** — set `data-disabled="true"` on `Field`; label + content drop to `opacity-50` via `group-data-[disabled=true]/field`. Also disable the control.
- **error / invalid** — set `data-invalid="true"` on `Field` (→ `text-destructive`) **and** `aria-invalid` on the control, **and** render a `FieldError`. Never rely on the color alone.
- **selected** (choice-card label pattern) — `has-data-[state=checked]` flips the label to `border-primary bg-primary/5` (`dark:bg-primary/10`).

Focus lives on the control: `focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none`.

## Hierarchy

One `Field` per control; group _related_ controls in a `FieldSet`/`FieldLegend`; stack unrelated fields in a single `FieldGroup` so spacing stays uniform. Never nest a `Field` inside another `Field`.

## Restrictions

- Never put a focus ring, border, or background on the `Field` wrapper — the control child owns focus and border; the wrapper only lays out and flags invalid.
- Never signal an error with color only — always pair `data-invalid` with a `FieldError` string _and_ `aria-invalid` on the control.
- Never use a placeholder as the label — `FieldLabel` is always present and visible (consensus across M3, HIG, Carbon).
- Never inline label/description/error strings — they live in `messages/<locale>.json`.
- Never hand-set gaps between fields — let `FieldGroup`/`FieldSet` provide the spacing preset.
- Never wrap a single control in `FieldSet`/`FieldLegend` — that's for grouped controls (radio/checkbox groups), not one input.
- Never edit `field.tsx` — it's shadcn CLI-managed (`components.json`), read-only.

## Tokens

- **Color** — label `text-foreground`; description `text-muted-foreground`; error `text-destructive` (repo `error` role); selected label `border-primary` + `bg-primary/5`; separator label backdrop `bg-background`.
- **Radius** — `rounded-md` on selectable choice-card labels (default token).
- **Elevation** — flat; the wrapper carries no ring/shadow (the control or an enclosing card does).
- **Focus** — on the control child only: `focus-visible:ring-2 ring-ring focus-visible:outline-none`.
- **Motion** — none on the wrapper; state transitions belong to the control (guard any with `motion-reduce:`).
- **Type** — legend/label medium weight (`title`/`body` roles); description `caption` (muted); error inherits `caption` size in `text-destructive`.

Sources:

- https://ui.shadcn.com/docs/components/field
- https://m3.material.io/components/text-fields/overview
- https://ant.design/components/form
