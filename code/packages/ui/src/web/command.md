# Command

> shadcn `command` · `src/user-interface/ui/command.tsx`

**Use when** a user needs to search-and-run across many actions/destinations from one keyboard-driven list (⌘K palette, searchable menu, combobox popup). **Don't** use it as a plain form select, a nav menu with ≤7 fixed items, or a full-text content search — reach for `Select`, a nav list, or a search page.

## Anatomy

- `CommandDialog` — optional modal wrapper (Radix Dialog, focus-trap + Escape). Palette mode only.
- `CommandInput` — search field with leading Lucide `SearchIcon`, bottom border. One per Command.
- `CommandList` — scroll container (`max-h-[300px]`) holding everything below.
- `CommandEmpty` — no-results fallback; render it, don't leave the list blank.
- `CommandGroup` — labelled cluster of items (`cmdk-group-heading`).
- `CommandItem` — one selectable action; optional leading icon + trailing `CommandShortcut`.
- `CommandShortcut` — right-aligned keybinding hint (`ml-auto`, muted).
- `CommandSeparator` — hairline between groups; auto-hides while filtering.

## Variants

| Variant                  | Use for                          | Base (Tailwind defaults + tokens)                                                    |
| ------------------------ | -------------------------------- | ------------------------------------------------------------------------------------ |
| Inline (`Command`)       | Combobox popover, embedded panel | `bg-popover text-popover-foreground rounded-md`, flat inside its own trigger/popover |
| Dialog (`CommandDialog`) | Global ⌘K palette                | Inherits Dialog overlay elevation (`shadow-lg`), `p-0`, taller 48px input row        |

## States

- **selected** (keyboard/pointer highlight — cmdk drives this, not `:hover`): `data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground`. Never restyle with a raw `hover:` — the active row is `aria-selected`, not hovered.
- **focus-visible**: focus stays on `CommandInput` (`focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none`); the highlighted item is tracked via `aria-activedescendant`, so the list itself takes no focus ring.
- **disabled**: `data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50`.
- **loading**: wrap async results in cmdk's `CommandLoading` (add it — not exported by default); show a spinner/skeleton, never a bare empty list mid-fetch.
- **empty**: `CommandEmpty` — muted centered text (`py-6 text-sm`). Always present.

## Hierarchy

One Command per surface, one active row at a time; groups order most-likely actions first. In a view it is the single command surface — don't stack two palettes.

## Restrictions

- Never wire selection to `:hover` — cmdk marks the active row `data-[selected=true]` / `aria-selected`; hover styling desyncs keyboard and pointer.
- Never omit `CommandEmpty` — an unfiltered-to-nothing list looks broken.
- Never hard-code the icon or brand color into an item — Lucide 20px (`size-5` in dialog / `size-4` inline), `aria-hidden`, `text-muted-foreground`; the primary action is signaled by rank/position, not `bg-brand`.
- Never signal disabled by color alone — opacity + `pointer-events-none` + real `disabled` semantics.
- Never re-implement filtering — cmdk filters/sorts; use `keywords` for aliases, `shouldFilter={false}` only for server-driven results.
- Never nest it in your own modal — use `CommandDialog` so focus-trap/Escape/return-focus come from Radix.
- Never inline the input placeholder / group headings — route through `messages/<locale>.json`.

## Tokens

- **Color**: `bg-popover` / `text-popover-foreground` surface; `bg-accent` / `text-accent-foreground` active row; `text-muted-foreground` for placeholder, headings, shortcuts, icons; `border-border` separators.
- **Radius**: container `rounded-md`; items `rounded-sm`.
- **Elevation**: inline = flat (borrows trigger/popover); dialog = `overlay` (`shadow-lg`).
- **Focus**: `focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none` on the input only.
- **Type**: `body`/`text-sm` items, `caption` (muted `text-xs`) headings + shortcuts.
- **Motion**: dialog enter/leave via Dialog's ≤240ms ease tokens; guard with `motion-reduce:`. Item highlight is instant (no transition).

Sources:

- https://ui.shadcn.com/docs/components/command
- https://www.w3.org/WAI/ARIA/apg/patterns/combobox/
- https://github.com/pacocoursey/cmdk
