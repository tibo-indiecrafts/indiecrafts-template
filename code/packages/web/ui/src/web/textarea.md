> shadcn `textarea` · `src/user-interface/ui/textarea.tsx`

**Use when** collecting multi-line free-form prose (messages, comments, descriptions, notes). **Don't** use for a single line (`input`), a fixed set of choices (`select`/`radio`), or code with fixed columns (use a `code` role field).

## Anatomy

- **Label** (above, always visible — a separate `<label htmlFor>`, not part of this component)
- **Field** — bordered multi-line box; auto-grows with content (`field-sizing-content` from `min-h-16`), text wraps (`wrap="soft"`), user-resize handle unless disabled
- **Supporting text** (below) — helper hint, or the error message when `aria-invalid`; optional character/word counter sits here too

The primitive renders only the **field**. Label, supporting text, and counter are composed around it.

## Variants

| Variant | Use for                                                | Base (Tailwind defaults + tokens)                                                                                             |
| ------- | ------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------- |
| Default | any multi-line text                                    | `border border-input bg-transparent rounded-md min-h-16 w-full px-3 py-2 text-base md:text-sm shadow-xs field-sizing-content` |
| Error   | invalid value — set `aria-invalid`, never a color prop | + `aria-invalid:border-destructive aria-invalid:ring-destructive/20`                                                          |

No `filled` vs `outlined` axis in shadcn — the base is the outlined style. Do not fork a filled variant unless the design system adds one.

## States

- **hover** — no distinct style by default; don't add a hover border (reserved for focus).
- **focus-visible** — `focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]`. Always present; never remove the ring.
- **disabled** — `disabled:opacity-50 disabled:cursor-not-allowed`. Use for temporarily unavailable input; prefer `readOnly` for text the user may read/copy but not edit.
- **error** — `aria-invalid` (see Variants). Pair with visible supporting text — never signal error by ring color alone.
- **loading** — no built-in state; if async (e.g. AI draft), keep the field enabled and show progress in adjacent supporting text, not inside the box.

## Hierarchy

One textarea per field, usually the tallest control in a form and placed last in its group; give it a natural resting height (`min-h-16`+) so it reads as "longer answer expected." Rarely more than one per view.

## Restrictions

- Never set a fixed `h-*` that fights `field-sizing-content` — cap growth with `max-h-*` + `overflow-y-auto` instead, so long input scrolls rather than clips.
- Never use `placeholder` as the label — it vanishes on typing and fails a11y. Every textarea has an associated `<label>` (or `aria-label`).
- Never signal error with `aria-invalid` alone — always render the message text below; if you enforce `maxLength`, show a live counter and announce it (`aria-live`), don't just silently block keystrokes.
- Never inline the placeholder/label/error/counter strings — pull from `messages/<locale>.json`.
- Never drop the focus ring or override `outline-none` without restoring `focus-visible:ring`.
- Never disable resize (`resize-none`) reflexively — allow vertical resize for long-form; only lock it when layout truly can't reflow.
- Never add sizes or change the radius ad hoc — extend via `cva` only if a token/spec exists.

## Tokens

- **Color** — `border-input`, `bg-transparent` (`dark:bg-input/30`), `text-foreground`, `placeholder:text-muted-foreground`; error `border-destructive` + `ring-destructive/20` (destructive is reserved for error state only).
- **Radius** — `rounded-md` (0.5rem default).
- **Elevation** — `shadow-xs` flat; the focus ring (`ring-[3px] ring-ring/50`) is the only lift.
- **Type** — `body` role; `text-base` on mobile, `md:text-sm` on desktop (16px mobile prevents iOS zoom).
- **Focus** — `focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:border-ring outline-none`.
- **Motion** — `transition-[color,box-shadow]` (~160ms ease-out); guard any added motion with `motion-reduce:`.
- **Sizing** — `min-h-16` (64px) start, auto-grows via `field-sizing-content`; `px-3 py-2` padding. Touch target already exceeds the 40/44px minimum.

Sources:

- https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/textarea
- https://carbondesignsystem.com/components/text-input/usage/
- https://ant.design/components/input
- https://m3.material.io/components/text-fields/overview
