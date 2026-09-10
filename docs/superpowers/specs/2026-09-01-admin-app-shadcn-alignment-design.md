# Admin + App shadcn alignment — design

**Date:** 2026-09-01
**Status:** Approved design, pre-plan
**Scope:** `code/projects/web/surfaces/app` (shell + page pass) · `code/projects/web/surfaces/admin` (visual-polish pass)

## Context

The `website`, `admin`, and `app` surfaces share one foundation — the token contract
(`code/packages/shared/ui-tokens/DESIGN.md`), the shadcn primitives package
(`@indiecrafts/packages-web-ui`, subpath imports `.../web/<name>`), and the config pattern
(`@/config`). They diverge on chrome, by design:

- **website** — marketing top-nav (`DefaultLayout` → `Header`/`Footer`); nav is editor content
  from a Sanity `navigation` singleton, gated by the `@/config` `pages` map. Fully on shadcn.
- **admin** — internal operator dashboard; shadcn `Sidebar` shell (`AppShell` → `AppSidebar` +
  `SidebarInset` + `AppHeader`) with a hardcoded grouped nav (`src/user-interface/lib/nav.ts`).
  Already fully on shadcn (shipped last session). Widest primitive set of the three.
- **app** — a bare scaffold: welcome, account, legal link-out, sign-in. **No header/footer/nav,
  almost no shadcn** (only `ShareButtons`). Pages render their own `<main>`.

The user asked to "revamp admin + app with shadcn using the same links/patterns as website".
Website nav cannot literally transfer (it is marketing content in Sanity, not code, and its
route set is marketing-shaped). The transferable thing is the **pattern**: shadcn components,
typed `@/i18n/routing`, strings in `messages/`, a gated/typed nav, and consistent header chrome.

## Decisions (confirmed with user)

1. **Same patterns, own links.** Each surface keeps its own route targets; they share the
   design language, not the link set.
2. **app shell = sidebar dashboard**, mirroring admin's `AppShell` pattern.
3. **app scope = style existing pages only.** No invented feature pages.
4. **admin = deeper visual-polish pass** (not chrome re-alignment, not left as-is).
5. **Approach A** — per-surface shell (copy admin's composition into app), no shared extraction.
6. **Storybook and docs must stay clean** — added requirement (see §5, §6).

## Goals

- `app` gets a sidebar-dashboard shell modeled on admin, with its own flat nav, and its existing
  pages restyled with shadcn — clean and consistent with admin.
- `admin` gets an in-place visual-polish pass: rhythm, hierarchy, states, restraint. No
  restructuring.
- Storybook stays green and free of any admin/app UI stories.
- Product docs + briefs + changelogs reflect the new app shell and admin polish, with no stale
  drift and no new parked issue tags.

## Non-goals

- No new app feature pages, no new routes, no auth-gate behavior change on app.
- No admin nav/route/structure changes (polish only).
- No shared `DashboardShell` extraction (rejected approach B — would force refactoring shipped
  admin and add an abstraction whose shared part is thin; the shared primitives already live in
  `@indiecrafts/packages-web-ui`).
- No edits to `src/user-interface/ui/**` (shadcn CLI-owned) in any surface.

## Approach A — per-surface shell

The shared thing (shadcn primitives) is already shared. The shell _composition_ legitimately
differs per surface (admin = grouped operator nav + operator header; app = flat user nav + user
header), so app copies admin's composition into its own `src/user-interface/layout/` — the same
"each surface owns its chrome" convention website and admin already follow. Copying ~4 small
files is lazier and lower-risk than a new brick.

## Design

### 1. App shell

New files under `code/projects/web/surfaces/app/src/user-interface/`:

- `layout/AppShell.tsx` — `SidebarProvider` → `AppSidebar` + `SidebarInset id="main" tabIndex={-1}`
  (the single `<main>` landmark) + `AppHeader` (sticky) + `Toaster`. Mirrors
  `admin/src/user-interface/layout/AppShell.tsx`.
- `layout/AppSidebar.tsx` — shadcn `Sidebar`; app logo/title in the header slot; a single
  `<nav aria-label={t("nav.label")}>` wrapping the nav items; `NavUser` in the footer slot.
- `layout/AppHeader.tsx` — sticky bar: `SidebarTrigger` + `Breadcrumbs` (left) · `LocaleSwitcher`
  - `ThemeToggle` (right).
- `layout/PageHeader.tsx` — `{ title, description?, actions? }`, same signature as admin's.
- `layout/NavUser.tsx` — avatar + dropdown-menu with **Legal** (link-out to website) and
  **Sign out**.
- `layout/Breadcrumbs.tsx`, `layout/ThemeToggle.tsx`, `LocaleSwitcher` — mirror admin's (theme
  toggle is the nonce-safe, no-flash `useSyncExternalStore` + `data-theme` + `localStorage`
  variant already used by admin).

