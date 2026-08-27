# Admin shadcn Dashboard — Design Spec

**Goal:** Give the admin surface a polished shadcn/ui dashboard — a collapsible sidebar shell, a real
Overview landing, and a consistent shadcn visual pass across every page — composing the existing
`@indiecrafts/packages-web-ui` primitives. App-owned; **no Storybook**.

**Status:** design approved in chat (full-page-pass scope; grouped nav; dark-mode toggle). Awaiting spec review → plan.

**Date:** 2026-08-27

---

## Context

The admin (`code/projects/web/surfaces/admin`) is a working ops dashboard — pages for **Overview, Users,
Sessions, Data requests, CSP reports, Backups, Security, System, Settings**, with table components
(`sessions-table`, `backups-table`, `data-requests-table`), forms (`admin-role-form`, `settings-form`),
`actions.ts` (grant/revoke admin), and API routes. But the `(dashboard)/layout.tsx` is **only an auth
gate** (`return <>{children}</>`) — there is **no shell**: each page is a bare
`<main className="mx-auto max-w-… p-8">` with an `<h1>` + a table/form. Tokens are already wired
(`ui-tokens/globals.css` imported in `[locale]/layout.tsx`).

The admin already depends on `@indiecrafts/packages-web-ui` + `@indiecrafts/packages-shared-ui-tokens`
and transpiles both. `web-ui` ships the **full shadcn dashboard kit**: `sidebar`, `breadcrumb`,
`dropdown-menu`, `separator`, `sheet`, `scroll-area`, `avatar`, `badge`, `card`, `button`, `command`,
`tooltip`, `sonner`, `table`, `tabs`, `skeleton`, `collapsible`. So this is composition, not new deps.

## Global Constraints

- **Admin UI is NOT in Storybook.** Every component built here lives inside the admin surface
  (`code/projects/web/surfaces/admin/src/user-interface/`), composes `web-ui` primitives, and ships **no
  `.stories.tsx`**. Storybook globs only the design-system packages, never app surfaces — this is the
  default; keep it that way (do not add the admin to any Storybook glob).
- **Config-first NEVERs:** every user-facing string in `messages/<locale>.json` (`admin.*`); internal
  links via `@/i18n/routing` (never `next/link`); no hard-coded brand/URL/color; semantic tokens only
  (no raw hex/px).
- **shadcn primitives come from the package** — import `@indiecrafts/packages-web-ui/web/<name>`. Do NOT
  copy shadcn source into the admin or hand-edit the `web-ui` package.
- **Boundaries:** the admin is an app surface; it composes packages, never imports another app.
- **a11y:** one `<main id="main" tabIndex={-1}>` per page; nav is a real `<nav>`; the sidebar/sheet come
  with focus management; every icon-only control has an `aria-label`; visible focus rings; WCAG AA
  contrast on the theme tokens.
- **Verify:** `pnpm --filter @indiecrafts/web-surfaces-admin tsc` + `pnpm verify` green; visual check at
  375 / 768 / 1280 in both light and dark.

## Architecture — the dashboard shell

All new files under `code/projects/web/surfaces/admin/src/user-interface/`:

- **`layout/AppShell.tsx`** — the shell, rendered by `(dashboard)/layout.tsx` *after* the existing
  auth-gate check. Composes `SidebarProvider` → `<AppSidebar/>` + `<SidebarInset>` ( `<AppHeader/>` +
  `{children}` ). `SidebarProvider` persists the collapsed state (its built-in cookie).
- **`layout/AppSidebar.tsx`** — `Sidebar` (`collapsible="icon"`): `SidebarHeader` (brand wordmark/logo,
  linking to Overview) · `SidebarContent` with one `SidebarGroup` per nav group (below) rendered from
  the nav config · `SidebarFooter` with `<NavUser/>`.
- **`layout/NavUser.tsx`** — a `DropdownMenu` over an `Avatar` (Clerk user when configured, else a
  generic admin label) with a **Sign out** item (Clerk `signOut`, gated on `hasClerk`).
- **`layout/AppHeader.tsx`** — a sticky header inside `SidebarInset`: `SidebarTrigger` · a `Breadcrumb`
  derived from the active route · a spacer · `<ThemeToggle/>`. (A `command`-palette search is a
  documented future add, not in v1.)
- **`layout/PageHeader.tsx`** — a shared page title block: `{ title, description?, actions? }` — one
  `<h1 className="text-2xl font-semibold">` + a muted description + an optional right-aligned actions
  slot. Replaces every page's ad-hoc `<h1>`/`<p>`.
- **`layout/ThemeToggle.tsx`** — see § Theme.
- **`lib/nav.ts`** — the typed nav config: `NavGroup[] = { label: string; items: { titleKey: string;
  href: StaticAdminPathname; icon: LucideIcon }[] }[]`. One source of truth for the sidebar AND the
  breadcrumb label lookup.

`(dashboard)/layout.tsx` keeps its auth gate and wraps `children` in `<AppShell>`.

## Nav structure (confirmed)

