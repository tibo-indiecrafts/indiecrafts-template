# Navigation menu

> shadcn `navigation-menu` · `src/user-interface/ui/navigation-menu.tsx`

**Use when** the primary desktop header nav needs top-level links, some of which open a rich mega-menu panel (columns of links, featured content). **Don't** use it for action menus (`dropdown-menu`), form selection (`select`/`combobox`), or the mobile nav — collapse to a `sheet`/`drawer` below `md`.

## Anatomy

- **Root** (`NavigationMenu`) — horizontal bar; `viewport` prop (default `true`) mounts a single shared `Viewport` for all panels.
- **List** (`NavigationMenuList`) — the row of top-level items (`gap-1`).
- **Item** (`NavigationMenuItem`) — one entry; holds either a plain Link or a Trigger + Content pair.
- **Trigger** (`NavigationMenuTrigger`) — button that opens a panel; trailing `ChevronDownIcon` rotates 180° when open.
- **Content** (`NavigationMenuContent`) — the panel; lay out links as a grid of `NavigationMenuLink`s.
- **Link** (`NavigationMenuLink`) — every navigational link, top-level or inside a panel. Wrap the repo router via `render`/`asChild`.
- **Viewport** (`NavigationMenuViewport`) — shared, collision-positioned panel container that animates to each panel's size.
- **Indicator** (`NavigationMenuIndicator`) — optional arrow tracking the active trigger.

## Variants

| Variant                     | Use for                                            | Base (Tailwind defaults + tokens)                                                                                                                       |
| --------------------------- | -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Link item (no trigger)      | Direct destinations (Pricing, Blog)                | `navigationMenuTriggerStyle()` — `h-9 px-4 py-2 text-sm font-medium rounded-md bg-background`, highlight `hover:bg-accent hover:text-accent-foreground` |
| Trigger + Content           | A section with sub-links (mega-menu)               | trigger as above + `data-[state=open]:bg-accent/50`; panel `bg-popover text-popover-foreground rounded-md border shadow`                                |
| `viewport={true}` (default) | Multiple panels that share one animated surface    | shared `Viewport`, sized via `--radix-navigation-menu-viewport-{width,height}`                                                                          |
| `viewport={false}`          | Single/independent panels anchored under each item | per-item `absolute top-full` panel, `rounded-md border shadow`                                                                                          |

## Sizes

No size axis. Trigger height is fixed at `h-9` (36px) via `navigationMenuTriggerStyle`. Note this sits below the repo's 40px control standard — if you need the taller target, override height on the composed instance rather than editing the primitive.

## States

- **hover** — `hover:bg-accent hover:text-accent-foreground` (triggers and links).
- **focus / focus-visible** — Radix moves DOM focus onto items, so `focus:bg-accent` covers keyboard highlight; the visible ring is `focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1` (shadcn's tighter default — keep the ring, never remove it).
- **active** (current page) — `data-[active=true]:bg-accent/50 data-[active=true]:text-accent-foreground` on `NavigationMenuLink`; drive it with `aria-current`/the active flag, never color alone.
- **open** (trigger) — `data-[state=open]:bg-accent/50` + chevron `rotate-180`.
- No disabled/loading/error states — nav links are always live; if a destination is gated, hide the item, don't disable it.

## Hierarchy

Top-level site chrome inside `Header`. One per layout, one open panel at a time. 3–7 top-level items; deeper structure goes inside a panel, not more top-level entries.

## Restrictions

- Never use it for action/command menus or as a generic popover — that's `dropdown-menu`; this is links only.
- Never render raw `<a>` or `next/link` — wrap `@/i18n/routing`'s `Link` via `NavigationMenuLink render`/`asChild` so locale + active state work.
- Never add `role="menu"`/`role="menuitem"` or `aria-*` menu semantics — Radix deliberately uses the disclosure-navigation pattern, not the WAI-ARIA menu role; hand-adding it breaks screen readers.
- Never hand-roll open/close, hover-intent, arrow keys, Escape, or return-focus — Radix owns them.
- Never inline link labels — pull from `messages/<locale>.json`.
- Never ship it as the mobile nav — it assumes a horizontal bar; swap to `sheet`/`drawer` under `md` and verify at 375.
- Never edit this file to restyle — pass `className` on the composed instance (component classes first, yours win via `cn`).
- Never mix `viewport={true}` and `viewport={false}` styling assumptions — the panel positioning classes differ per mode.

## Tokens

- **Color** — bar `bg-background text-foreground`; highlight/open `bg-accent`/`bg-accent/50` + `text-accent-foreground`; panel `bg-popover text-popover-foreground`; indicator + borders `border-border`; panel icons `text-muted-foreground`.
- **Radius** — trigger + viewport/panel `rounded-md`; in-panel links `rounded-sm`.
- **Elevation** — panel/viewport overlay `shadow` + `border` (≈ overlay role).
- **Type** — triggers/links `text-sm font-medium`; panel link titles `text-sm`, descriptions `text-muted-foreground` (caption role).
- **Focus** — `focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1`; item highlight via Radix DOM focus + `focus:bg-accent`.
- **Motion** — panels `data-[state=open]:animate-in zoom-in-90 fade-in` / `data-[state=closed]:animate-out zoom-out-95 fade-out` (~200ms, ease-out enter / ease-in leave); directional `data-[motion=from-/to-]:slide-*`; chevron `transition duration-300 rotate-180`. Respects `motion-reduce:` via the shared animation utilities.
- **Icons** — Lucide, `size-4` (16px) in panels / `size-3` chevron, `aria-hidden`.

Sources:

- https://www.radix-ui.com/primitives/docs/components/navigation-menu
- https://ui.shadcn.com/docs/components/navigation-menu
- https://m3.material.io/components/navigation-bar/guidelines
- https://m3.material.io/components/menus/guidelines