Route grouping (mirror admin's `(dashboard)` split):

- New `src/app/[locale]/(app)/layout.tsx` renders `<AppShell>{children}</AppShell>`.
- Move `page.tsx` (home) and `account/page.tsx` and `legal/page.tsx` under `(app)/`.
- `sign-in/` stays at `[locale]/sign-in` **outside** the group (pre-auth, bare — no dashboard
  chrome).
- `[locale]/layout.tsx` is left untouched: it keeps `NextIntlClientProvider`, `SessionLogger`,
  `AnnouncementChrome`, `ShellOverlays`. The `(app)` layout nests inside it.

Landmark rule: `SidebarInset` renders the one `<main id="main">`; the moved pages drop their own
`<main>` wrapper and become a plain `<div className="p-4 md:p-6">` (same fix admin's Task 2 made).

### 2. App nav

`src/user-interface/lib/nav.ts` — a typed `NAV` array (mirror admin's shape, flat, no groups):

- **Home** → `/`
- **Account** → `/account`

Lucide icons; labels from `messages.app.nav.*`; an `activeKey(pathname)` helper like admin's.
**Legal** (typed `@/i18n/routing` link to the app's own `/legal` page, which itself links out to
website legal via `legalUrl`) and **Sign out** live in `NavUser`, not the rail.

### 3. App page styling

Restyle the three existing shelled pages with `PageHeader` + `Card` + shadcn primitives, matching
admin's density and treatment:

- **home** — welcome content in a `Card`; a couple of quick-link cards to Account / Legal.
- **account** — `PageHeader` + `Card`(s) for the existing account content.
- **legal** — `PageHeader` + `Card` list linking out to website legal pages (existing links).

Primitives imported from `@indiecrafts/packages-web-ui/web/*` (already present in the package —
no shadcn CLI add, no `ui/**` edits): `sidebar, breadcrumb, button, dropdown-menu, avatar,
separator, sonner, card`.

### 4. App i18n

Add to `app/messages/{en,fr}.json` a `nav` block under the existing `app` namespace:
`app.nav.label` (aria-string), `app.nav.home`, `app.nav.account`, plus any new page-copy keys the
restyle needs (`app.legal.*` / `app.account.*` if not already present). en/fr parity exact — the
`messages.test.ts` parity test guards it. No inline user-facing strings.

### 5. Admin visual-polish

In-place pass across the 9 pages (Overview · Users · Sessions · Data requests · CSP · Backups ·
System · Settings · Security). **Polish, not restructure** — surgical diffs only:

- Spacing rhythm + vertical density; consistent `Card` padding; tighten in-card margin drift
  (the parked `mt-6`/`mt-8` Minors from last session).
- Visual hierarchy: heading sizes/weights, muted secondary text, section separation.
- States: real empty states (not bare "—" only), loading affordances where data is fetched,
  error fallbacks kept honest.
- Overview: stat-card deltas / secondary labels so the numbers read as a dashboard.
- Restrained motion (hover/focus transitions) via existing tokens; no new libraries.

Run through the `visual-polish` / `design-critique` lens. No nav, route, or data-flow changes.

### 6. Storybook + docs clean

**Storybook** (`code/projects/web/tools/storybook`, `@indiecrafts/web-tools-storybook`):

- Constraint: **no `.stories.tsx` for admin or app UI.** Approach A adds no new shared bricks, so
  Storybook needs no new stories.
- Verification: grep confirms zero admin/app story files; the Storybook static build stays green;
  the gallery still documents only the design-system bricks (`ui` · `ui-components` · `ui-tokens`
  - `announcement`/`locale-suggest`).

**Docs** (`code/docs/` product docs, foldered like the code):

- Update the app brief `app/.claude/CLAUDE.md` and `app/README.md` (bare-scaffold → shelled
  surface) and any `code/docs/apps/web/**` page that describes the app surface, so there is no
  stale "no chrome / scaffold" drift.
- Log the change: app `CHANGELOG.md` (shell + page pass) and admin `CHANGELOG.md` (visual polish)
  — one entry each at its home altitude, per the repo's one-log rule.
- `pnpm tags:check` green (no off-list issue tags); `pnpm tags:report` shows no new parked tags
  (a rising count is a smell here — fix-in-diff is the default).

### 7. Shared design tokens (app + admin)

Both surfaces already consume the shared token contract — `@indiecrafts/packages-shared-ui-tokens/globals.css`
is line 1 of each `[locale]/layout.tsx` (app, admin, website all verified). This must stay true,
and every new/edited component must be **token-only**:

- Colors/spacing/radius via token classes (`bg-background`, `text-foreground`,
  `text-muted-foreground`, `border`, `bg-card`, `bg-sidebar`, `ring`, …) and the shadcn variants —
  never raw hex, `rgb()`, or arbitrary color literals.
- Light/dark come from the token layer + the surfaces' `data-theme` toggle; no per-component
  color overrides.
- Verification: `design-system-check` (the token-compliance pass) on the app + admin diffs; a grep
  for raw hex / `rgb(`/`hsl(` color literals in the new UI returns clean; admin keeps whatever
  contrast checks it has.

## Constraints / NEVERs (honored)

- Config-first: read from `@/config`; no hard-coded brand/URL/color/nav strings.
- Typed routing: `@/i18n/routing` only — never `next/link` / `next-intl/navigation`.
- User-facing strings in `messages/<locale>.json` — never inline.
- No edits to `src/user-interface/ui/**`; no runtime dependency on the shadcn library internals.
- Single `<main>` landmark per page; `<nav aria-label>`; real heading elements (not `CardTitle`
  divs standing in for headings).
- No non-public token under `NEXT_PUBLIC_`; never commit `.env*`.
- No admin/app UI in Storybook.

## File-level change map

**app (new):**

- `src/user-interface/layout/{AppShell,AppSidebar,AppHeader,PageHeader,NavUser,Breadcrumbs,ThemeToggle}.tsx`
- `src/user-interface/lib/nav.ts`
- `src/app/[locale]/(app)/layout.tsx`

**app (moved + restyled):**

- `src/app/[locale]/page.tsx` → `(app)/page.tsx`
- `src/app/[locale]/account/page.tsx` → `(app)/account/page.tsx`
- `src/app/[locale]/legal/page.tsx` → `(app)/legal/page.tsx`

**app (edited):**

- `messages/{en,fr}.json` — `app.nav.*` (+ page-copy keys as needed)
- `.claude/CLAUDE.md`, `README.md`, `CHANGELOG.md`

**admin (edited):**

- The 9 `(dashboard)/**/page.tsx` (+ their table/form components) — polish only
- `CHANGELOG.md`

**docs (edited):**

- `code/docs/apps/web/**` app-surface page(s), as drift requires

## Verification

- `messages.test.ts` parity (app + admin) covers new keys.
- `tsc` + lint via commit hook + CI; live lint cards + `typescript-lsp` during edit.
- a11y: single `<main>`, `<nav aria-label>`, real headings — structural pass on app + admin.
- Storybook: zero admin/app stories (grep); static build green.
- `pnpm tags:check` green; `pnpm tags:report` no new parked tags.
- `pnpm verify` green (fans out to every app).
- Presentational UI stays test-exempt (prior ruling); shell `activeKey` logic mirrors admin's
  tested approach.

## Execution

Spec → implementation plan (`writing-plans`) → build via SDD (task-per-unit, review after each,
whole-branch review at end) — the flow that shipped admin last session. Land on a feature branch,
merge on green.
