> shadcn `checkbox` · `src/user-interface/ui/checkbox.tsx`

**Use when** a user picks zero-or-more independent options, or toggles a single setting that only applies on submit. **Don't** use it for one mutually-exclusive choice (radio) or an instant on/off setting that saves immediately (switch).

## Anatomy

- **Box** (`Checkbox.Root`) — the 16px square control, `border-input` outline unchecked, filled when checked.
- **Indicator** (`Checkbox.Indicator`) — centered Lucide `CheckIcon` (checked) or a horizontal bar (indeterminate); `aria-hidden`.
- **Label** — always present, sits to the right (LTR), clickable, wired via `htmlFor`/`id`. String lives in `messages/<locale>.json`.
- **Helper / error text** (optional) — `text-muted-foreground`, or `text-destructive` when invalid.

## Variants

| Variant             | Use for                                            | Base (Tailwind defaults + tokens)                                                                                                    |
| ------------------- | -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Default (unchecked) | Resting, selectable                                | `border border-input rounded-[4px] bg-transparent`                                                                                   |
| Checked             | Selected option                                    | `data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=checked]:text-primary-foreground` (primary = brand) |
| Indeterminate       | Parent of a partially-selected group — visual only | `data-[state=indeterminate]:bg-primary`, bar icon instead of check                                                                   |
| Invalid             | Failed a required/validation rule                  | `aria-invalid:border-destructive aria-invalid:ring-destructive/20` (pair with error text)                                            |

## States

- **hover** — cursor + subtle border emphasis; no color-only signal.
- **focus-visible** — `focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none` (always on; Radix owns keyboard).
- **active/pressed** — toggles on `Space`; no separate style needed.
- **disabled** — `disabled:cursor-not-allowed disabled:opacity-50`; never the only affordance for read-only data.
- **error** — `aria-invalid` border + ring above, plus visible `text-destructive` message (destructive = error only).
- No **loading** state — a checkbox never spins; disable during async submit instead.

## Hierarchy

A supporting control, never the page's primary action. Group related boxes in a `fieldset`/`legend`; one "select all" parent uses the indeterminate state to summarize its children.

## Restrictions

- Never use a checkbox for a mutually-exclusive choice (that is radio) or for a setting that applies instantly (that is switch).
- Never let a user click into the indeterminate state — it is set programmatically to reflect a mixed group, not a third toggle value.
- Never rely on the checked fill color alone; the check/bar icon and the label carry the meaning (color-blind safe).
- Never ship a bare 16px box as the only hit area — extend the clickable target to the label so the touch target is ≥40px.
- Never inline the label string or hard-code the fill hex — label → `messages/`, color → `bg-primary`/brand token.
- Never edit this file to restyle; pass `className` (it wins via `cn()`) or add a `cva` variant.

## Tokens

- **Color:** `border-input` (rest) · `bg-primary` + `text-primary-foreground` (checked, primary = brand) · `ring-ring` (focus) · `border-destructive` / `ring-destructive` (error) · `text-muted-foreground` (helper).
- **Radius:** `rounded-[4px]` (matches `rounded-sm` family; the box is intentionally tighter than card radius).
- **Elevation:** `shadow-xs` only — flat control, no card/raised shadow.
- **Focus:** `focus-visible:ring-[3px] ring-ring/50 focus-visible:border-ring outline-none`.
- **Motion:** `transition-shadow` (focus ring), ~160ms ease-out; indicator itself does not animate. Honor `motion-reduce:`.
- **Icon:** Lucide `CheckIcon` at `size-3.5` (14px) inside the 16px box, `aria-hidden`.

Sources:

- https://www.radix-ui.com/primitives/docs/components/checkbox
- https://ant.design/components/checkbox
- https://github.com/material-components/material-web/blob/main/docs/components/checkbox.md
