# Sonner

> shadcn `sonner` · `src/user-interface/ui/sonner.tsx`

**Use when** you need a brief, non-blocking confirmation of a background action (saved, copied, sent). **Don't** use it for critical errors, validation, or anything the user must read or act on — use an inline banner/alert instead.

## Anatomy

- **Container** — `bg-popover` surface, rounded, `overlay` elevation, fixed corner of the viewport.
- **Icon** (optional) — 16px Lucide, type-colored (`CircleCheckIcon` / `InfoIcon` / `TriangleAlertIcon` / `OctagonXIcon` / spinning `Loader2Icon`).
- **Message** — one line of text; optional secondary `description` line (`text-muted-foreground`).
- **Action button** (optional, max one) — e.g. "Undo".
- **Close/dismiss** (optional) — X or swipe-to-dismiss.

## Variants

| Variant                               | Use for                                    | Base (Tailwind defaults + tokens)                                                            |
| ------------------------------------- | ------------------------------------------ | -------------------------------------------------------------------------------------------- |
| `toast()` default                     | Neutral status, no icon                    | `bg-popover text-popover-foreground border-border`                                           |
| `toast.success()`                     | Completed action                           | success icon; keep body on `bg-popover` (color the icon, not the surface)                    |
| `toast.info()`                        | Passive notice                             | info icon on `bg-popover`                                                                    |
| `toast.warning()`                     | Reversible caution                         | warning icon on `bg-popover`                                                                 |
| `toast.error()`                       | Non-blocking failure only                  | `error` icon; reserve `text-destructive`/`error` for the icon — never full-bleed the surface |
| `toast.loading()` / `toast.promise()` | In-flight async, resolves to success/error | spinning `Loader2Icon`; no auto-dismiss until resolved                                       |

Do not enable `richColors` by default — it floods the whole surface with role color and breaks the token contract. Color the icon, keep the container `bg-popover`.

## States

- **hover** — pauses the auto-dismiss timer (sonner default); on stacked toasts, `expand` reveals the stack.
- **focus-visible** — action + close buttons get `focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none`.
- **active** — action button press; standard button token feedback.
- **loading** — spinner via `animate-spin`, `motion-reduce:animate-none`; timer suspended until promise settles.
- **error** — icon + text signal state; never color alone (WCAG). Not a substitute for a persistent error banner.

## Hierarchy

Sits above page content at `overlay` elevation but below dialogs/sheets/menus; one relevant toast at a time (cap the visible stack at ~3, newest on top).

## Restrictions

- Never use a toast for errors the user must fix, form validation, or destructive confirmation — those need an inline alert or dialog.
- Never put long copy, multiple actions, or links a user must click before it vanishes — timed dismissal can outrun the reader.
- Never auto-dismiss `loading`/critical toasts on a timer (a11y: users need time; keep until resolved or explicitly closed).
- Never signal state by surface color alone — pair the type with its icon + text.
- Never turn on `richColors` or hand-roll positioning/animation — keep the token-driven defaults; don't hardcode hex/px.
- Never mount more than one `<Toaster />`; place it once in the root layout.

## Tokens

- **Color:** `--normal-bg: var(--popover)`, `--normal-text: var(--popover-foreground)`, `--normal-border: var(--border)` (set in `sonner.tsx`); type accent lives on the icon (`success`/`info`/`warning`/`error`/`brand`), never the whole surface.
- **Radius:** `--border-radius: var(--radius)` → `rounded-md` default.
- **Elevation:** `overlay` (`shadow-lg`).
- **Focus:** `focus-visible:ring-2 focus-visible:ring-ring` on action/close.
- **Motion:** slide-in from viewport edge, ~160ms ease-out enter / ease-in leave; guard the loader with `motion-reduce:`.
- **Icons:** Lucide 16px (`size-4`), `aria-hidden` (message text carries the meaning).

Sources:

- https://m3.material.io/components/snackbar/specs
- https://polaris.shopify.com/components/deprecated/toast
- https://carbondesignsystem.com/components/notification/usage/
- https://sonner.emilkowal.ski/
