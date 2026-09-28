> shadcn `popover` · `src/user-interface/ui/popover.tsx`

**Use when** a button reveals rich, interactive content (a form, filters, extra actions) anchored to that trigger without leaving the page. **Don't** use it for plain hover hints (that's a tooltip), a list of commands (that's a dropdown menu), or a decision that must block the page (that's a dialog).

## Anatomy

- `Popover` — root state container (open/closed).
- `PopoverTrigger` — the interactive element that toggles it; always a real `<button>` (use `render`/`asChild` to wrap `Button`). Never a hover-only or non-interactive element.
- `PopoverContent` — portaled floating panel; the focus scope. Optional inside: `PopoverHeader` → `PopoverTitle` + `PopoverDescription`, then body content, then a close/confirm action.
- `PopoverAnchor` (optional) — decouples positioning from the trigger.

## Variants

The primitive ships no `cva` variants. The real decision axes are behavior + placement — set them via props, not by forking the component.

| Variant             | Use for                                                             | Base (Tailwind defaults + tokens)                                                                                       |
| ------------------- | ------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Non-modal (default) | Info/quick actions; page stays interactive, outside-click dismisses | `modal={false}` (Radix default) — no scroll lock, no backdrop                                                           |
| Modal               | Focused sub-task that must be finished/cancelled first              | `modal` — traps focus + blocks page; if it's a real decision, use `Dialog` instead                                      |
| Placement           | Point the panel at the trigger                                      | `side` (top/right/bottom/left) · `align` (start/center/end, default `center`) · `sideOffset={4}` · `avoidCollisions` on |
| Panel shell         | The floating surface itself                                         | `bg-popover text-popover-foreground rounded-md border p-4 shadow-md z-50 w-72`                                          |

## States

- **trigger focus-visible** — `focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none` (inherited from `Button`; never remove it).
- **open / closed** — animated via `data-[state=open]`/`data-[state=closed]` (fade + zoom + directional slide); guard with `motion-reduce:`.
- **disabled** — disable the trigger only (`disabled` on `Button`); a disabled popover is just an unopenable trigger.
- No `hover`, `active`, `loading`, or `error` state on the panel itself — those belong to the controls _inside_ it (buttons, inputs), styled by their own tokens.

## Hierarchy

One open popover per view; opening another (or clicking outside / pressing Escape) closes it. It sits above page content (`z-50`) but below modal dialogs and toasts — never stack a dialog inside a popover.

## Restrictions

- Never trigger on hover or focus — popovers open on click/Enter/Space. Hover text → tooltip.
- Never put destructive confirmations ("Delete account?") or anything that must not be dismissed by an outside click in a popover — use `Dialog`.
- Never hand-roll Escape / outside-click / return-focus — Radix owns dismissal and returns focus to the trigger on close.
- Never render a menu of actions here (`role="menuitem"` items) — use `DropdownMenu`; a popover's content is arbitrary, unlisted.
- Never hard-code the panel color/radius/shadow — the surface is `bg-popover` + `rounded-md` + `shadow-md`, not raw values.
- Keep it compact: `w-72` default; widen with a `w-*` utility, don't inline a px width. If content needs the full viewport on mobile, switch to `Sheet`/`Drawer`.
- Content is portaled — style via the passed `className`, don't reach into `[data-slot]` internals to reposition.

## Tokens

- **Color:** `bg-popover` / `text-popover-foreground` (panel), `text-muted-foreground` (`PopoverDescription`), `border-border` (`border`).
- **Radius:** `rounded-md` (0.5rem, default).
- **Elevation:** `shadow-md` (raised) as shipped; it's an overlay, so `shadow-lg` is acceptable for a heavier panel — never flat.
- **Type:** `PopoverTitle` = title role (`font-medium text-sm`); `PopoverDescription` = caption/muted.
- **Focus:** `focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none` on the trigger (always).
- **Motion:** enter/leave ≈160ms fade+zoom+slide via `data-[state]`; `origin-(--radix-popover-content-transform-origin)`; wrap with `motion-reduce:`.

Sources:

- https://www.radix-ui.com/primitives/docs/components/popover
- https://ui.shadcn.com/docs/components/popover
- https://polaris.shopify.com/components/overlays/popover
- https://component.gallery/components/popover/
