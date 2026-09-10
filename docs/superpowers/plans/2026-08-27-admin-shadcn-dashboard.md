# Admin shadcn Dashboard — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give the admin surface a polished shadcn/ui dashboard — a collapsible sidebar shell, an Overview landing, and a consistent shadcn visual pass across every page — composing the existing `@indiecrafts/packages-web-ui` primitives.

**Architecture:** A `SidebarProvider` shell (`AppShell` → `AppSidebar` + `SidebarInset`/`AppHeader`) rendered by `(dashboard)/layout.tsx` after its auth gate; a typed nav config drives the grouped sidebar + breadcrumbs; each page gets a shared `PageHeader` + `Card`/`Table`/form treatment. All new components live in the admin surface (app-owned) and compose `web-ui` primitives — **no Storybook**. A nonce-aware inline script applies the light/dark theme before paint.

**Tech Stack:** Next.js 16 (App Router) · React 19 · TypeScript strict · Tailwind v4 · shadcn/ui (`@indiecrafts/packages-web-ui`) · next-intl v4 · lucide-react · sonner.

**Spec:** `docs/superpowers/specs/2026-08-27-admin-shadcn-dashboard-design.md`

## Global Constraints

- **NO Storybook for admin UI.** Every component lives under `code/projects/web/surfaces/admin/src/user-interface/` and ships **no `.stories.tsx`**. Do not add the admin to any Storybook glob.
- **Config-first:** every user-facing string in `messages/{en,fr}.json` under `admin.*` (keep en/fr in structural parity — the messages-parity test); links via `@/i18n/routing` `Link` (never `next/link`); semantic tokens only (no raw hex/px); no hard-coded brand/URL/color.
- **shadcn from the package:** import `@indiecrafts/packages-web-ui/web/<name>` (exports map: `"./web/*": "./src/web/*.tsx"`). Do NOT copy shadcn source into the admin or edit the `web-ui` package. Read `code/packages/web/ui/src/web/sidebar.tsx` for the exact export names before using them (standard shadcn: `SidebarProvider, Sidebar, SidebarInset, SidebarTrigger, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarHeader, SidebarFooter, SidebarRail, useSidebar`).
- **CSP nonce:** `admin/src/proxy.ts` enforces a strict nonce CSP and sets `x-nonce`. Any inline `<script>` MUST carry `nonce={(await headers()).get("x-nonce") ?? undefined}` or it is blocked.
- **a11y:** one `<main id="main" tabIndex={-1}>` per page; icon-only controls get an `aria-label`; visible focus rings; WCAG AA on tokens.
- **Preserve behavior:** keep every page's existing server-side data fetch and every server action (`actions.ts`) unchanged — this is chrome + restyle, not a behavior change.
- **Verify:** `pnpm --filter @indiecrafts/web-surfaces-admin tsc` + `pnpm lint` + `pnpm verify` green. UI is presentational → no unit tests except genuine logic; the gate is tsc/lint + a visual pass (light + dark) at 375 / 768 / 1280.

## File Structure

**New — `code/projects/web/surfaces/admin/src/user-interface/`:**

- `lib/nav.ts` — the typed nav config (groups → items: `{ key, href, icon }`), one source of truth for sidebar + breadcrumb labels.
- `layout/ThemeToggle.tsx` — client light/dark toggle (data-theme + localStorage).
- `layout/theme-script.ts` — the no-flash inline-script string.
- `layout/AppSidebar.tsx` — client `Sidebar` (grouped nav, active via `usePathname`).
- `layout/NavUser.tsx` — client user menu (`DropdownMenu` + `Avatar` + Clerk sign-out).
- `layout/AppHeader.tsx` — client sticky header (`SidebarTrigger` + `Breadcrumbs` + `ThemeToggle`).
- `layout/Breadcrumbs.tsx` — client breadcrumb from `usePathname` + nav config.
- `layout/AppShell.tsx` — server shell (`SidebarProvider` + `AppSidebar` + `SidebarInset` + `AppHeader` + `Toaster` + children).
- `layout/PageHeader.tsx` — server page title block (`{ title, description?, actions? }`).

