> shadcn `switch` · `src/user-interface/ui/switch.tsx`

**Use when** a single binary setting takes effect **immediately** with no Save button (notifications on/off, dark mode). **Don't** use it inside a form that needs submission, for multi-select lists, or to trigger an action — that's a checkbox or button.

## Anatomy

- **Track** (`SwitchPrimitive.Root`, `data-slot="switch"`) — pill container, `rounded-full`; color encodes on/off.
- **Thumb** (`SwitchPrimitive.Thumb`, `data-slot="switch-thumb"`) — circle that slides left↔right; renders the hidden form input inside Root.
- **External label** — always paired, sits beside the switch (not part of the component); clicking it toggles via associated control.

## Variants

Single visual variant. State, not style, does the work.

| Variant | Use for      | Base (Tailwind defaults + tokens)                                                                                                                                           |
| ------- | ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Default | every switch | track `data-[state=checked]:bg-primary` (brand) / `data-[state=unchecked]:bg-input`, `rounded-full border border-transparent shadow-xs`; thumb `bg-background rounded-full` |

## Sizes

Two sizes via `size` prop. No text/padding axis — a switch is icon-free.

| Size      | Track (h × w)     | Thumb    | Use                           |
| --------- | ----------------- | -------- | ----------------------------- |
| `default` | `h-[1.15rem] w-8` | `size-4` | standard rows, settings pages |
| `sm`      | `h-3.5 w-6`       | `size-3` | dense tables, inline toolbars |

Both fall below the 40px touch target — give the **paired label** a ≥40px hit area (wrap label + switch in a `py-2` row) so touch users don't have to hit the pill.

## States

- **hover** — no color shift (state is the signal); cursor default.
- **focus-visible** — `focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none` (always on).
- **active / checked** — `data-[state=checked]:bg-primary`, thumb `translate-x-[calc(100%-2px)]`, `transition-transform`.
- **disabled** — `disabled:opacity-50 disabled:cursor-not-allowed`; keep the label visible for context.
- **loading / error** — not in the shadcn base. A switch has no error state; validate at the form level. For async toggles, disable during the request rather than adding a spinner.

## Hierarchy

Sits in a settings list, one binary setting per row, label-left / switch-right. Many per view is fine (a settings page) — but each must be independent; related-exclusive options are radios, and grouped-confirmable options are checkboxes.

## Restrictions

- Never use a switch where changes need a **Save/Submit** — that contract is a checkbox (immediate effect is the whole point of a switch).
- Never use it for **multi-select** within a set, or for **mutually exclusive** choices (checkbox group / radio).
- Never make it **trigger an action** (delete, send) — that's a button.
- Never rely on **color alone** for on/off — the thumb position must read the state; don't remove the slide.
- Never ship it **without a visible text label** — the pill alone is not self-describing (a11y `switch` role needs an accessible name).
- Never hand-roll toggle/keyboard logic — Radix `Switch.Root`/`Thumb` own Space/Enter, the hidden input, and the `switch` role.
- Never enlarge past `default` to fake a touch target — expand the label row instead.

## Tokens

- **Color** — on: `bg-primary` (brand role) · off: `bg-input` · thumb: `bg-background` · focus ring: `ring-ring`.
- **Radius** — `rounded-full` (track + thumb), fixed.
- **Elevation** — `shadow-xs` on the track only; flat otherwise, no card/overlay.
- **Focus** — `focus-visible:ring-[3px] ring-ring/50 border-ring outline-none` — never strip it.
- **Motion** — `transition-transform` on the thumb (≤160ms, ease-out); guard reduced motion with `motion-reduce:transition-none`.
- **Type** — the paired label uses the `body` role; helper text `caption` (muted).

Sources:

- https://www.radix-ui.com/primitives/docs/components/switch
- https://ant.design/components/switch
- https://uxmovement.com/buttons/when-to-use-a-switch-or-checkbox/
- https://m3.material.io/components/switch/guidelines
