# Dropdown menu

> shadcn `dropdown-menu` · `src/user-interface/ui/dropdown-menu.tsx`

**Use when** a trigger button reveals a short list of actions or option toggles for the current context. **Don't** use it for primary site navigation, form selection (use `select`/`combobox`), or as a container for arbitrary layout — it holds a list of items, not a panel.

## Anatomy

- **Trigger** — the button that opens it (`DropdownMenuTrigger`, usually `asChild` on a real `Button`).
- **Content** — portalled, collision-aware popover surface.
- **Label** — non-interactive section heading.
- **Group** — related items bundled between separators.
- **Item** — one action (optional leading Lucide icon + trailing `Shortcut`).
- **CheckboxItem / RadioGroup + RadioItem** — stateful toggles; indicator sits in the reserved left gutter (`pl-8`).
- **Separator** — hairline divider between groups.
- **Sub / SubTrigger / SubContent** — one level of nested menu (trailing chevron).

## Variants

| Variant                      | Use for                               | Base (Tailwind defaults + tokens)                                                                                         |
| ---------------------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Item `default`               | Normal actions                        | `text-sm rounded-sm px-2 py-1.5`, highlight `focus:bg-accent focus:text-accent-foreground`, icons `text-muted-foreground` |
| Item `variant="destructive"` | Irreversible actions (delete, remove) | `text-destructive`, highlight `focus:bg-destructive/10` — the only color-coded item                                       |
| CheckboxItem                 | Independent on/off toggles            | `pl-8` gutter, `CheckIcon` indicator                                                                                      |
| RadioItem                    | One exclusive choice in a set         | `pl-8` gutter, filled `CircleIcon` indicator                                                                              |
| SubContent                   | Nested submenu surface                | same as Content but `shadow-lg`, `overflow-hidden`                                                                        |

## Sizes

No size axis — items are fixed at `text-sm` / `py-1.5`. Don't invent `sm`/`lg` variants; scale via count and grouping, not item height.

## States

- **highlighted** (hover + keyboard, unified by Radix roving focus) — `focus:bg-accent focus:text-accent-foreground`. This is `focus:`, not `focus-visible:`, on purpose: Radix moves DOM focus to the active item, so one rule covers pointer and keyboard.
- **disabled** — `data-[disabled]:pointer-events-none data-[disabled]:opacity-50`; keep the item, don't hide it.
- **open** (SubTrigger) — `data-[state=open]:bg-accent`.
- **enter/leave** — `data-[state=open]:animate-in fade-in-0 zoom-in-95` / `data-[state=closed]:animate-out fade-out-0 zoom-out-95`, plus directional `slide-in-from-*`.
- No hover/active/loading/error states beyond the above — a menu item fires and closes; put loading/error on the surface the action affects, not the item.

## Hierarchy

Secondary to the trigger it hangs off. One open menu per view; 3–10 items is the comfortable range — past ~12, split with labels/separators or reach for a different pattern.

## Restrictions

- Never build navigation with it — use `@/i18n/routing` links in real nav, not menu items.
- Never inline label/item strings — pull from `messages/<locale>.json`.
- Never signal destructive intent by red color alone — pair `variant="destructive"` with a clear verb ("Delete…") and/or icon.
- Never nest more than one submenu level — flatten instead.
- Never hand-roll open/close, focus trap, Escape, arrow keys, or typeahead — Radix owns them; don't add key handlers.
- Never edit this file to restyle — pass `className` on the composed instance (component classes first, yours win via `cn`).
- Never drop the `pl-8` gutter on checkbox/radio items — the indicator lives there.
- Never put non-item content (inputs, long paragraphs, arbitrary grids) inside Content.

## Tokens

- **Color** — surface `bg-popover text-popover-foreground`; highlight `bg-accent`/`text-accent-foreground`; muted icons/shortcuts `text-muted-foreground`; divider `bg-border`; destructive `text-destructive` + `bg-destructive/10`.
- **Radius** — Content `rounded-md`; items `rounded-sm`.
- **Elevation** — Content overlay `shadow-md` + `border`; SubContent `shadow-lg`.
- **Type** — items `text-sm`; label `text-sm font-medium`; shortcut `text-xs tracking-widest text-muted-foreground`.
- **Focus** — handled via Radix roving focus + `focus:bg-accent` highlight; the trigger keeps the standard `focus-visible:ring-2 ring-ring` from `Button`.
- **Motion** — `animate-in/out` with `fade`+`zoom` (~150ms, ease-out enter / ease-in leave); origin follows `--radix-dropdown-menu-content-transform-origin`. Respects `motion-reduce:` via the shared animation utilities.
- **Icons** — Lucide, `size-4` (16px) compact default, `aria-hidden`, `text-muted-foreground` unless the item overrides.

Sources:

- https://ui.shadcn.com/docs/components/radix/dropdown-menu
- https://www.radix-ui.com/primitives/docs/components/dropdown-menu
- https://m3.material.io/components/menus/guidelines
- https://m2.material.io/design/components/menus.html
