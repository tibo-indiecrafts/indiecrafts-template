> shadcn `toggle` · `src/user-interface/ui/toggle.tsx`

**Use when** a single control flips a binary, instantly-applied state and stays visibly pressed — e.g. a formatting button (bold/italic) in a toolbar. **Don't** use it for a labeled on/off setting (switch), a form option submitted later (checkbox), or a mutually-exclusive pick from a set (that is a Toggle **Group** / segmented control).

## Anatomy

- **Root** (`Toggle.Root`) — the whole pressable button; carries `data-state="on|off"` (maps to `aria-pressed`). No wrapper, no separate track/thumb — it _is_ a button.
- **Content** — Lucide icon (`size-4`, `aria-hidden`) and/or short label; centered, `gap-2` between them. An icon-only toggle needs an `aria-label`.

## Variants

| Variant   | Use for                                                               | Base (Tailwind defaults + tokens)                                                                      |
| --------- | --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `default` | Toolbar buttons on a plain surface (borderless)                       | `bg-transparent`, on → `data-[state=on]:bg-accent data-[state=on]:text-accent-foreground`              |
| `outline` | A toggle that must read as a discrete control on a busy/empty surface | `border border-input bg-transparent shadow-xs`, hover → `hover:bg-accent hover:text-accent-foreground` |

On-state uses **`accent`**, not `brand` — a toggle is a supporting control, never the page's primary action, so it does not consume the brand color.

## Sizes

| Size      | Height        | Padding              | Text      |
| --------- | ------------- | -------------------- | --------- |
| `sm`      | `h-8` (32px)  | `px-1.5`, `min-w-8`  | `text-sm` |
| `default` | `h-9` (36px)  | `px-2`, `min-w-9`    | `text-sm` |
| `lg`      | `h-10` (40px) | `px-2.5`, `min-w-10` | `text-sm` |

All sizes fall below the 40px touch minimum except `lg`. On touch-first surfaces use `lg`, or ensure the toggle sits in a group whose combined hit area clears 40px.

## States

- **hover** — `hover:bg-muted hover:text-muted-foreground` (`default`) / `hover:bg-accent` (`outline`); never the only cue that it is interactive.
- **focus-visible** — `focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none` (always on; Radix owns the keyboard — Space **and** Enter toggle).
- **active/on** — `data-[state=on]:bg-accent data-[state=on]:text-accent-foreground`; the pressed fill is state, not hover. Pair with an icon/shape change where the fill alone could be missed.
- **disabled** — `disabled:pointer-events-none disabled:opacity-50`; not the only affordance for read-only state.
- **error** — `aria-invalid:border-destructive aria-invalid:ring-destructive/20` (rare for a toggle; destructive = error only).
- No **loading** state — a toggle never spins. Disable it during an async apply instead.

## Hierarchy

A supporting, low-emphasis control. Fine to have several per view **only** inside one toolbar/group (formatting bar, view switch). More than one lone toggle scattered on a page is a smell — reach for a Toggle Group or switches instead.

## Restrictions

- Never use it as an on/off _setting_ with a persistent label — that is a switch (`data-[state=on]` reads as "pressed", not "enabled").
- Never change the label when the state changes — keep it constant (always "Bold"); the pressed state carries the meaning (ARIA APG).
- Never signal on/off by fill color alone — back the `bg-accent` with an icon, shape, or `aria-pressed` so it survives color-blindness and high-contrast modes.
- Never group mutually-exclusive toggles by hand-syncing their `pressed` props — use a single-select Toggle Group so only one is `on`.
- Never ship an icon-only toggle without an `aria-label`; the icon is `aria-hidden`, so it has no accessible name otherwise.
- Never edit this file to restyle — pass `className` (it wins via `cn()`) or add a `cva` case.
- Never swap `accent` for `brand` to make it "pop"; a toggle is not a primary action.

## Tokens

- **Color:** `bg-transparent` (rest) · `bg-accent` + `text-accent-foreground` (on) · `bg-muted` + `text-muted-foreground` (hover, default variant) · `border-input` (outline variant) · `ring-ring` (focus) · `border-destructive`/`ring-destructive` (invalid).
- **Radius:** `rounded-md` (0.5rem, the default control radius).
- **Elevation:** flat; `outline` variant adds `shadow-xs` only — no card/raised shadow.
- **Focus:** `focus-visible:ring-[3px] ring-ring/50 focus-visible:border-ring outline-none`.
- **Motion:** `transition-[color,box-shadow]` (~160ms ease-out) — color and focus ring only, no layout shift. Honor `motion-reduce:`.
- **Icon:** Lucide at `size-4` (16px), `aria-hidden`, `[&_svg]:pointer-events-none shrink-0`.

Sources:

- https://www.radix-ui.com/primitives/docs/components/toggle
- https://ui.shadcn.com/docs/components/toggle
- https://www.w3.org/WAI/ARIA/apg/patterns/button/
- https://m3.material.io/components/segmented-buttons/guidelines