| Group | Items |
|---|---|
| *(no header)* | **Overview** (`/`) |
| **Access** | Users (`/users`) · Sessions (`/sessions`) |
| **Compliance** | Data requests (`/data-requests`) · CSP reports (`/csp`) |
| **Operations** | Backups (`/backups`) · System (`/system`) · Settings (`/settings`) |
| **Security** | Security (`/security`) |

Icons from `lucide-react` (e.g. `LayoutDashboard, Users, MonitorSmartphone, FileText, ShieldAlert,
DatabaseBackup, Server, Settings, ShieldCheck`). Group labels + item labels are `messages` keys
(`admin.nav.*`). The active item is marked via `usePathname` (client `AppSidebar` island) with
`isActive` on `SidebarMenuButton`.

## Overview landing (`(dashboard)/page.tsx`)

Replace the flat link list with a dashboard landing:
- A responsive grid of **stat `Card`s** — Users · Active sessions · Pending data-requests · Recent
  backups · CSP reports (recent) · System status — each showing a count/label + a lucide icon, the whole
  card linking to its section. Counts are fetched best-effort from the same API the pages use
  (`API_URL` + `APP_API_TOKEN`); when unconfigured, cards render a muted "—" (never error).
- The grant/revoke **`AdminRoleForm`** below, wrapped in a titled `Card`.

## Full page pass (every page + its table/form)

Apply one consistent treatment (a repeatable pattern, one task per page/area in the plan):
- Each page: `<PageHeader title description />` then content in shadcn `Card`(s); keep the existing
  server-side data fetch untouched.
- **Tables** (`sessions-table`, `backups-table`, `data-requests-table`): restyle to shadcn `Table`
  (`Table/TableHeader/TableRow/TableHead/TableBody/TableCell`), status values as `Badge`s where
  meaningful; keep the row data/props unchanged.
- **Forms** (`admin-role-form`, `settings-form`): shadcn form controls (`Input`, `Label`, `Button`,
  `Select`/`Switch` as fits); on submit, a `sonner` toast for success/error (replacing inline text where
  present). Preserve the existing server actions + validation.
- **Empty states:** a consistent muted `Card`/`Empty` block (reuse `web-ui`'s `Empty` if present, else a
  small local pattern). **Loading:** `Skeleton` rows for tables where a page streams.

## Theme toggle

- `ThemeToggle` (client): a `Button` (icon) that toggles `document.documentElement.dataset.theme`
  between `"light"`/`"dark"`, persisting to `localStorage`. Read the stored value via
  `useSyncExternalStore` (never set-state-in-effect).
- **No flash:** a tiny inline `<script>` in `[locale]/layout.tsx`'s `<head>` (nonce-aware if the admin
  proxy sets a CSP nonce — check `proxy.ts`) applies the stored/`prefers-color-scheme` theme to `<html>`
  before paint. `ui-tokens/globals.css` already defines both palettes under `[data-theme]` +
  `prefers-color-scheme`.

## Icons + deps

Add **`lucide-react`** to the admin `package.json` (already a transitive dep of `web-ui`; declare it
directly so the nav's `import { … } from "lucide-react"` resolves under pnpm strict) + to
`transpilePackages` only if required (icon lib usually needs no transpile). No other new deps.

## Messages

Extend `messages/{en,fr}.json` `admin` namespace: `nav.groups.{access,compliance,operations}`,
`nav.<page>` item labels (reuse the existing `admin.<page>.link` where present, else add), each page's
`PageHeader` `title`/`description`, the overview stat-card labels, `theme.{light,dark,toggle}`,
`user.signOut`. Keep en/fr in structural parity (the messages-parity test).

## Reuse (do not reinvent)

- Every visual comes from `@indiecrafts/packages-web-ui/web/*` shadcn primitives — compose, don't rebuild.
- The website surface's `user-interface/shared/layout/` (Header/Footer/ThemeToggle patterns) is the
  reference for structure + the no-flash theme approach — adapt, don't copy verbatim.
- Keep every page's existing server data fetch + server actions.

## Testing / verification

- `pnpm --filter @indiecrafts/web-surfaces-admin tsc` + `pnpm lint` + `pnpm verify` green.
- `pnpm --filter @indiecrafts/web-surfaces-website shadscan` is a website script; for the admin, the
  gate is tsc + lint + a manual visual pass.
- **No Storybook stories** for any admin component (constraint).
- Visual: screenshot the shell + Overview + one table page + one form page at 375 / 768 / 1280 in **both
  light and dark**; confirm the sidebar collapses to a Sheet on mobile and nothing clips.
- Unit test only genuine logic (e.g. the active-route matcher in `lib/nav.ts` if non-trivial); the UI is
  presentational — covered by the visual pass, not tests.

## Non-goals / YAGNI

- No command-palette / global search in v1 (documented future add).
- No new admin *features* (no new data or endpoints) — this is chrome + a visual pass over existing pages.
- No charts/analytics widgets on Overview beyond simple stat cards.
- No per-user theme persistence server-side (localStorage only).

## Open questions

- None blocking. Overview stat sources are best-effort against the existing API; exact counts wire to
  whatever endpoints each page already calls.
