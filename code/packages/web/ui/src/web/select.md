> shadcn `select` · `src/user-interface/ui/select.tsx`

**Use when** the user picks exactly one value from a known list of ~5+ options and vertical space is tight. **Don't** use it for multi-select, free typing, actions, or fewer than 5 options.

## Anatomy

- `SelectLabel`-style field label above the control (from `messages/`, never inline).
- `SelectTrigger` — the closed control: `SelectValue` (selected text or placeholder) + trailing `ChevronDownIcon`.
- `SelectContent` — the popover panel (portaled): optional `SelectScrollUpButton`, `SelectGroup` + `SelectLabel`, `SelectItem`s (each with a trailing `CheckIcon` indicator when selected), `SelectSeparator`, `SelectScrollDownButton`.

## Variants

The component has no visual variants — one trigger style. Vary meaning through composition, not forks.

| Variant         | Use for                | Base (Tailwind defaults + tokens)                                                                                    |
| --------------- | ---------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Default trigger | Single choice          | `rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs` (`dark:bg-input/30`)                     |
| Placeholder     | Nothing chosen yet     | `data-[placeholder]:text-muted-foreground` — required; name the choice ("Select a country")                          |
| Grouped         | 2+ labeled option sets | `SelectGroup` + `SelectLabel` (`text-muted-foreground text-xs`), `SelectSeparator` (`bg-border h-px`) between groups |
| Content panel   | Open list              | `bg-popover text-popover-foreground rounded-md border shadow-md`                                                     |

## Sizes

| Size      | Height       | Padding | Text      |
| --------- | ------------ | ------- | --------- |
| `default` | `h-9` (36px) | `px-3`  | `text-sm` |
| `sm`      | `h-8` (32px) | `px-3`  | `text-sm` |

Both sit under the repo's 40px desktop / 44px touch target — on touch-primary or mobile layouts bump the trigger to `h-10`+ so the tap target clears 40px.

## States

- **hover** — no trigger background shift in light mode; `dark:hover:bg-input/50` only. Don't add a light-mode hover fill.
- **focus-visible** — `focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]`; keep it, it's the only affordance.
- **open** — panel enters `fade-in-0 zoom-in-95` + slide-from-side; leaves `fade-out-0 zoom-out-95`. ~160ms, already `ease`-based.
- **selected item** — `CheckIcon` indicator on the right, never color alone.
- **item highlighted** (keyboard/hover) — `focus:bg-accent focus:text-accent-foreground`.
- **disabled** — trigger `disabled:opacity-50 disabled:cursor-not-allowed`; item `data-[disabled]:opacity-50 data-[disabled]:pointer-events-none`.
- **error** — set `aria-invalid` on the trigger → `aria-invalid:border-destructive aria-invalid:ring-destructive/20`; pair with a visible message, never red border alone.
- **loading** — not built in. If options are async, show a disabled trigger with placeholder text ("Loading…"); don't fake a spinner inside the panel.

## Hierarchy

A form field, not a primary action — visually quieter than a `bg-brand` button. Multiple per form is fine; only one open at a time (Radix enforces).

## Restrictions

- Never use Select for **multi-select** (checkbox group), **free/searchable text** (combobox/autocomplete), or **actions** (`dropdown-menu`).
- Never use it for **< 5 options that must stay visible** — use radio buttons.
- Never render an item's selected state by **color alone** — the `CheckIcon` indicator is mandatory.
- Never ship without a **visible label** and a **placeholder** that names the choice.
- Never hardcode option or placeholder strings — pull from `messages/<locale>.json`.
- Never edit `src/user-interface/ui/select.tsx` to restyle — pass `className` on the trigger/content (component classes first, `className` wins).
- Never hand-roll open/close, Escape, or focus return — Radix `Select` owns it.
- Never widen with a fixed `w-*`; the trigger is `w-fit` — constrain via the parent field.

## Tokens

- **Color** — trigger `border-input`, `bg-transparent` (`dark:bg-input/30`); panel `bg-popover`/`text-popover-foreground`; item highlight `bg-accent`/`text-accent-foreground`; labels/icons `text-muted-foreground`; error `border-destructive` / `ring-destructive`.
- **Radius** — trigger + panel `rounded-md` (0.5rem default); items `rounded-sm`.
- **Elevation** — panel is an overlay: `border` + `shadow-md`; trigger `shadow-xs`.
- **Focus** — `focus-visible:ring-ring/50 focus-visible:ring-[3px]` + `focus-visible:border-ring`.
- **Motion** — enter/leave `fade + zoom-95` + directional slide, ~160ms; respect `motion-reduce:`.
- **Icons** — Lucide `ChevronDownIcon` (trigger, `size-4`, `opacity-50`), `CheckIcon` (indicator), scroll chevrons; all `aria-hidden`.

Sources:

- https://ui.shadcn.com/docs/components/select
- https://ant.design/components/select
- https://atlassian.design/components/select/usage
