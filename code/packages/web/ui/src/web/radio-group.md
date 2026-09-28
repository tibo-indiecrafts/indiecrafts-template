> shadcn `radio-group` · `src/user-interface/ui/radio-group.tsx`

**Use when** the user picks exactly one option from a small set (2–7) of mutually exclusive, always-visible choices. **Don't** use for multi-select (use checkbox), instant on/off toggles (use switch), or long option lists (use select/combobox).

## Anatomy

- **Group** (`RadioGroup`, Radix `Root`) — the container; owns `value`/`onValueChange`, wraps all items in a `fieldset` semantic with one shared `name`.
- **Item** (`RadioGroupItem`, Radix `Item`) — the circular control, one per option; carries the option `value`.
- **Indicator** (`RadioGroupPrimitive.Indicator`) — the filled inner dot, rendered only when checked.
- **Label** — a `<Label htmlFor>` (or wrapping) text beside each item; the whole label is a click target. Always present, one per item.
- **Group label / legend** — a heading describing the choice as a whole.
- Optional **helper/description** text under an item or the group.

## Variants

The primitive ships one visual variant. Distinguish by layout, not by restyling the control.

| Variant                | Use for                                            | Base (Tailwind defaults + tokens)                                                                                                                                                                        |
| ---------------------- | -------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Stacked (default)      | Most cases — easiest to scan, safe for long labels | `RadioGroup` = `grid gap-3`; each row `flex items-center gap-2`                                                                                                                                          |
| Inline                 | 2–3 short labels that fit one line                 | add `orientation="horizontal"` + `flex flex-wrap gap-4`                                                                                                                                                  |
| Card / selectable tile | Options needing description or emphasis            | wrap each item+label in `rounded-md border border-border p-4`, `card` elevation (`ring-1 ring-border/60 shadow-sm`); mark the selected card with `border-brand`, never color alone — keep the dot filled |

## States

- **hover** — pointer feedback on the row/label, not a color-only control change (label `hover:text-foreground` / card `hover:shadow-md`).
- **focus-visible** — `focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]` (already in the primitive); never remove. Roving tabindex means only the checked/first item is tabbable — arrow keys move selection.
- **checked** — filled `CircleIcon` dot (`fill-primary`); pair any card highlight with this dot, never rely on border/background color alone.
- **disabled** — `disabled:cursor-not-allowed disabled:opacity-50`; disable the label too. Prefer hiding an option over disabling when possible.
- **error / invalid** — set `aria-invalid` on items → `aria-invalid:border-destructive aria-invalid:ring-destructive/20`; add a text error message below the group (color alone is not enough).

## Hierarchy

A grouped input inside a form section — subordinate to the form's submit action. One radio group per decision; never two groups sharing a visual column without clear legends.

## Restrictions

- Never use a radio group for a yes/no or on/off setting — that's a switch or single checkbox.
- Never render a group with only one option, or with more than ~7 — switch to checkbox-list, select, or combobox past that.
- Never let selection auto-submit or trigger navigation on change; require an explicit Save/Apply (Atlassian). Exception: an intentional filter UI.
- Never signal the selected state by border/background color only — the filled dot must remain the primary cue.
- Never omit labels or the group legend; never make only the tiny circle clickable — the label is part of the target (≥40px row height).
- Never hand-roll keyboard/focus — Radix owns roving tabindex, arrow-key selection, and `Space`.
- Pre-select the safest/most-common default when one exists; leave all unselected only when no safe default exists — never force a hidden default the user can't see.
- Keep option labels parallel, short, and mutually exclusive — no overlapping choices.

## Tokens

- **Color** — control border `border-input`; dot + checked `text-primary` / `fill-primary` (maps to `brand` in this repo — the single-select accent); labels `text-foreground`, helper text `text-muted-foreground`; invalid `destructive`/`error`.
- **Radius** — `rounded-full` (the control is a circle); card wrappers `rounded-md`.
- **Elevation** — flat by default; card variant uses `card` (`ring-1 ring-border/60 shadow-sm`), `raised` (`shadow-md`) on hover.
- **Type** — group legend `title`, option labels `body`, helper text `caption` (muted).
- **Focus** — `focus-visible:ring-ring` ring, always on (never strip `outline-none` without the ring).
- **Motion** — `transition-[color,box-shadow]` at 160ms ease-out; guard any added motion with `motion-reduce:`.
- **Icons** — Lucide `CircleIcon` indicator, `aria-hidden` (the label names the option).

Sources:

- https://www.radix-ui.com/primitives/docs/components/radio-group
- https://atlassian.design/components/radio
- https://m3.material.io/components/radio-button/guidelines
