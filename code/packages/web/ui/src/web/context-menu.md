> shadcn `context-menu` · `src/user-interface/ui/context-menu.tsx`

**Use when** a right-click (or long-press on touch) should reveal actions scoped to the element under the pointer. **Don't** use it as your only path to an action, or as a button-triggered dropdown — that's `DropdownMenu`.

## Anatomy

- **ContextMenu** (Root) — state container, no visible output.
- **ContextMenuTrigger** — the right-clickable region; wraps the target element.
- **ContextMenuContent** — portalled popover panel (`bg-popover`, `shadow-md`, `rounded-md`, `min-w-[8rem]`).
- **ContextMenuLabel** — non-interactive section heading.
- **ContextMenuGroup** / **ContextMenuSeparator** — cluster related items; separator divides groups.
- **ContextMenuItem** — one action row (optional leading icon + label + `ContextMenuShortcut`).
- **ContextMenuCheckboxItem** / **ContextMenuRadioItem** (in **ContextMenuRadioGroup**) — stateful rows; indicator sits in the reserved left gutter (`pl-8`).
- **ContextMenuSub** → **ContextMenuSubTrigger** (trailing `ChevronRight`) → **ContextMenuSubContent** — one nested level only.

## Variants

| Variant                         | Use for                                              | Base (Tailwind defaults + tokens)                                                   |
| ------------------------------- | ---------------------------------------------------- | ----------------------------------------------------------------------------------- |
| Item `default`                  | Standard actions                                     | `text-sm px-2 py-1.5 rounded-sm`, focus → `bg-accent text-accent-foreground`        |
| Item `variant="destructive"`    | Delete / remove                                      | `text-destructive`, focus `bg-destructive/10`; last in the list, behind a separator |
| CheckboxItem                    | Independent on/off toggles                           | left `CheckIcon` indicator, `pl-8` gutter                                           |
| RadioItem                       | One-of-many choice                                   | left `CircleIcon` indicator, wrap in `ContextMenuRadioGroup`                        |
| SubTrigger                      | Opens a nested submenu                               | trailing `ChevronRight ml-auto`, open → `bg-accent`                                 |
| `inset` (Item/Label/SubTrigger) | Align text under icon rows when this row has no icon | adds `pl-8`                                                                         |

## States

- **focus/highlight** (keyboard + hover share one state via Radix roving tabindex): `focus:bg-accent focus:text-accent-foreground`.
- **open** (SubTrigger): `data-[state=open]:bg-accent`.
- **checked** (Checkbox/Radio): `ItemIndicator` renders in the gutter — never signal by color alone.
- **disabled**: `data-[disabled]:opacity-50 data-[disabled]:pointer-events-none`. Disable rather than remove when the action is temporarily unavailable.
- No hover-distinct, active, loading, or error states — menu actions fire instantly and close; do async work after dismissal.

## Hierarchy

Contextual layer above page content, below dialogs; exactly one open at a time. Keep to ~5–8 items; group with separators, most-used first, destructive last.

## Restrictions

- Never make the context menu the _sole_ way to reach an action — mirror it in a visible control (toolbar/dropdown).
- Never nest deeper than one submenu level; flatten instead.
- Never paint focus/hover as separate looks — Radix collapses them into one `focus:` state; don't add a competing `hover:` background.
- Never rely on `variant="destructive"` color alone — keep a clear verb label ("Delete") and separate it.
- Never open one from a normal left-click or a button — that is `DropdownMenu`.
- Never edit `src/user-interface/ui/context-menu.tsx` (shadcn CLI-managed); compose from the exported parts.
- Don't hand-roll focus trap / Escape / arrow navigation — the Radix primitive owns them.
- Icons are decorative here: `aria-hidden` (already enforced) with a text label alongside.

## Tokens

- **Color**: `bg-popover` / `text-popover-foreground` (panel), `bg-accent` / `text-accent-foreground` (focus), `text-muted-foreground` (icons + `Shortcut`), `bg-border` (separator), `text-destructive` + `bg-destructive/10` (destructive).
- **Radius**: panel `rounded-md`, rows `rounded-sm`.
- **Elevation**: `overlay` — `shadow-md` (content), `shadow-lg` (sub-content), on a `border`.
- **Type**: rows `text-sm`, `Shortcut` `text-xs tracking-widest`, `Label` `text-sm font-medium`.
- **Focus**: `outline-hidden` + `bg-accent` (menu convention; Radix keeps focus visible via roving tabindex — do not remove).
- **Motion**: `data-[state=open]:animate-in fade-in-0 zoom-in-95` / `data-[state=closed]:animate-out` — within the 160ms standard; respects `motion-reduce` via the animation utilities.

Sources:

- https://www.radix-ui.com/primitives/docs/components/context-menu
- https://ui.shadcn.com/docs/components/context-menu
- https://m3.material.io/components/menus/guidelines
- https://developer.apple.com/design/human-interface-guidelines/context-menus
