# Kbd

> shadcn `kbd` · `src/user-interface/ui/kbd.tsx`

**Use when** displaying a literal keyboard key or shortcut the user can press (`Ctrl`, `⌘K`, `Esc`). **Don't** use it as a decorative badge, a tag, or to style arbitrary short text — it is semantically keyboard input.

## Anatomy

- `Kbd` — a single key cap (renders the `<kbd>` element). Holds text (`Ctrl`) or a modifier glyph (⌘ ⇧ ⌥ ⌃) or a single Lucide icon.
- `KbdGroup` — inline wrapper that lays out multiple `Kbd` keys for a combo (`⌘ + K`), `gap-1`.

## Variants

Single, presentational primitive — no `cva`, no variant axis. Style stays constant; it only adapts context (see the tooltip case in Tokens).

| Variant  | Use for         | Base (Tailwind defaults + tokens)                                                                                                  |
| -------- | --------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Kbd      | one key         | `bg-muted text-muted-foreground h-5 min-w-5 px-1 rounded-sm text-xs font-medium font-sans inline-flex items-center justify-center` |
| KbdGroup | key combination | `inline-flex items-center gap-1` (wraps 2+ `Kbd`)                                                                                  |

## Sizes

No size axis. Fixed at `h-5` / `text-xs` to sit inline with `body`/`caption` text. Scale only by overriding `className` when embedded in a larger control, not by adding a size prop.

## States

Non-interactive by design — `pointer-events-none select-none`. No hover, focus, active, disabled, loading, or error states. The interactive element is the button/menu item that _owns_ the shortcut; `Kbd` is a label inside it and never receives focus itself.

## Hierarchy

Sits below its host control — a hint attached to a `Button`, menu item, tooltip, or input. Show at most one shortcut (one `KbdGroup`) per action; never a wall of key caps.

## Restrictions

- Never make it clickable or focusable — no `onClick`, no `tabIndex`, no wrapping in a link/button as the target. It labels the real control.
- Never use it for non-keyboard content (status pills, counts, tags) — reach for `Badge`.
- Never hardcode platform keys — resolve ⌘ vs Ctrl from the user's platform; keep the visible symbols out of components and in `messages/<locale>.json` where they are words (`Esc`, `Enter`).
- Never inflate the height to full control size; it is an inline hint, not a button.
- Icons inside are auto-sized to `size-3` — don't pass a larger icon expecting it to fit.

## Tokens

- Color: `bg-muted` surface, `text-muted-foreground` text, no border (flat elevation).
- Context override: inside a tooltip (`[data-slot=tooltip-content]`) it flips to `bg-background/20 text-background` (dark: `/10`) for contrast on the inverted surface — already wired in the component.
- Radius: `rounded-sm` (0.375rem) — one step tighter than the `rounded-md` default, reads as a key cap.
- Type: `text-xs font-medium font-sans` — sans, not the `code` role, since keys are labels not code.
- Elevation / focus / motion: none — flat, non-interactive, static.

Sources:

- https://ui.shadcn.com/docs/components/kbd
- https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/kbd
