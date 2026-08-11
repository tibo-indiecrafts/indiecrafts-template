# Combobox

> shadcn `combobox` · `src/user-interface/ui/combobox.tsx`

**Use when** a user picks one (or several) values from a long, known list and filtering-as-you-type speeds selection. **Don't** use it for a short list (≤7 — use `select`/radio), for free-form text with no options (use `input`), or when every option must stay visible at once (use radio/checkbox group).

## Anatomy

- **Input** (`ComboboxInput` → `InputGroup` + `ComboboxPrimitive.Input`) — the text field users type into to filter; wraps the primitive in `InputGroup`.
- **Trigger** (`ComboboxTrigger`, inline-end addon) — ghost icon button with a Lucide `ChevronDownIcon` (`text-muted-foreground`) that opens/closes the popup. Shown via `showTrigger` (default on).
- **Clear** (`ComboboxClear`, inline-end addon) — ghost icon button with `XIcon` to reset the value; opt-in via `showClear`. Replaces the trigger when present.
- **Content** (`ComboboxContent` → `Portal` → `Positioner` → `Popup`) — the floating panel: `bg-popover`, `rounded-md`, `shadow-md ring-1 ring-foreground/10`, width matched to the anchor.
- **List** (`ComboboxList`) — scrollable item container (`max-h-96`, `overflow-y-auto`, `p-1`); shows `Empty` state when no matches.
- **Item** (`ComboboxItem`) — a row: gap-2 flex, `rounded-sm`, `text-sm`, trailing `CheckIcon` `ItemIndicator` on the selected value.
- **Group + Label** (`ComboboxGroup` / `ComboboxLabel`) — optional category cluster with a muted `text-xs` heading.
- **Chips** (multi-select) — selected values render as removable chips anchored above the list (`data-chips`).

## Variants

| Variant          | Use for                       | Base (Tailwind defaults + tokens)                                                                                           |
| ---------------- | ----------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Single           | Pick one value from many      | `ComboboxInput` + `ComboboxContent`; selected item shows trailing `CheckIcon`                                               |
| Multiple (chips) | Pick several values           | `<Combobox multiple>`; selected values become removable chips, list stays open                                              |
| Grouped          | Options fall into categories  | `ComboboxGroup` + `ComboboxLabel` per cluster                                                                               |
| Creatable        | Allow a value not in the list | primitive `creatable` — the typed string becomes a new item                                                                 |
| Async / loading  | Options fetched remotely      | show a loading row while fetching; render `Empty` on zero results                                                           |
| Invalid          | Failed validation             | `aria-invalid` on the input → `aria-invalid:border-destructive aria-invalid:ring-destructive/20` (destructive = error only) |

## States

- **hover (item)** — `data-highlighted:bg-accent data-highlighted:text-accent-foreground`; same style pointer or keyboard, so mouse and arrow-key highlight match.
- **focus-visible (input)** — inherited from `InputGroup`: `focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none` (always on; Base UI owns arrows/Escape/Enter/return-focus).
- **selected (item)** — trailing `CheckIcon` `ItemIndicator`; the checkmark, not color, signals selection.
- **disabled** — pass `disabled` to `ComboboxInput` (input + trigger + clear); items use `data-[disabled]:pointer-events-none data-[disabled]:opacity-50`.
- **loading** — async fetch: render an inline loading/spinner row inside the list; never freeze the input — typing must stay responsive.
- **empty** — no matches → `ComboboxPrimitive.Empty` row (`data-empty:p-0` collapses list padding); give it a real message from `messages/`.
- **error** — `aria-invalid` border + ring above, plus a visible `text-destructive` helper message.

## Hierarchy

A form control, not a page action — sits inside a labeled field alongside inputs and selects. One per field; the popup is transient (single open popup at a time, closes on select/Escape/outside-click).

## Restrictions

- Never reach for a combobox on a short list — filtering earns its complexity only past ~7 options; below that use `select`.
- Never hand-roll the popup, keyboard, or focus behavior — the `@base-ui/react` primitive owns arrows, `Escape`, `Enter`, typeahead, and return-focus.
- Never signal selection by row color alone — the trailing `CheckIcon` carries it (color-blind safe).
- Never block typing while options load — keep the input live and show a loading row, not a disabled field.
- Never ship a combobox without a rendered `Empty` state — a silent zero-result list reads as broken.
- Never inline option labels, the placeholder, or the empty/loading copy — all strings live in `messages/<locale>.json`.
- Never hard-code the panel width, colors, or radius — use `bg-popover`, `rounded-md`, and the anchor-matched width already wired in.
- Never edit this file to restyle — pass `className` (it wins via `cn()`) or extend a `cva` variant.

## Tokens

- **Color:** `bg-popover` + `text-popover-foreground` (panel) · `bg-accent` + `text-accent-foreground` (highlighted item) · `border-input` (field rest) · `ring-ring` (focus) · `border-destructive` / `ring-destructive` (error) · `text-muted-foreground` (chevron, group label).
- **Radius:** `rounded-md` (panel — default) · `rounded-sm` (items, tighter than the panel).
- **Elevation:** `shadow-md ring-1 ring-foreground/10` — floating overlay above the page, one step above card.
- **Focus:** `focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none` on the input (always on interactive).
- **Motion:** enter `data-open:animate-in fade-in-0 zoom-in-95` + directional `slide-in`, leave `data-closed:animate-out fade-out-0 zoom-out-95`, ~100–160ms ease-out; honor `motion-reduce:`.
- **Sizing:** input at the standard control height (40px desktop / 44px touch); popup `max-h-96` then scrolls; width matches the anchor (`w-(--anchor-width)`).
- **Icon:** Lucide `ChevronDownIcon` / `XIcon` / `CheckIcon` at `size-4` (16px, `pointer-coarse:size-5` for the check), `aria-hidden`.

Sources:

- https://ui.shadcn.com/docs/components/combobox
- https://base-ui.com/react/components/combobox
- https://www.w3.org/WAI/ARIA/apg/patterns/combobox/