**Modified:** `admin/package.json` (add `lucide-react`, `sonner`); `[locale]/layout.tsx` (nonce'd theme script); `(dashboard)/layout.tsx` (wrap in `AppShell`); `(dashboard)/page.tsx` (Overview landing); the 8 page files (`sessions|users|data-requests|csp|backups|security|system|settings/page.tsx`) — `PageHeader` + `Card`; `sessions-table.tsx`, `backups-table.tsx`, `data-requests-table.tsx` (shadcn `Table`); `admin-role-form.tsx`, `settings-form.tsx` (shadcn controls + `sonner`); `messages/{en,fr}.json`; `admin/.claude/CLAUDE.md`, `admin/README.md`, `admin/CHANGELOG.md`.

---

### Task 1: Shell foundation — nav config, theme toggle (nonce-safe), deps, messages

**Files:**

- Create: `.../user-interface/lib/nav.ts`, `.../layout/ThemeToggle.tsx`, `.../layout/theme-script.ts`
- Modify: `admin/package.json` (deps), `.../[locale]/layout.tsx` (script), `messages/{en,fr}.json`
- Test: `.../user-interface/lib/nav.test.ts`

**Interfaces (Produces):** `NAV: NavGroup[]` where `NavGroup = { labelKey: string | null; items: NavItem[] }`, `NavItem = { key: string; href: string; icon: LucideIcon }`; `activeKey(pathname: string): string | undefined`; `<ThemeToggle label={{toggle,light,dark}} />`; `THEME_SCRIPT: string`.

- [ ] **Step 1: Deps.** In `admin/package.json` add `"lucide-react": "^0.400.0"` and `"sonner": "^1.5.0"` to `dependencies` (versions: match whatever `code/packages/web/ui/package.json` pins for each — read it and copy the exact ranges so there's one version). Run `pnpm install`.
- [ ] **Step 2: Nav config + failing test.** Create `nav.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { NAV, activeKey } from "./nav";
describe("admin nav", () => {
  it("has every page exactly once", () => {
    const keys = NAV.flatMap((g) => g.items.map((i) => i.key));
    expect(new Set(keys).size).toBe(keys.length);
    expect(keys).toContain("overview");
  });
  it("matches the active item by pathname (longest prefix, ignoring locale)", () => {
    expect(activeKey("/en/sessions")).toBe("sessions");
    expect(activeKey("/data-requests")).toBe("dataRequests");
    expect(activeKey("/en")).toBe("overview");
    expect(activeKey("/fr")).toBe("overview");
  });
});
```

- [ ] **Step 3: Run — expect FAIL** (`./nav` not found). `pnpm --filter @indiecrafts/web-surfaces-admin test -- nav`
- [ ] **Step 4: Implement `nav.ts`:**

```ts
import {
  LayoutDashboard,
  Users,
  MonitorSmartphone,
  FileText,
  ShieldAlert,
  DatabaseBackup,
  Server,
  Settings,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
export type NavItem = { key: string; href: string; icon: LucideIcon };
export type NavGroup = { labelKey: string | null; items: NavItem[] };
export const NAV: NavGroup[] = [
  {
    labelKey: null,
    items: [{ key: "overview", href: "/", icon: LayoutDashboard }],
  },
  {
    labelKey: "access",
    items: [
      { key: "users", href: "/users", icon: Users },
      { key: "sessions", href: "/sessions", icon: MonitorSmartphone },
    ],
  },
  {
    labelKey: "compliance",
    items: [
      { key: "dataRequests", href: "/data-requests", icon: FileText },
      { key: "csp", href: "/csp", icon: ShieldAlert },
    ],
  },
  {
    labelKey: "operations",
    items: [
      { key: "backups", href: "/backups", icon: DatabaseBackup },
      { key: "system", href: "/system", icon: Server },
      { key: "settings", href: "/settings", icon: Settings },
    ],
  },
  {
    labelKey: "security",
    items: [{ key: "security", href: "/security", icon: ShieldCheck }],
  },
];
/** Strip the optional locale prefix, then pick the item whose href is the longest matching prefix. `/` → overview. */
export function activeKey(pathname: string): string | undefined {
  const p = pathname.replace(/^\/(en|fr)(?=\/|$)/, "") || "/";
  const items = NAV.flatMap((g) => g.items);
  const match = items
    .filter((i) =>
      i.href === "/" ? p === "/" : p === i.href || p.startsWith(i.href + "/"),
    )
    .sort((a, b) => b.href.length - a.href.length)[0];
  return match?.key;
}
```

(If the repo's locale codes differ from `en|fr`, derive the regex from `localeCodes` in `@/config` instead of hardcoding.)

- [ ] **Step 5: Run — expect PASS.**
- [ ] **Step 6: Theme.** Create `theme-script.ts`:

```ts
/** Runs before paint to set data-theme from localStorage, else prefers-color-scheme. Kept tiny + string-literal so it can be injected as a nonce'd inline script. */
export const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem("admin-theme");if(!t)t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";document.documentElement.dataset.theme=t;}catch(e){}})();`;
```

Create `ThemeToggle.tsx` (client): read the current theme via `useSyncExternalStore` (subscribe to a `storage` event; getter reads `document.documentElement.dataset.theme`), render a `web-ui` `Button` (variant `ghost`, size `icon`) with lucide `Sun`/`Moon`, `aria-label={label.toggle}`; on click flip `document.documentElement.dataset.theme` + `localStorage.setItem("admin-theme", next)` and dispatch a `storage`-like update so the icon re-renders. Never set state in an effect (repo NEVER).

- [ ] **Step 7: Inject the script (nonce-safe).** In `[locale]/layout.tsx`, import `{ headers } from "next/headers"` + `THEME_SCRIPT`; inside the component `const nonce = (await headers()).get("x-nonce") ?? undefined;` and render, as the FIRST child of `<body>`, `<script nonce={nonce} dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />`. (Confirm `proxy.ts` `matcher` covers the layout route so `x-nonce` is present.)
- [ ] **Step 8: Messages.** Add to `admin` in BOTH `messages/en.json` + `messages/fr.json`: `nav.groups.{access,compliance,operations,security}`, `nav.{overview,users,sessions,dataRequests,csp,backups,system,settings,security}` (short item labels — reuse the existing `<page>.link` wording where it exists), `theme.{toggle,light,dark}`, `user.{account,signOut}`. en example: `"nav": { "groups": { "access": "Access", "compliance": "Compliance", "operations": "Operations", "security": "Security" }, "overview": "Overview", "users": "Users", "sessions": "Sessions", "dataRequests": "Data requests", "csp": "CSP reports", "backups": "Backups", "system": "System", "settings": "Settings", "security": "Security" }, "theme": { "toggle": "Toggle theme", "light": "Light", "dark": "Dark" }, "user": { "account": "Admin", "signOut": "Sign out" }`. Provide the French equivalents.
- [ ] **Step 9: Verify + commit.** `pnpm --filter @indiecrafts/web-surfaces-admin tsc` + `test -- nav`. `git commit -m "feat(admin): dashboard shell foundation — nav config, nonce-safe theme toggle, deps"`

---

### Task 2: The sidebar + header shell

**Files:** Create `.../layout/{AppSidebar,NavUser,AppHeader,Breadcrumbs,AppShell}.tsx`. Modify `(dashboard)/layout.tsx`.

**Interfaces:** Consumes `NAV`/`activeKey` (Task 1), `ThemeToggle`. Produces `<AppShell>{children}</AppShell>`.

- [ ] **Step 1:** `AppSidebar.tsx` (`"use client"`): compose `Sidebar` (`collapsible="icon"`) → `SidebarHeader` (a brand link to `/` — wordmark from `messages` `admin.title`, no external brand string) → `SidebarContent` mapping `NAV`: each group is a `SidebarGroup` with an optional `SidebarGroupLabel` (`t("nav.groups."+labelKey)`) and a `SidebarMenu` of `SidebarMenuItem`/`SidebarMenuButton asChild isActive={activeKey(usePathname())===item.key}` wrapping `<Link href={item.href}><item.icon/><span>{t("nav."+item.key)}</span></Link>` (Link from `@/i18n/routing`) → `SidebarFooter` with `<NavUser/>`. `useTranslations("admin")`.
- [ ] **Step 2:** `NavUser.tsx` (`"use client"`): a `DropdownMenu` triggered by a `SidebarMenuButton` showing an `Avatar` + label; menu has a **Sign out** item. Gate Clerk on `process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` / `useAuth().signOut` from `@clerk/nextjs` — when Clerk is absent, render a static "Admin" label with no sign-out (mirror how the app/website gate Clerk). Icon-only avatar has `aria-label`.
- [ ] **Step 3:** `Breadcrumbs.tsx` (`"use client"`): from `usePathname()` + `activeKey`, render `web-ui` `Breadcrumb` → Overview (link to `/`) › current page label (`t("nav."+activeKey)`), current is `BreadcrumbPage`. On `/` show just "Overview".
- [ ] **Step 4:** `AppHeader.tsx` (`"use client"` or server — prefer server, but it renders the client `Breadcrumbs`/`ThemeToggle`/`SidebarTrigger`): a `<header class="sticky top-0 z-10 flex h-14 items-center gap-2 border-b bg-background px-4">` with `SidebarTrigger` + a `Separator` (vertical) + `<Breadcrumbs/>` + a spacer (`ml-auto`) + `<ThemeToggle .../>`.
- [ ] **Step 5:** `AppShell.tsx` (server): `SidebarProvider` → `<AppSidebar/>` + `<SidebarInset>` ( `<AppHeader/>` + `{children}` ) ; mount the `web-ui` sonner `<Toaster/>` once here (bottom). Pass any label props the client children need (or let them `useTranslations` themselves — simpler).
- [ ] **Step 6:** Wire `(dashboard)/layout.tsx`: keep the auth-gate check; change the return to `return <AppShell>{children}</AppShell>;` (import from `@/user-interface/layout/AppShell`).
- [ ] **Step 7: Verify + commit.** tsc + lint. Manual: run the admin dev server, confirm the sidebar renders around every page, nav highlights the active item, collapses to a Sheet on mobile, theme toggles. `git commit -m "feat(admin): shadcn sidebar shell (AppSidebar + header + breadcrumbs + user menu)"`

---

### Task 3: PageHeader + Overview landing

**Files:** Create `.../layout/PageHeader.tsx`. Modify `(dashboard)/page.tsx`, `messages/{en,fr}.json`.

- [ ] **Step 1:** `PageHeader.tsx` (server): `export function PageHeader({ title, description, actions }: { title: string; description?: string; actions?: ReactNode })` → `<div class="mb-6 flex items-start justify-between gap-4"><div><h1 class="text-2xl font-semibold tracking-tight">{title}</h1>{description ? <p class="text-muted-foreground mt-1 text-sm">{description}</p> : null}</div>{actions ? <div class="flex gap-2">{actions}</div> : null}</div>`.
- [ ] **Step 2:** Rebuild `(dashboard)/page.tsx`: `<main id="main" tabIndex={-1} class="p-4 md:p-6">` → `<PageHeader title={t("title")} description={t("welcome")} />` → a stat-card grid (`grid gap-4 sm:grid-cols-2 lg:grid-cols-3`). Each stat card is a `web-ui` `Card` linking (whole-card `Link`) to its section: title label (`t("nav.<key>")`) + a lucide icon + a value. Values: fetch best-effort counts from the existing API (mirror `sessions/page.tsx`'s `fetchSessions` pattern — `API_URL` + `APP_API_TOKEN`, `cache: "no-store"`, try/catch → fallback). Where a count isn't cheaply available, show a muted "—" or a short status word (never error). Below the grid, the `AdminRoleForm` wrapped in a titled `Card`.
- [ ] **Step 3:** Messages: add `admin.overview.stats.<key>` labels if different from nav labels (else reuse `nav.*`); add any needed values copy. Both locales, parity.
- [ ] **Step 4: Verify + commit.** tsc + lint + visual. `git commit -m "feat(admin): Overview landing with stat cards"`

---

### Task 4: Tables → shadcn Table

**Files:** Modify `sessions-table.tsx`, `backups-table.tsx`, `data-requests-table.tsx`.

- [ ] **Step 1:** Restyle each to the `web-ui` shadcn `Table` set (`Table, TableHeader, TableRow, TableHead, TableBody, TableCell` from `@indiecrafts/packages-web-ui/web/table`), wrapping in a `Card` if the page doesn't already. Replace raw `<table>/<thead>/<tbody>/<tr>/<th>/<td>` with the shadcn components; keep the SAME columns, data, `t()` labels, and props (`rows`). Status-like cells (e.g. data-request status, backup outcome) render as a `web-ui` `Badge` with a sensible `variant`.
- [ ] **Step 2:** For `sessions-table.tsx` preserve the expandable row + live-session management EXACTLY (the `useTransition`/`useState` logic, `listUserSessions`/`revokeSession`/`revokeUserSessions`): the expanded detail becomes a `TableRow` with a full-width `TableCell colSpan={5}` containing the same content, restyled with tokens. Do not change the actions or their wiring.
- [ ] **Step 3: Verify + commit.** tsc + lint + visual (expand a session row still works). `git commit -m "feat(admin): tables restyled to shadcn Table"`

---

### Task 5: Forms → shadcn controls + toasts

**Files:** Modify `admin-role-form.tsx`, `settings-form.tsx`.

- [ ] **Step 1:** `admin-role-form.tsx`: replace the raw `<input>` with `web-ui` `Input` + a `Label`; keep the `Button`s. Replace the inline `<p role="status">{message}</p>` with a `sonner` `toast.success(t("granted"))` / `toast.error(t("error"))` call inside `run(...)` (import `{ toast } from "sonner"`). Keep the `grantAdmin`/`revokeAdmin` server actions + the `disabled` logic unchanged.
- [ ] **Step 2:** `settings-form.tsx`: same treatment — shadcn `Input`/`Label`/`Switch`/`Select` as fits the fields, a `sonner` toast on the save result, server action preserved.
- [ ] **Step 3: Verify + commit.** tsc + lint + visual (submit shows a toast). `git commit -m "feat(admin): forms restyled to shadcn controls + sonner toasts"`

---

### Task 6: Per-page chrome pass

**Files:** Modify `sessions/page.tsx`, `users/page.tsx`, `data-requests/page.tsx`, `csp/page.tsx`, `backups/page.tsx`, `security/page.tsx`, `system/page.tsx`, `settings/page.tsx`. Modify `messages/{en,fr}.json`.

- [ ] **Step 1:** For each page: change the wrapper from `<main class="mx-auto max-w-… p-8">` to `<main id="main" tabIndex={-1} class="p-4 md:p-6">`; replace the ad-hoc `<h1>`/`<p>` with `<PageHeader title={t("title")} description={t("subtitle")} />`; wrap the body (table/form/content) in a `web-ui` `Card` (with `CardHeader`/`CardContent` where a section title helps). Keep the existing server data fetch untouched.
- [ ] **Step 2:** Empty states: where a page shows `t("empty")` for no rows, render it inside a centered muted block in the `Card` (reuse `web-ui`'s `Empty` component if it exists — check `code/packages/web/ui/src/web/empty.tsx`; else a simple `<p class="text-muted-foreground py-10 text-center">`). Loading: where a page could stream, add a `Skeleton` fallback — otherwise skip (YAGNI).
- [ ] **Step 3:** Messages: ensure each page has `title` + `subtitle`/`description` keys (several exist — `sessions.title/subtitle`, `security.title/subtitle`; add the missing ones: `users`, `dataRequests`, `csp`, `backups`, `system`, `settings` each get `title` + `description`). Both locales, parity.
- [ ] **Step 4: Verify + commit.** tsc + lint + visual (every page has the header + card chrome, light + dark). `git commit -m "feat(admin): consistent PageHeader + Card chrome across all pages"`

---

### Task 7: Docs, changelog, final verify

**Files:** Modify `admin/.claude/CLAUDE.md`, `admin/README.md`, `admin/CHANGELOG.md`.

- [ ] **Step 1:** `admin/.claude/CLAUDE.md`: update the "Activated scaffold — placeholder pages; the real UI … TBD" line — the admin now has a shadcn dashboard shell (sidebar + header + theme) and a consistent page treatment; note the `user-interface/` layout components + that admin UI ships **no Storybook** by design; keep the "add auth before shipping" note. Edit, don't append.
- [ ] **Step 2:** `admin/README.md` + `admin/CHANGELOG.md`: a plain-language entry — the admin gained a shadcn dashboard shell (grouped sidebar, header, dark-mode toggle), an Overview landing, and a shadcn visual pass across pages; app-owned components, no Storybook.
- [ ] **Step 3: Full gate.** `pnpm --filter @indiecrafts/web-surfaces-admin tsc` + `pnpm lint` + `pnpm verify` green. **Visual pass:** run the admin (`pnpm --filter @indiecrafts/web-surfaces-admin dev`), screenshot the shell + Overview + a table page (Sessions) + a form page (Settings) at 375 / 768 / 1280 in **both light and dark**; confirm no clipping, the sidebar collapses to a Sheet on mobile, contrast holds, and active-nav + breadcrumbs are correct.
- [ ] **Step 4: Commit.** `git commit -m "docs(admin): document the shadcn dashboard shell + visual pass"`

---

## Self-Review (author checklist)

- **Spec coverage:** shell (T2) · nav grouping (T1 config, T2 render) · Overview stat cards (T3) · full page pass — PageHeader/Card (T6), tables (T4), forms+toasts (T5), empty/skeleton (T6) · theme toggle nonce-safe (T1) · tokens (all) · lucide+sonner deps (T1) · messages both locales (T1,T3,T6) · NO stories (constraint, honored — no `.stories.tsx` created) · docs/changelog (T7) ✓.
- **Naming consistency:** `NAV`/`NavGroup`/`NavItem`/`activeKey` defined in T1, consumed in T2/T3. `PageHeader({title, description?, actions?})` defined T3, used T3/T6. `THEME_SCRIPT` + `"admin-theme"` localStorage key + `data-theme` consistent T1↔ThemeToggle. shadcn imports all `@indiecrafts/packages-web-ui/web/<name>`.
- **Reuse:** `web-ui` primitives only; the website surface's `shared/layout` (theme no-flash, Clerk gating) is the reference; existing server fetches + `actions.ts` untouched.

## Open decision (confirm at execution)

- **Overview stat values:** if a cheap count endpoint doesn't exist for a metric (e.g. total users), show a muted "—" / a status word rather than adding a new API — the spec's Non-goals bar new endpoints. Flag any metric that would need one; don't build it.
