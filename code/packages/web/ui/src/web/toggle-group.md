> shadcn `toggle-group` · `src/user-interface/ui/toggle-group.tsx`

**Use when** picking one of 2–5 short, mutually-exclusive views/modes (list⇄grid, day/week/month), or toggling a few independent formatting states (bold/italic). **Don't** use it for primary navigation (use tabs), a single on/off (use a switch), form field choices submitted with data (use radio/checkbox), or more than ~5 options (use a select/chips).

## Anatomy

- **Group** (`ToggleGroup`, Radix Root) — horizontal (default) or vertical rail, `type="single"` (one active, radio-like) or `type="multiple"` (independent toggles).
- **Item** (`ToggleGroupItem`, Radix Item) — a two-state segment: optional Lucide icon (`size-4`) + short label. `data-[state=on]` marks the active segment.
- Optional: icon-only items need an `aria-label`.

## Variants

| Variant                     | Use for                                                                               | Base (Tailwind defaults + tokens)                                                                                             |
| --------------------------- | ------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `default` (spacing `0`)     | Joined segmented control — the canonical look; one connected pill of options          | transparent items, `first:rounded-l-md last:rounded-r-md`, inner corners squared; active = `bg-accent text-accent-foreground` |
| `outline` (spacing `0`)     | Segmented control that needs to read as a bordered control on busy backgrounds        | `border-input`, shared borders collapse (`border-l-0` except first), `shadow-xs` on the group                                 |
| any variant + `spacing={2}` | Detached multi-select toggles (formatting toolbars) where each item is its own button | `gap-2`, every item keeps `rounded-md`; no joined borders                                                                     |

Selected state is the same across variants: `data-[state=on]:bg-accent data-[state=on]:text-accent-foreground`. Never introduce `bg-brand` here — the brand token is for primary actions, not view toggles.

## Sizes

| Size      | Height | Padding                | Text      |
| --------- | ------ | ---------------------- | --------- |
| `sm`      | `h-8`  | `px-1.5`               | `text-sm` |
| `default` | `h-9`  | `px-3` (item override) | `text-sm` |
| `lg`      | `h-10` | `px-2.5`               | `text-sm` |

Touch: on touch layouts bump to `lg` (or pad) so every segment clears the ≥40px target — `sm`/`default` are desktop-pointer sizes. Set `size` once on the group; items inherit via context.

## States

- **hover** — `hover:bg-muted hover:text-muted-foreground` (default), `hover:bg-accent hover:text-accent-foreground` (outline).
- **focus-visible** — `focus-visible:border-ring focus-visible:ring-ring/50 ring-[3px]`; item adds `focus-visible:z-10` so the ring isn't clipped by neighbors. Roving tabindex (one tab stop, arrow keys move between items) is Radix-owned — don't add `tabIndex`.
- **active/on** — `data-[state=on]:bg-accent text-accent-foreground`. Pair the fill with the pressed weight, never rely on the tint alone (contrast + colorblind).
- **disabled** — `disabled:pointer-events-none disabled:opacity-50`; set on the item, or the group to disable all.
- **error** — `aria-invalid` → `border-destructive ring-destructive/20`; rare here, only for a required single-select in a form.
- **loading** — not a state this component owns; disable the group and show the spinner on the surrounding control.

## Hierarchy

A single low-emphasis control that scopes the content near it — one per view region (e.g. above a list). It is never the page's primary action and never competes with a CTA.

## Restrictions

- Never wire it as page navigation or route switching — that's tabs; a toggle group filters/reformats content already on screen.
- Never use it for a binary on/off setting — that's a switch.
- Never exceed 5 segments, and never let a label wrap or need explanation — labels are short and obvious; overflow → select/chips.
- Never leave `type` unset — `single` vs `multiple` changes the semantics and ARIA; single-select must keep exactly one item on.
- Never give icon-only items no `aria-label`, and keep icons `aria-hidden` when a text label is present.
- Never restyle selection with `bg-brand` or a raw color; use the `accent` tokens the toggle already ships.
- Never hand-roll keyboard/focus — Radix roving-tabindex owns it; don't add `next/link` inside items.

## Tokens

- **Color:** items `bg-transparent`/`text-foreground`; hover `bg-muted`/`bg-accent`; selected `bg-accent text-accent-foreground`; outline border `border-input`; error `border-destructive`.
- **Radius:** group + detached items `rounded-md`; joined items square inner corners and round only the outer ends (`first:rounded-l-md`, `last:rounded-r-md`).
- **Elevation:** flat by default; `outline` joined group carries `shadow-xs` (below card) — no `shadow-md`/overlay here.
- **Focus:** `focus-visible:ring-ring/50 ring-[3px]` + `focus-visible:z-10` on items.
- **Motion:** `transition-[color,box-shadow]` only (state tint fades, no layout move); ~160ms ease-out is the ceiling — respect `motion-reduce:`.
- **Icons:** Lucide `size-4` (16px, compact scale), `aria-hidden` unless the sole label.

Sources:

- https://www.radix-ui.com/primitives/docs/components/toggle-group
- https://ui.shadcn.com/docs/components/toggle-group
- https://m3.material.io/components/segmented-buttons/guidelines
- https://ant.design/components/radio
