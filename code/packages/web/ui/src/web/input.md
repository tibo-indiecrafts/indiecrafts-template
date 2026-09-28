> shadcn `input` · `src/user-interface/ui/input.tsx`

**Use when** collecting a single line of free-form text, email, number, URL, password, or a file. **Don't** use for multi-line prose (`textarea`), a fixed set of choices (`select`/`radio`), or on/off (`checkbox`/`switch`).

## Anatomy

- **Label** (above, always visible — a separate `<label htmlFor>`, not part of this component)
- **Field** — bordered container: optional leading icon · input text / `placeholder` · optional trailing icon or action
- **Supporting text** (below) — helper hint, or the error message when `aria-invalid`

The primitive renders only the **field**. Label, supporting text, and icon slots are composed around it.

## Variants

| Variant | Use for                                                | Base (Tailwind defaults + tokens)                                                                                          |
| ------- | ------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| Default | text · email · number · url · password · search        | `border border-input bg-transparent rounded-md h-9 px-3 py-1 text-base md:text-sm shadow-xs`                               |
| File    | uploads (`type="file"`)                                | same field + `file:` slot: `file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground` |
| Error   | invalid value — set `aria-invalid`, never a color prop | + `aria-invalid:border-destructive aria-invalid:ring-destructive/20`                                                       |

No `filled` vs `outlined` axis in shadcn — the base is the outlined style. Do not fork a filled variant unless the design system adds one.

## States

- **hover** — no distinct style by default; don't add a hover border (reserved for focus).
- **focus-visible** — `focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]`. Always present; never remove the ring.
- **disabled** — `disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none`. Use for temporarily unavailable input; prefer `readOnly` for values the user may read/copy but not edit.
- **error** — `aria-invalid` (see Variants). Pair with visible supporting text — never signal error by ring color alone.
- **loading** — no built-in state; if async, show a trailing spinner in an icon slot and keep the field enabled.

## Hierarchy

One input per field, stacked in a vertical form; group related fields, and keep field heights consistent across a form. The label and error text carry meaning — the field is the neutral container between them.

## Restrictions

- Never use `placeholder` as the label — it vanishes on typing and fails a11y. Every input has an associated `<label>` (or `aria-label`).
- Never signal error with `aria-invalid` alone — always render the message text below.
- Never inline the placeholder/label/error strings — pull from `messages/<locale>.json`.
- Never drop the focus ring or override `outline-none` without restoring `focus-visible:ring`.
- Never build a filled/underline variant, add sizes, or change the radius ad hoc — extend via `cva` only if a token/spec exists.
- Never wire validation state through a custom color prop — drive it from `aria-invalid`.
- Leading/trailing icons are `aria-hidden` and decorative; if an icon is the only control (clear, reveal password), it needs its own labelled `<button>`.

## Tokens

- **Color** — `border-input`, `bg-transparent` (`dark:bg-input/30`), `text-foreground`, `placeholder:text-muted-foreground`, selection `bg-primary`/`text-primary-foreground`; error `border-destructive` + `ring-destructive/20`.
- **Radius** — `rounded-md` (0.5rem default).
- **Elevation** — `shadow-xs` flat; the focus ring (`ring-[3px] ring-ring/50`) is the only lift.
- **Type** — `body` role; `text-base` on mobile, `md:text-sm` on desktop (16px mobile prevents iOS zoom).
- **Focus** — `focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:border-ring outline-none`.
- **Motion** — `transition-[color,box-shadow]` (~160ms ease-out); guard any added motion with `motion-reduce:`.
- **Sizing** — base `h-9` (36px). Repo control-height guidance is 40px desktop / 44px touch — bump `h-10`/`h-11` where touch targets matter.

Sources:

- https://m3.material.io/components/text-fields/guidelines
- https://carbondesignsystem.com/components/text-input/usage/
- https://atlassian.design/components/textfield/usage
