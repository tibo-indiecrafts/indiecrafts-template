# Sheet

> shadcn `sheet` · `src/user-interface/ui/sheet.tsx`

**Use when** an edge-anchored overlay panel holds a secondary task or supplementary content (filters, cart, nav, detail view) without leaving the page. **Don't** use it for a blocking confirmation or a short message — that's `Dialog`/`AlertDialog` (centered) or a toast.

## Anatomy

- **Overlay/scrim** — `bg-black/50`, fades in; click dismisses.
- **Container** — surface anchored to one screen edge, slides in from that edge.
- **Header** (`SheetHeader`) — `SheetTitle` (required) + optional `SheetDescription`.
- **Close** — `X` button top-right (also Esc + overlay click). `showCloseButton={false}` to hide.
- **Body** — scrollable content (the `children` between header and footer).
- **Footer** (`SheetFooter`) — pinned to bottom (`mt-auto`), primary + secondary actions.

## Variants

This sheet has **one behavioral variant** (modal, built on Radix `Dialog`); the axis is `side` — the edge it anchors to. No standard/non-modal variant exists here.

| Variant                  | Use for                                              | Base (Tailwind defaults + tokens)                                             |
| ------------------------ | ---------------------------------------------------- | ----------------------------------------------------------------------------- |
| `side="right"` (default) | Settings, detail, cart — the desktop default         | `inset-y-0 right-0 h-full w-3/4 sm:max-w-sm border-l bg-background shadow-lg` |
| `side="left"`            | Navigation / menu drawers                            | `inset-y-0 left-0 h-full w-3/4 sm:max-w-sm border-r bg-background`            |
| `side="bottom"`          | Mobile-first sheets, pickers on touch                | `inset-x-0 bottom-0 h-auto border-t bg-background`                            |
| `side="top"`             | Notifications / search bars dropping from top (rare) | `inset-x-0 top-0 h-auto border-b bg-background`                               |

## Sizes

No size prop. Width is fixed by the base (`w-3/4 sm:max-w-sm` ≈ 24rem cap for left/right); height is content-driven for top/bottom. Override on `SheetContent` `className` when a task needs more room (e.g. `sm:max-w-md` / `sm:max-w-lg`) — keep a max-width so it never spans the full viewport on desktop.

## States

- **focus-visible** — the close button and every interactive child get `focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none`. Radix moves focus into the panel on open and returns it to the trigger on close.
- **hover** (close button) — `opacity-70 hover:opacity-100`.
- **disabled** (close button) — `disabled:pointer-events-none`.
- **open/closed** — slide + fade, `data-[state=open]:duration-500 data-[state=closed]:duration-300 ease-in-out`; overlay fades. No loading/error state on the sheet itself — those belong to the content inside.

## Hierarchy

Modal: exactly **one open at a time**, above page content, below toasts. Never stack or nest a sheet inside a sheet.

## Restrictions

- Never omit `SheetTitle` — Radix requires it for the accessible name and warns without it; use `sr-only` if visually hidden.
- Never nest a sheet within a sheet, or open two at once.
- Never use a sheet for a decision that must block the user (destructive confirm) — use `AlertDialog`.
- Never hard-code the panel width in px — override with a Tailwind `max-w-*` utility, keeping a desktop cap.
- Never put the sole close affordance behind `showCloseButton={false}` without another labelled close inside — Esc/overlay alone fails discoverability.
- Never signal state by color alone inside the panel — pair with text/icon.
- Don't full-bleed on desktop; `sm:max-w-*` keeps context visible behind the scrim.

## Tokens

- **Color** — surface `bg-background`, edge `border-border` (`border-l/-r/-t/-b`), title `text-foreground`, description `text-muted-foreground`, scrim `bg-black/50`. Primary footer action = `bg-brand text-brand-foreground`; destructive = `error`.
- **Radius** — panel edges are flush (full-height/width), so no corner radius; controls inside use `rounded-md`.
- **Elevation** — `overlay` role: `shadow-lg` + scrim.
- **Focus** — `focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none` on all interactive elements.
- **Motion** — slide+fade, ~300–500ms enter/leave, `ease-in-out`; wrap or guard with `motion-reduce:` for reduced-motion users.
- **Icons** — Lucide `XIcon` at `size-4`, `aria-hidden` (paired with `sr-only` "Close").
- **Type** — title = `title`/`font-semibold`; description = `caption`/`text-muted-foreground text-sm`.

Sources:

- https://m3.material.io/components/side-sheets/guidelines
- https://github.com/material-components/material-components-android/blob/master/docs/components/SideSheet.md
- https://polaris.shopify.com/components/deprecated/sheet
- https://ant.design/components/drawer/
- https://ui.shadcn.com/docs/components/sheet
