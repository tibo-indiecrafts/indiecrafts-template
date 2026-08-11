# Alert dialog

> shadcn `alert-dialog` · `src/user-interface/ui/alert-dialog.tsx`

**Use when** a consequential or irreversible action needs explicit confirmation before it runs (delete, discard, sign out). **Don't** use it for non-critical info, success messages, or forms — that's a plain `Dialog`, or a toast.

## Anatomy

- `AlertDialogTrigger` — the button that opens it (usually the destructive action itself).
- `AlertDialogOverlay` — dimmed backdrop (`bg-black/50`), added automatically by `Content`.
- `AlertDialogContent` — centered surface; contains everything below.
  - `AlertDialogHeader`
    - `AlertDialogMedia` (optional) — a `size-16` icon tile (`bg-muted`), for weight/emphasis.
    - `AlertDialogTitle` — required, states the decision as a question or object.
    - `AlertDialogDescription` — required, spells out the consequence.
  - `AlertDialogFooter`
    - `AlertDialogCancel` — dismiss, `outline` variant, focused on open.
    - `AlertDialogAction` — the confirm verb, `default` (brand) or `destructive`.

## Variants

| Variant           | Use for                            | Base (Tailwind defaults + tokens)                                                                                   |
| ----------------- | ---------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Confirm (default) | Safe/neutral commit                | `AlertDialogAction variant="default"` → `bg-brand text-brand-foreground`                                            |
| Destructive       | Delete / irreversible data loss    | `AlertDialogAction variant="destructive"` → error tokens; pair with a verb label + optional `AlertDialogMedia` icon |
| With media        | High-stakes, needs a glance-signal | add `AlertDialogMedia` (Lucide 20–32px, `aria-hidden`) above the title                                              |

`AlertDialogCancel` stays `outline` in every variant — never make the safe exit compete visually with the action.

## Sizes

| Size      | Max width     | Padding | Text                                                                |
| --------- | ------------- | ------- | ------------------------------------------------------------------- |
| `default` | `sm:max-w-lg` | `p-6`   | title `text-lg font-semibold`, desc `text-sm text-muted-foreground` |
| `sm`      | `max-w-xs`    | `p-6`   | same; footer becomes a 2-col grid                                   |

Pass via `<AlertDialogContent size="sm">`. `default` left-aligns from `sm:` up; `sm` stays centered.

## States

- **focus-visible** — on open, focus lands on `AlertDialogCancel` (Radix). Every button carries `focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none` (inherited from `Button`).
- **hover / active** — inherited from `Button` variants; don't restyle.
- **loading** — if the action is async, disable `AlertDialogAction` and show a spinner in it; don't close the dialog until it resolves (close manually, not via the built-in dismiss).
- **error** — surface a failed action as text inside the dialog, not color alone; keep the dialog open.

## Hierarchy

The most interruptive surface in the app — modal, focus-trapped, blocks everything. One at a time, never stacked, and only for a decision that can't be undone by a normal click.

## Restrictions

- Never use it for anything dismissible-without-consequence (info, marketing, a form) — that's `Dialog`. Alert dialog = a forced choice.
- Never label buttons "Yes"/"No"/"OK" — use the verb ("Delete", "Discard changes", "Sign out") so the choice is readable without the body text.
- Never signal "destructive" by red button alone — use `variant="destructive"` **and** a verb label (and optionally `AlertDialogMedia`).
- Never omit `AlertDialogTitle` or `AlertDialogDescription` — Radix uses both for the screen-reader announcement (WAI-ARIA alertdialog pattern).
- Never swap `next/link` or hand-roll the overlay/Escape/focus-trap — Radix owns them.
- Never inline the copy — title, description, and both button labels live in `messages/<locale>.json`.
- Never add a close "X" or make the overlay click-to-dismiss — an alert dialog exits only through Cancel or Action.
- Never make Cancel louder than Action, or auto-focus Action — the safe path stays the default focus.

## Tokens

- **Color** — surface `bg-background`; overlay `bg-black/50`; title `text-foreground`; description `text-muted-foreground`; media tile `bg-muted`; primary action `bg-brand`/`text-brand-foreground`; destructive action = error tokens only.
- **Radius** — `rounded-lg` surface; `rounded-md` media tile.
- **Elevation** — overlay level: `shadow-lg` + `border`.
- **Focus** — `focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none` on all controls.
- **Motion** — `duration-200` fade + `zoom-95` on enter/leave (Radix `data-[state]` + `animate-in/out`); under standard 240ms ceiling; guard custom motion with `motion-reduce:`.

Sources:

- https://ui.shadcn.com/docs/components/alert-dialog
- https://www.radix-ui.com/primitives/docs/components/alert-dialog
- https://uxmovement.com/buttons/5-rules-for-choosing-the-right-words-on-button-labels/
- https://www.nngroup.com/articles/confirmation-dialog/
