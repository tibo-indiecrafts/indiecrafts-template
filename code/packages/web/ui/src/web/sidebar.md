> shadcn `sidebar` · `src/user-interface/ui/sidebar.tsx`

**Use when** an app-shell needs persistent primary navigation with 5+ destinations grouped into sections. **Don't** use it for a public marketing page (use `Header`), for a one-off overlay panel (use `Sheet`), or for a second/third tier of nav (that goes in-page — tabs or `SidebarMenuSub`, one level only).

## Anatomy

- `SidebarProvider` — required context wrapper (owns open/collapsed state, `Cmd/Ctrl+B` shortcut, cookie persistence); pair with `SidebarInset` for the main content column.
- `Sidebar` — the panel. Props: `side` (left/right), `variant`, `collapsible`.
- `SidebarHeader` — sticky top: brand/logo, workspace switcher, or `SidebarInput` search.
- `SidebarContent` — scrollable middle. Holds `SidebarGroup`s.
- `SidebarGroup` → `SidebarGroupLabel` (section caption) + `SidebarMenu` (`ul`) → `SidebarMenuItem` → `SidebarMenuButton` (+ optional `SidebarMenuAction`, `SidebarMenuBadge`, `SidebarMenuSub`).
- `SidebarFooter` — sticky bottom: user/account menu, secondary links.
- `SidebarRail` — thin edge handle to toggle. `SidebarTrigger` — the toggle button (place in the page header).

## Variants

| Variant (`variant`) | Use for                                              | Base (Tailwind defaults + tokens)                                         |
| ------------------- | ---------------------------------------------------- | ------------------------------------------------------------------------- |
| `sidebar` (default) | Standard app shell, panel flush to the viewport edge | `bg-sidebar text-sidebar-foreground`, `border-r border-sidebar-border`    |
| `floating`          | Panel detached from the edge, sits on the canvas     | adds `rounded-lg border border-sidebar-border shadow-sm` (card elevation) |
| `inset`             | Content is a rounded card inset from the shell       | `SidebarInset` gets `rounded-xl shadow-sm`; wrapper paints `bg-sidebar`   |

Collapse behavior is a separate axis (`collapsible`): `offcanvas` (default — slides fully out), `icon` (collapses to a `3rem` icon rail; menu labels hide, tooltips appear on hover), `none` (always expanded, no toggle). On mobile every variant renders as a `Sheet` (modal drawer with scrim) regardless of `collapsible`.

## Sizes

| Token              | Width           | Set via                  |
| ------------------ | --------------- | ------------------------ |
| Expanded (desktop) | `16rem` (256px) | `--sidebar-width`        |
| Mobile drawer      | `18rem` (288px) | `--sidebar-width-mobile` |
| Icon rail          | `3rem` (48px)   | `--sidebar-width-icon`   |

Menu button sizes (`SidebarMenuButton size`): `sm` h-7 text-xs · `default` h-8 text-sm · `lg` h-12. These are dense-shell heights (< the 40px control default) — acceptable inside the sidebar; the mobile drawer keeps ≥40px touch targets.

## States

- **hover** — `hover:bg-sidebar-accent hover:text-sidebar-accent-foreground`.
- **active / selected** — `isActive` prop → `data-[active=true]:bg-sidebar-accent … font-medium`. Set from the current route; pair the tint with `aria-current="page"` — never signal selection by color alone.
- **focus-visible** — `focus-visible:ring-2` on `ring-sidebar-ring` (always present on every interactive part).
- **disabled** — `disabled:opacity-50 disabled:pointer-events-none` (also `aria-disabled`).
- **loading** — `SidebarMenuSkeleton` (optional `showIcon`) for async menus.
- **collapsed (icon mode)** — labels/badges/actions/submenus hide; `SidebarMenuButton tooltip` surfaces the label on hover.

## Hierarchy

One sidebar per app shell. It is the primary navigation surface — everything else (breadcrumbs, tabs, in-page nav) sits below it. Don't nest sidebars or run two at once.

## Restrictions

- Never mount `Sidebar` without `SidebarProvider` — `useSidebar()` throws.
- Never use `next/link` for menu items — pass the `@/i18n/routing` `Link` via `asChild` on `SidebarMenuButton`.
- Never inline menu labels or section captions — pull from `messages/<locale>.json`.
- Never go past one level of submenu (`SidebarMenuSub`). Deeper tiers → in-page tabs (Carbon: the shell nav supports no third tier).
- Never fill it with unbounded/user-generated lists — it degrades fast past a screenful; show only frequent destinations.
- Never hard-code widths in a component — override the `--sidebar-width*` CSS vars.
- Never edit `src/user-interface/ui/sidebar.tsx` (shadcn CLI-managed) — compose around it.
- Don't hand-roll the mobile drawer or its scrim/Escape/focus-trap — it already delegates to `Sheet` (Radix).

## Tokens

- **Color:** `bg-sidebar`, `text-sidebar-foreground`, `bg-sidebar-accent`/`text-sidebar-accent-foreground` (hover+active), `border-sidebar-border`, `ring-sidebar-ring`. These are the sidebar-scoped roles in `globals.css`; the inset/main column uses `bg-background`.
- **Radius:** menu items `rounded-md`; floating panel `rounded-lg`; inset content `rounded-xl`.
- **Elevation:** `sidebar` flat with `border-r`; `floating` = card (`shadow-sm` + border); mobile drawer = overlay (`Sheet`, `shadow-lg` + scrim).
- **Type:** group label = caption (`text-xs`, `text-sidebar-foreground/70`); menu item = body/`text-sm`.
- **Focus:** `focus-visible:ring-2 focus-visible:ring-sidebar-ring` on every interactive part.
- **Motion:** width/slide transitions `duration-200 ease-linear` (within the ≤240ms layout budget); guard bespoke additions with `motion-reduce:`.

Sources:

- https://ui.shadcn.com/docs/components/sidebar
- https://m3.material.io/components/navigation-drawer/guidelines
- https://carbondesignsystem.com/components/UI-shell-left-panel/usage/
- https://atlassian.design/components/side-navigation
