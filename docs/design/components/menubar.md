# Menubar

> shadcn `menubar` · `src/user-interface/ui/menubar.tsx`

**Use when** you need a persistent, desktop-app-style command surface (File / Edit / View) that groups many low-frequency commands behind top-level menus. **Don't** use it as site/page navigation, a header, a toolbar, or on touch-first layouts — reach for `NavigationMenu` or plain `@/i18n/routing` links instead.

## Anatomy

- **Menubar** — horizontal bar, one per view, holds the top-level menus (`Menubar`).
- **MenubarMenu → MenubarTrigger** — one short menu title each (File, Edit…). Click/arrow opens.
- **MenubarContent** — the dropdown panel (portalled, `align="start"`).
- **MenubarLabel** / **MenubarGroup** — optional group header + logical grouping.
- **MenubarItem** — a command. Optional trailing **MenubarShortcut** (⌘S).
- **MenubarCheckboxItem** — independent toggle (check mark, left).
- **MenubarRadioGroup → MenubarRadioItem** — mutually-exclusive set (bullet, left).
- **MenubarSeparator** — divides groups (actions vs. settings).
- **MenubarSub → MenubarSubTrigger → MenubarSubContent** — one nested level, chevron affordance.

## Variants

| Variant              | Use for               | Base (Tailwind defaults + tokens)                                                                 |
| -------------------- | --------------------- | ------------------------------------------------------------------------------------------------- |
| Bar (`Menubar`)      | The container         | `bg-background` · `border` · `rounded-md` · `shadow-xs` · `h-9 p-1 gap-1`                         |
| Trigger              | Menu title            | `text-sm font-medium rounded-sm px-2 py-1`; open/focus → `bg-accent text-accent-foreground`       |
| Item — `default`     | Normal command        | `text-sm rounded-sm px-2 py-1.5`; icons → `text-muted-foreground`                                 |
| Item — `destructive` | Delete / irreversible | `text-destructive`, focus `bg-destructive/10` — the repo `error` role, never for merely "primary" |
| CheckboxItem         | Independent on/off    | check indicator left (`pl-8`), `rounded-xs`                                                       |
| RadioItem            | One-of-many           | bullet indicator left (`pl-8`), `rounded-xs`                                                      |

No primary/brand item variant exists — a menubar issues commands, it isn't a CTA surface, so `bg-brand` never appears here.

## States

- **hover / focus-visible** — single roving highlight: `focus:bg-accent focus:text-accent-foreground` (Radix manages roving tabindex; hover and keyboard share one visual). Trigger open state reuses the same `bg-accent`.
- **open** (trigger/sub-trigger) — `data-[state=open]:bg-accent text-accent-foreground`.
- **disabled** — `data-[disabled]:opacity-50 pointer-events-none`; pair with more than color (dimmed + non-interactive), never color alone.
- **selected** (checkbox/radio) — left-side check/bullet indicator, not a color swap.
- No loading/error item states — commands fire and the menu closes; surface async results elsewhere (toast).

## Hierarchy

One menubar per view, pinned to the top of its window/app region; keep to ≤ ~10 short (ideally one-word) menu titles and group items with separators inside each menu.

## Restrictions

- Never use it for primary navigation, marketing headers, tabs, or a mobile nav — it's a desktop command pattern, keyboard/pointer-first; small screens get a different affordance.
- Never nest submenus more than one level — the base ships a single `Sub` depth; deeper nesting is a usability failure.
- Never hand-roll open/close, focus trap, Escape, or arrow/typeahead behavior — Radix owns all of it; just compose the parts.
- Never fake mutually-exclusive options with `CheckboxItem` (or independent toggles with `RadioItem`) — checkbox = independent, radio = one-of-many.
- Never overload `destructive` for emphasis; it maps to the `error` role and means irreversible/dangerous only.
- Never put a raw hex/px or `next/link` inside items — tokens + utilities only, links via `@/i18n/routing`.
- Don't cram frequent primary actions here; those belong on a visible button, not two clicks deep.

## Tokens

- **Color** — bar `bg-background` + `border`; panel `bg-popover text-popover-foreground`; highlight `bg-accent text-accent-foreground`; muted icons/shortcut `text-muted-foreground`; danger `text-destructive` / `bg-destructive/10` (repo `error` role).
- **Radius** — bar `rounded-md`, panel `rounded-md`, trigger/item `rounded-sm`, checkbox/radio item `rounded-xs`.
- **Elevation** — bar `shadow-xs` (flat-ish chrome); `MenubarContent` `shadow-md` (raised); `MenubarSubContent` `shadow-lg` (overlay). Separator `bg-border`.
- **Focus** — roving highlight via `focus:bg-accent`; interactive parts use `outline-hidden` because focus is shown by the accent fill, not a ring (the one place the repo's default `focus-visible:ring-ring` is intentionally replaced).
- **Motion** — enter/leave `data-[state=open]:animate-in fade-in-0 zoom-in-95` / `animate-out fade-out-0 zoom-out-95` + directional `slide-in-from-*-2`, transform-origin from `--radix-menubar-content-transform-origin`; within the ≤240ms layout budget, guard heavier custom motion with `motion-reduce:`.
- **Icons** — Lucide, `size-4` (16px) inside items, `2px` stroke, `aria-hidden` (check/bullet indicators are decorative; the item text is the label).

Sources:

- https://ui.shadcn.com/docs/components/menubar
- https://www.radix-ui.com/primitives/docs/components/menubar
- https://learn.microsoft.com/en-us/previous-versions/windows/desktop/bb226797(v=vs.85)
- https://developer.apple.com/design/human-interface-guidelines/the-menu-bar
- https://www.nngroup.com/articles/menu-design/
