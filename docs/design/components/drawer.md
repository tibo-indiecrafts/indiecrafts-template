# Drawer

> shadcn `drawer` · `src/user-interface/ui/drawer.tsx`

**Use when** a focused task or supplementary content must open over the page without navigating away — mobile-first, dragged from a screen edge. **Don't** use it for desktop dialogs (use `dialog`), transient confirmations, or as a nav menu on a route that already has one.

## Anatomy

- `Drawer` (root, holds open state + `direction`) → `DrawerTrigger`
- `DrawerContent` = `DrawerPortal` + `DrawerOverlay` (scrim) + panel
- Drag handle — the pill, auto-rendered **only** for `direction="bottom"`
- `DrawerHeader` → `DrawerTitle` + `DrawerDescription`
- Body content (scrollable region — make it the flex child, not `h-full`)
- `DrawerFooter` (actions, `mt-auto`) + `DrawerClose`

## Variants

| Variant                                | Use for                                     | Base (Tailwind defaults + tokens)                                                                         |
| -------------------------------------- | ------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `direction="bottom"` (default)         | Mobile sheets, pickers, action lists        | `inset-x-0 bottom-0 max-h-[80vh] rounded-t-lg border-t bg-background`; drag handle shown                  |
| `direction="top"`                      | Notifications, search-from-top              | `inset-x-0 top-0 max-h-[80vh] rounded-b-lg border-b`; no handle                                           |
| `direction="right"` (LTR primary side) | Detail/edit panels, filters on desktop      | `inset-y-0 right-0 w-3/4 border-l sm:max-w-sm bg-background`                                              |
| `direction="left"`                     | Nav-adjacent panels (mirror `right` in RTL) | `inset-y-0 left-0 w-3/4 border-r sm:max-w-sm bg-background`                                               |
| Responsive (recommended)               | One surface, both breakpoints               | Render `Dialog` at `md:` and up, `Drawer` below — swap on `useIsMobile()`, don't force a sheet on desktop |

Header text centers for `top`/`bottom`, left-aligns `md:` for side panels — keep it.

## Sizes

| Size         | Extent                           | Padding               | Text                                                               |
| ------------ | -------------------------------- | --------------------- | ------------------------------------------------------------------ |
| Bottom / top | `max-h-[80vh]`, height = content | `p-4` header & footer | title `font-semibold`, description `text-sm text-muted-foreground` |
| Right / left | `w-3/4 sm:max-w-sm` (~24rem)     | `p-4`                 | same                                                               |

No numeric size prop — vary extent by overriding `max-h-*` / `max-w-*` via `className`. Never hardcode a px width when a Tailwind width utility fits.

## States

- **focus-visible** — every trigger, close, and footer control keeps `focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none`. Never strip it.
- **open / closed** — driven by `data-[state]` animate classes on overlay and content (vaul handles transform). Guard custom motion with `motion-reduce:`.
- **disabled** — on trigger/action buttons only, via the Button primitive (`disabled:opacity-50 disabled:pointer-events-none`); the drawer itself has no disabled state.
- **loading / error** — belong to the content you place inside (form state), not the drawer shell. Signal errors with `text-*` **and** an icon/text, never color alone.

## Hierarchy

One drawer per view at a time; it sits above page content beneath `bg-black/50` scrim (`z-50`). It is a peer of `dialog`/`sheet` — pick one per interaction, never stack a drawer over a dialog.

## Restrictions

- Never omit `DrawerTitle` + `DrawerDescription` — Radix/vaul needs them for the a11y label; use `sr-only` if visually unwanted, don't delete.
- Never use a drawer as the desktop-primary dialog — reach for the responsive Dialog+Drawer swap instead of shipping a phone sheet on a 1280 viewport.
- Never give the body `h-full` — it won't resolve in a content-sized drawer; make the scroll region a flex child.
- Never render the drag handle for side/top drawers or hand-roll one — it's auto-scoped to `direction="bottom"`.
- Never set the panel background to a raw color — it's `bg-background`; overlay is the only intentional `bg-black/50`.
- Never hardcode links inside — use `@/i18n/routing`; never inline copy — pull from `messages/<locale>.json`.
- Never disable Escape / outside-click dismissal or the focus trap — vaul owns them.
- Never mirror `left`/`right` by hand for RTL — drive `direction` off the active locale's `dir`.

## Tokens

- **Color** — panel `bg-background` / `text-foreground`; description `text-muted-foreground`; handle `bg-muted`; edge `border-border`; scrim `bg-black/50`. Actions inside use `bg-brand`/`text-brand-foreground` (primary) and `error` (destructive) via Button.
- **Radius** — `rounded-t-lg` / `rounded-b-lg` (0.75rem) on the open edge; handle `rounded-full`.
- **Elevation** — overlay tier (scrim + implicit); no ring needed — the scrim + border carry separation.
- **Type** — title = `title` role (`font-semibold`); description = `caption` (`text-sm` muted).
- **Focus** — `focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none` on all interactive parts.
- **Motion** — enter ease-out / leave ease-in via `data-[state]` animations; keep ≤240ms; wrap any custom transition in `motion-reduce:`.
- **Sizing** — touch targets ≥40px (44px on touch); footer buttons full-height controls; header/footer padding `p-4` (16px).

Sources:

- https://ui.shadcn.com/docs/components/drawer
- https://ant.design/components/drawer
- https://m3.material.io/components/bottom-sheets/specs
- https://atlassian.design/components/drawer/usage
