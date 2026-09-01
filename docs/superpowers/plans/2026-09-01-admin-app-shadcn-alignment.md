# Admin + App shadcn alignment — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give the `app` surface a shadcn sidebar-dashboard shell mirroring `admin` (its existing pages restyled, not extended), and run a visual-polish pass over the already-shadcn `admin`.

**Architecture:** Approach A — per-surface shell. `app` gets its own `AppShell`/`AppSidebar`/`AppHeader`/`NavUser`/`PageHeader`/`LocaleSwitcher` under `src/user-interface/layout/`, modeled on admin's, with its own flat nav (`lib/nav.ts`). A route group `(app)/` carries the shell; `sign-in` stays outside it. No shared extraction — the shadcn primitives are already shared via `@indiecrafts/packages-web-ui`. Admin is polished in place, no structural change.

**Tech Stack:** Next.js 16 (App Router) · React 19 · TypeScript strict · Tailwind v4 · shadcn/ui (`@indiecrafts/packages-web-ui/web/*`) · next-intl v4 · Clerk · Vitest.

**Spec:** `docs/superpowers/specs/2026-09-01-admin-app-shadcn-alignment-design.md`

## Global Constraints

Every task's requirements implicitly include these. Values copied from the spec:

- **Config-first:** read from `@/config`; never hard-code brand/URL/color/nav strings.
- **Typed routing:** import `Link`/`useRouter`/`redirect`/`usePathname` from `@/i18n/routing` only — never `next/link` or `next-intl/navigation`. The one exception already in the code: cross-origin legal links use a plain `<a>` (another origin, not a route).
- **Strings in `messages/<locale>.json`** — never inline user-facing text. en/fr key sets identical (the parity test enforces it).
- **No edits to `src/user-interface/ui/**`** (shadcn CLI-owned); no runtime dependency on library internals.
- **No Storybook stories for admin or app UI** — Storybook globs cover only the design-system packages.
- **A11y:** exactly one `<main id="main" tabIndex={-1}>` per page (the shell's `SidebarInset` owns it); nav wrapped in `<nav aria-label=…>`; real `<h1>`/`<h2>` for headings, not `CardTitle` divs standing in for document structure.
- **Token-only styling:** colors/spacing via token classes (`bg-background`, `text-foreground`, `text-muted-foreground`, `border`, `bg-card`, `bg-sidebar`, `text-primary`, `ring`, …) and shadcn variants — never raw hex, `rgb(`, or `hsl(` literals. Both `app` and `admin` keep `import "@indiecrafts/packages-shared-ui-tokens/globals.css"` as line 1 of `[locale]/layout.tsx`.
- **Secrets:** never expose a non-public token under `NEXT_PUBLIC_`; never commit `.env*`.
- **Run from repo root** via `pnpm --filter <pkg> …`; never `cd` into an app.
- **AGENTS.md:** if `next dev`/`next build` re-adds the "This is NOT the Next.js you know" block to a surface's `AGENTS.md`, commit it with the work (per that file's own instruction) so the tree stays clean.

Package names: app = `@indiecrafts/web-surfaces-app`, admin = `@indiecrafts/web-surfaces-admin`.

---

### Task 1: Wire Vitest into `app`

App has no test runner today (no `test` script, no `vitest.config.ts`, no parity test). Add the infra so Tasks 2–3 can test. Mirror admin's setup exactly (same directory depth → identical relative path to the shared base).

**Files:**
- Create: `code/projects/web/surfaces/app/vitest.config.ts`
- Modify: `code/projects/web/surfaces/app/package.json` (add `test` script)
- Create: `code/projects/web/surfaces/app/messages/messages.test.ts`

**Interfaces:**
- Produces: a runnable `pnpm --filter @indiecrafts/web-surfaces-app test` (Vitest, happy-dom base, `@`→`src` alias).

- [ ] **Step 1: Create the vitest config** (verbatim copy of admin's — same depth)

`code/projects/web/surfaces/app/vitest.config.ts`:
```ts
import { fileURLToPath } from "node:url";
import { mergeConfig } from "vitest/config";
import shared from "../../../../../vitest.shared";

// Colocated *.test.{ts,tsx} in this package; extends the shared happy-dom base.
// Adds the app's `@/` → `src` alias so lib tests import app modules exactly as
// production code does (the shared base only stubs `server-only`).
export default mergeConfig(shared, {
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
```

- [ ] **Step 2: Add the `test` script** to `code/projects/web/surfaces/app/package.json`

Add to `"scripts"` (place it right after `"tsc"`, mirroring admin):
```json
"test": "vitest run",
```

- [ ] **Step 3: Add the messages parity test**

`code/projects/web/surfaces/app/messages/messages.test.ts`:
```ts
import { describe, expect, it } from "vitest";
import en from "./en.json";
import fr from "./fr.json";

// Every user-facing string lives in messages/<locale>.json. A missing key in one
// locale silently ships an untranslated (or crashing) string — so the locale files
// must have identical key sets. This test fails the moment they drift.
function keyPaths(obj: unknown, prefix = ""): string[] {
  if (obj === null || typeof obj !== "object") return [prefix];
  return Object.entries(obj as Record<string, unknown>).flatMap(([k, v]) =>
    keyPaths(v, prefix ? `${prefix}.${k}` : k),
  );
}

describe("app i18n message parity", () => {
  it("en.json and fr.json cover the same keys", () => {
    const enKeys = new Set(keyPaths(en));
    const frKeys = new Set(keyPaths(fr));
    const missingInFr = [...enKeys].filter((k) => !frKeys.has(k));
    const missingInEn = [...frKeys].filter((k) => !enKeys.has(k));
    expect({ missingInFr, missingInEn }).toEqual({ missingInFr: [], missingInEn: [] });
  });
});
```

- [ ] **Step 4: Run the tests — verify green**

Run: `pnpm --filter @indiecrafts/web-surfaces-app test`
Expected: PASS (en/fr are currently in parity; one test file, one passing test).

- [ ] **Step 5: Commit**

```bash
git add code/projects/web/surfaces/app/vitest.config.ts code/projects/web/surfaces/app/package.json code/projects/web/surfaces/app/messages/messages.test.ts
git commit -m "test(app): wire vitest + messages parity test"
```

---

### Task 2: App i18n keys (en + fr)

Add the nav/user/theme/locale/home keys the shell and restyled pages consume, plus `account.title`/`description` for the account PageHeader. Parity is guarded by Task 1's test.

**Files:**
- Modify: `code/projects/web/surfaces/app/messages/en.json`
- Modify: `code/projects/web/surfaces/app/messages/fr.json`

**Interfaces:**
- Produces (consumed by Tasks 3–6): `app.nav.{label,home,account}`, `app.user.{account,signOut,legal}`, `app.theme.{toggle,light,dark}`, `app.locale.label`, `app.home.{accountDesc,legalDesc}`, `account.title`, `account.description`.

- [ ] **Step 1: Extend the `app` namespace in `en.json`**

In `code/projects/web/surfaces/app/messages/en.json`, replace the `"app": { … }` block with:
```json
  "app": {
    "title": "indiecrafts",
    "subtitle": "App shell — i18n, consent and version prompts wired.",
    "legalLink": "Legal",
    "nav": { "label": "App navigation", "home": "Home", "account": "Account" },
    "user": { "account": "Account", "signOut": "Sign out", "legal": "Legal" },
    "theme": { "toggle": "Toggle theme", "light": "Light", "dark": "Dark" },
    "locale": { "label": "Change language" },
    "home": {
      "accountDesc": "Manage your account and data.",
      "legalDesc": "Review our legal documents."
    }
  },
```

- [ ] **Step 2: Add `title`/`description` to the `account` namespace in `en.json`**

In the same file, add these two keys at the top of the `"account": {` object (before `"delete"`):
```json
    "title": "Account",
    "description": "Manage your account.",
```

- [ ] **Step 3: Mirror both in `fr.json`**

`app` block in `code/projects/web/surfaces/app/messages/fr.json` — keep the existing `title`/`subtitle`/`legalLink` French values already present, and add:
```json
    "nav": { "label": "Navigation", "home": "Accueil", "account": "Compte" },
    "user": { "account": "Compte", "signOut": "Se déconnecter", "legal": "Mentions légales" },
    "theme": { "toggle": "Changer de thème", "light": "Clair", "dark": "Sombre" },
    "locale": { "label": "Changer de langue" },
    "home": {
      "accountDesc": "Gérez votre compte et vos données.",
      "legalDesc": "Consultez nos documents légaux."
    }
```
And at the top of the `account` block in `fr.json`:
```json
    "title": "Compte",
    "description": "Gérez votre compte.",
```

- [ ] **Step 4: Run the parity test — verify green**

Run: `pnpm --filter @indiecrafts/web-surfaces-app test`
Expected: PASS (en/fr key sets identical). If it lists `missingInFr`/`missingInEn`, fix the drift.

- [ ] **Step 5: Commit**

```bash
git add code/projects/web/surfaces/app/messages/en.json code/projects/web/surfaces/app/messages/fr.json
git commit -m "i18n(app): nav/user/theme/locale/home + account header keys"
```

---

### Task 3: App nav config + test (TDD)

A flat nav (no groups — app has two rail items) plus the locale-stripping `activeKey`, mirroring admin's logic.

**Files:**
- Create: `code/projects/web/surfaces/app/src/user-interface/lib/nav.ts`
- Create: `code/projects/web/surfaces/app/src/user-interface/lib/nav.test.ts`

**Interfaces:**
- Produces (consumed by Task 5): `NAV: NavItem[]` where `NavItem = { key: string; href: string; icon: LucideIcon }`, and `activeKey(pathname: string): string | undefined`.

- [ ] **Step 1: Write the failing test**

`code/projects/web/surfaces/app/src/user-interface/lib/nav.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { NAV, activeKey } from "./nav";

describe("app nav", () => {
  it("has every page exactly once", () => {
    const keys = NAV.map((i) => i.key);
    expect(new Set(keys).size).toBe(keys.length);
    expect(keys).toContain("home");
  });
  it("matches the active item by pathname (longest prefix, ignoring locale)", () => {
    expect(activeKey("/en/account")).toBe("account");
    expect(activeKey("/account")).toBe("account");
    expect(activeKey("/en")).toBe("home");
    expect(activeKey("/fr")).toBe("home");
  });
});
```

- [ ] **Step 2: Run — verify it fails**

Run: `pnpm --filter @indiecrafts/web-surfaces-app test -- nav`
Expected: FAIL — cannot resolve `./nav`.

- [ ] **Step 3: Implement `nav.ts`**

`code/projects/web/surfaces/app/src/user-interface/lib/nav.ts`:
```ts
import { Home, UserRound, type LucideIcon } from "lucide-react";
import { localeCodes } from "@/config";

export type NavItem = { key: string; href: string; icon: LucideIcon };

/** The app's flat sidebar nav. Labels come from `messages.app.nav.*`. */
export const NAV: NavItem[] = [
  { key: "home", href: "/", icon: Home },
  { key: "account", href: "/account", icon: UserRound },
];

// Matches an optional leading `/<locale>` segment (e.g. `/en`, `/fr`) — built from the
// registered locale codes rather than hardcoded, so a new locale needs no change here.
const LOCALE_PREFIX = new RegExp(`^/(${localeCodes.join("|")})(?=/|$)`);

/** Strip the optional locale prefix, then pick the item whose href is the longest matching prefix. `/` → home. */
export function activeKey(pathname: string): string | undefined {
  const p = pathname.replace(LOCALE_PREFIX, "") || "/";
  return NAV.filter((i) => (i.href === "/" ? p === "/" : p === i.href || p.startsWith(i.href + "/")))
    .sort((a, b) => b.href.length - a.href.length)[0]?.key;
}
```

- [ ] **Step 4: Run — verify it passes**

Run: `pnpm --filter @indiecrafts/web-surfaces-app test -- nav`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add code/projects/web/surfaces/app/src/user-interface/lib/nav.ts code/projects/web/surfaces/app/src/user-interface/lib/nav.test.ts
git commit -m "feat(app): flat sidebar nav config + activeKey"
```

---

### Task 4: App theme (no-flash) + layout injection

Copy admin's nonce-safe theme pattern, namespaced to `app-theme`. App's `proxy.ts` already stamps `x-nonce` and the layout already reads `headers()`, so this is a 3-line layout edit plus two small files.

**Files:**
- Create: `code/projects/web/surfaces/app/src/user-interface/layout/theme-script.ts`
- Create: `code/projects/web/surfaces/app/src/user-interface/layout/ThemeToggle.tsx`
- Modify: `code/projects/web/surfaces/app/src/app/[locale]/layout.tsx`

**Interfaces:**
- Produces (consumed by Task 5): `THEME_SCRIPT: string`; `ThemeToggle({ label: { toggle; light; dark } })`.

- [ ] **Step 1: Create `theme-script.ts`** (admin's, key `app-theme`)

```ts
/** Runs before paint to set data-theme from localStorage, else prefers-color-scheme. Kept tiny + string-literal so it can be injected as a nonce'd inline script. */
export const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem("app-theme");if(!t)t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";document.documentElement.dataset.theme=t;}catch(e){}})();`;
```

- [ ] **Step 2: Create `ThemeToggle.tsx`** (admin's, key `app-theme`)

```tsx
"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@indiecrafts/packages-web-ui/web/button";

type Theme = "light" | "dark";

export type ThemeToggleLabel = { toggle: string; light: string; dark: string };

function getTheme(): Theme {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
}

/** Icon-only theme toggle. Reads `document.documentElement.dataset.theme` (set before paint
 *  by `THEME_SCRIPT`) via `useSyncExternalStore` — never state-in-effect. Flips the theme +
 *  persists it to `localStorage["app-theme"]`, then dispatches a `storage` event (native
 *  `storage` events don't fire in the tab that wrote the value) so the icon re-renders. */
export function ThemeToggle({ label }: { label: ThemeToggleLabel }) {
  const theme = useSyncExternalStore<Theme>(subscribe, getTheme, () => "light");

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    localStorage.setItem("app-theme", next);
    window.dispatchEvent(new StorageEvent("storage", { key: "app-theme", newValue: next }));
  };

  const Icon = theme === "dark" ? Moon : Sun;

  return (
    <Button variant="ghost" size="icon" aria-label={label.toggle} title={label[theme]} onClick={toggle}>
      <Icon className="size-4" aria-hidden="true" />
    </Button>
  );
}
```

- [ ] **Step 3: Inject the theme script in `[locale]/layout.tsx`**

In `code/projects/web/surfaces/app/src/app/[locale]/layout.tsx`:

1. Add the import (next to the other `@/user-interface` imports):
```tsx
import { THEME_SCRIPT } from "@/user-interface/layout/theme-script";
```
2. `requestHeaders` already exists in this file. Just below the `gpcSignal` line, add:
```tsx
  // Carries the per-request CSP nonce (set by src/proxy.ts) so the inline theme script runs
  // under the strict nonce CSP.
  const nonce = requestHeaders.get("x-nonce") ?? undefined;
```
3. As the **first child of `<body>`** (before `<NextIntlClientProvider>`), add:
```tsx
        <script nonce={nonce} dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
```

- [ ] **Step 4: Typecheck**

Run: `pnpm --filter @indiecrafts/web-surfaces-app tsc`
Expected: clean (no errors).

- [ ] **Step 5: Commit**

```bash
git add code/projects/web/surfaces/app/src/user-interface/layout/theme-script.ts code/projects/web/surfaces/app/src/user-interface/layout/ThemeToggle.tsx code/projects/web/surfaces/app/src/app/[locale]/layout.tsx
git commit -m "feat(app): no-flash light/dark theme (nonce-safe)"
```

---

### Task 5: App shell components + `(app)` route group

The sidebar shell mirroring admin, with app's flat nav, a user menu (Legal + Sign out), a locale switcher, and no breadcrumbs (a two-page rail doesn't warrant them; the `PageHeader` `<h1>` names the page).

**Files:**
- Create: `…/app/src/user-interface/layout/AppShell.tsx`
- Create: `…/app/src/user-interface/layout/AppSidebar.tsx`
- Create: `…/app/src/user-interface/layout/AppHeader.tsx`
- Create: `…/app/src/user-interface/layout/NavUser.tsx`
- Create: `…/app/src/user-interface/layout/PageHeader.tsx`
- Create: `…/app/src/user-interface/layout/LocaleSwitcher.tsx`
- Create: `…/app/src/app/[locale]/(app)/layout.tsx`

**Interfaces:**
- Consumes: `NAV`/`activeKey` (Task 3), `ThemeToggle` (Task 4), `app.*` messages (Task 2).
- Produces (consumed by Task 6): `AppShell({ children })` rendering the single `<main id="main">`.

- [ ] **Step 1: `PageHeader.tsx`** (admin's, verbatim)

```tsx
import type { ReactNode } from "react";

/** Page-level heading: title + optional description, with optional right-aligned actions. */
export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-6 flex items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {description ? <p className="text-muted-foreground mt-1 text-sm">{description}</p> : null}
      </div>
      {actions ? <div className="flex gap-2">{actions}</div> : null}
    </div>
  );
}
```

- [ ] **Step 2: `LocaleSwitcher.tsx`** (minimal, typed-routing based)

```tsx
"use client";

import { useTransition } from "react";
import { Languages } from "lucide-react";
import { useLocale } from "next-intl";
import { routing, usePathname, useRouter } from "@/i18n/routing";
import { Button } from "@indiecrafts/packages-web-ui/web/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@indiecrafts/packages-web-ui/web/dropdown-menu";

/** Switch the active locale, preserving the current path (no localized pathnames on this surface). */
export function LocaleSwitcher({ label }: { label: string }) {
  const active = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={label} disabled={pending}>
          <Languages className="size-4" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {routing.locales.map((loc) => (
          <DropdownMenuItem
            key={loc}
            disabled={loc === active}
            onClick={() => startTransition(() => router.replace(pathname, { locale: loc }))}
          >
            {loc.toUpperCase()}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```
(Note: `routing` is exported from `@/i18n/routing` alongside `Link`/`useRouter`/`usePathname`.)

- [ ] **Step 3: `NavUser.tsx`** (admin's, plus a Legal link; namespace `app`)

```tsx
"use client";

import { useTranslations } from "next-intl";
import { useAuth } from "@clerk/nextjs";
import { UserRound } from "lucide-react";
import { Link } from "@/i18n/routing";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@indiecrafts/packages-web-ui/web/dropdown-menu";
import { Avatar, AvatarFallback } from "@indiecrafts/packages-web-ui/web/avatar";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@indiecrafts/packages-web-ui/web/sidebar";

// Public key, safe to read client-side — mirrors the gate in [locale]/layout.tsx (SessionLogger).
const CLERK_CONFIGURED = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

/** Rendered only when Clerk is configured — safe to call `useAuth()` (a `ClerkProvider` wraps the tree). */
function SignOutItem({ label }: { label: string }) {
  const { signOut } = useAuth();
  return <DropdownMenuItem onClick={() => void signOut()}>{label}</DropdownMenuItem>;
}

/** Sidebar footer user menu: Legal (always) + Sign out (only when Clerk is configured). */
export function NavUser() {
  const t = useTranslations("app");
  const label = t("user.account");

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size="lg" aria-label={label}>
              <Avatar size="sm">
                <AvatarFallback>
                  <UserRound className="size-4" aria-hidden="true" />
                </AvatarFallback>
              </Avatar>
              <span>{label}</span>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-40">
            <DropdownMenuItem asChild>
              <Link href="/legal">{t("user.legal")}</Link>
            </DropdownMenuItem>
            {CLERK_CONFIGURED ? <SignOutItem label={t("user.signOut")} /> : null}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
```

- [ ] **Step 4: `AppSidebar.tsx`** (flat nav, no groups)

```tsx
"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@indiecrafts/packages-web-ui/web/sidebar";
import { NAV, activeKey } from "@/user-interface/lib/nav";
import { NavUser } from "./NavUser";

/** The app's left rail — brand link, flat `NAV`, and the user menu. Icon-collapsible. */
export function AppSidebar() {
  const t = useTranslations("app");
  const current = activeKey(usePathname());

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="lg">
              <Link href="/">
                <span className="text-base font-semibold">{t("title")}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <nav aria-label={t("nav.label")}>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {NAV.map((item) => (
                  <SidebarMenuItem key={item.key}>
                    <SidebarMenuButton asChild isActive={current === item.key}>
                      <Link href={item.href}>
                        <item.icon aria-hidden="true" />
                        <span>{t(`nav.${item.key}`)}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </nav>
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
```

- [ ] **Step 5: `AppHeader.tsx`** (trigger + right-aligned locale/theme, no breadcrumbs)

```tsx
import { getTranslations } from "next-intl/server";
import { SidebarTrigger } from "@indiecrafts/packages-web-ui/web/sidebar";
import { Separator } from "@indiecrafts/packages-web-ui/web/separator";
import { ThemeToggle } from "./ThemeToggle";
import { LocaleSwitcher } from "./LocaleSwitcher";

/** Sticky app header: sidebar toggle, then locale + theme toggles pushed right. */
export async function AppHeader() {
  const t = await getTranslations("app");

  return (
    <header className="bg-background sticky top-0 z-10 flex h-14 items-center gap-2 border-b px-4">
      <SidebarTrigger />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <div className="ml-auto flex items-center gap-1">
        <LocaleSwitcher label={t("locale.label")} />
        <ThemeToggle
          label={{ toggle: t("theme.toggle"), light: t("theme.light"), dark: t("theme.dark") }}
        />
      </div>
    </header>
  );
}
```

- [ ] **Step 6: `AppShell.tsx`** (admin's, verbatim)

```tsx
import type { ReactNode } from "react";
import { SidebarInset, SidebarProvider } from "@indiecrafts/packages-web-ui/web/sidebar";
import { Toaster } from "@indiecrafts/packages-web-ui/web/sonner";
import { AppSidebar } from "./AppSidebar";
import { AppHeader } from "./AppHeader";

/** The app shell every `(app)` page renders inside: sidebar + sticky header. */
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset id="main" tabIndex={-1}>
        <AppHeader />
        {children}
      </SidebarInset>
      <Toaster />
    </SidebarProvider>
  );
}
```

- [ ] **Step 7: `(app)/layout.tsx`** (renders the shell; no auth gate — the home is public, the account page self-gates)

`code/projects/web/surfaces/app/src/app/[locale]/(app)/layout.tsx`:
```tsx
import type { ReactNode } from "react";
import { AppShell } from "@/user-interface/layout/AppShell";

/** Every page in the `(app)` group renders inside the sidebar shell. `sign-in` stays outside. */
export default function AppGroupLayout({ children }: { children: ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
```

- [ ] **Step 8: Typecheck**

Run: `pnpm --filter @indiecrafts/web-surfaces-app tsc`
Expected: clean. (The `(app)` group has no pages yet — Task 6 moves them in. The layout compiles regardless.)

- [ ] **Step 9: Commit**

```bash
git add "code/projects/web/surfaces/app/src/user-interface/layout" "code/projects/web/surfaces/app/src/app/[locale]/(app)/layout.tsx"
git commit -m "feat(app): shadcn sidebar shell + (app) route group"
```

---

### Task 6: Move + restyle the three pages

Move `home`, `account`, `legal` into `(app)/` and restyle with `PageHeader` + `Card`. Each drops its own `<main>` (the shell's `SidebarInset` owns the landmark) and becomes a `<div className="p-4 md:p-6">`. **Logic unchanged** — same gating, same data, same links.

**Files:**
- Move + modify: `src/app/[locale]/page.tsx` → `src/app/[locale]/(app)/page.tsx`
- Move + modify: `src/app/[locale]/account/page.tsx` → `src/app/[locale]/(app)/account/page.tsx`
- Move + modify: `src/app/[locale]/legal/page.tsx` → `src/app/[locale]/(app)/legal/page.tsx`

**Interfaces:**
- Consumes: `PageHeader` (Task 5), `app.*` + `account.title/description` messages (Task 2).

- [ ] **Step 1: Move the files with `git mv`**

```bash
cd /Users/home/Code/indiecrafts-template/code/projects/web/surfaces/app/src/app/[locale]
git mv page.tsx "(app)/page.tsx"
git mv account "(app)/account"
git mv legal "(app)/legal"
```
(Run from repo root by prefixing full paths if preferred; the group dir `(app)` already exists from Task 5.)

- [ ] **Step 2: Restyle `(app)/page.tsx`** (home — PageHeader + quick-link cards + share)

```tsx
import { setRequestLocale, getTranslations } from "next-intl/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@indiecrafts/packages-web-ui/web/card";
import { Button } from "@indiecrafts/packages-web-ui/web/button";
import { ShareButtons } from "@indiecrafts/packages-web-ui-components/web/layout/ShareButtons";
import { Link } from "@/i18n/routing";
import { PageHeader } from "@/user-interface/layout/PageHeader";

// App home. Server component; `setRequestLocale` keeps it statically rendered.
export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("app");
  const tShare = await getTranslations("share");

  return (
    <div className="p-4 md:p-6">
      <PageHeader title={t("title")} description={t("subtitle")} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t("nav.account")}</CardTitle>
            <CardDescription>{t("home.accountDesc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline">
              <Link href="/account">{t("nav.account")}</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t("user.legal")}</CardTitle>
            <CardDescription>{t("home.legalDesc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline">
              <Link href="/legal">{t("user.legal")}</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
      <Card className="mt-4">
        <CardContent className="flex flex-wrap items-center gap-2">
          {/* `url` omitted → ShareButtons resolves the current page URL on the client. */}
          <ShareButtons
            title={t("title")}
            labels={{
              label: tShare("label"),
              x: tShare("x"),
              linkedin: tShare("linkedin"),
              facebook: tShare("facebook"),
              copy: tShare("copy"),
              copied: tShare("copied"),
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
```

- [ ] **Step 3: Restyle `(app)/account/page.tsx`** (keep all gating; wrap in shell layout)

Keep the entire existing file **unchanged above the `return`** (the `notFound()` gates, the `copy`/`exportCopy` resolution). Add a `getTranslations("account")` for the header, add the imports, and replace only the `return (…)`:

Add imports at the top:
```tsx
import { Card, CardContent } from "@indiecrafts/packages-web-ui/web/card";
import { PageHeader } from "@/user-interface/layout/PageHeader";
```
Add after the existing `et`/`exportCopy` block, before `return`:
```tsx
  const th = await getTranslations({ locale, namespace: "account" });
```
Replace the `return (…)` with:
```tsx
  return (
    <div className="p-4 md:p-6">
      <PageHeader title={th("title")} description={th("description")} />
      <Card>
        <CardContent>
          <AccountDeletePanel copy={copy} exportCopy={exportCopy} showExport={features.exportAccount} />
        </CardContent>
      </Card>
    </div>
  );
```

- [ ] **Step 4: Restyle `(app)/legal/page.tsx`** (keep the cross-origin `<a>` list; wrap it)

```tsx
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Card, CardContent } from "@indiecrafts/packages-web-ui/web/card";
import { site, type Locale } from "@/config";
import { LEGAL_PAGE_KEYS, legalUrl } from "@indiecrafts/packages-shared-compliance/shared";
import { PageHeader } from "@/user-interface/layout/PageHeader";

// Legal link-out — the canonical legal pages live on the marketing website; this lists
// them and opens each there (`legalUrl(site.websiteUrl, …)`, cross-origin). No content
// re-hosting: a plain `<a>` (not the typed `Link`) because the target is another origin.
export default async function LegalPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("legal");

  return (
    <div className="p-4 md:p-6">
      <PageHeader title={t("heading")} />
      <Card>
        <CardContent>
          <ul className="flex flex-col gap-2">
            {LEGAL_PAGE_KEYS.map((key) => (
              <li key={key}>
                <a
                  href={legalUrl(site.websiteUrl, key, locale as Locale)}
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  {t(key)}
                </a>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
```

- [ ] **Step 5: Typecheck + lint + parity**

Run: `pnpm --filter @indiecrafts/web-surfaces-app tsc && pnpm --filter @indiecrafts/web-surfaces-app lint && pnpm --filter @indiecrafts/web-surfaces-app test`
Expected: all clean/green.

- [ ] **Step 6: Eyeball the shell** (dev CSP blocks hydration — use report-only or a prod build)

Quick path (report-only lets React dev hydrate):
```bash
CSP_MODE=report-only pnpm --filter @indiecrafts/web-surfaces-app exec next dev --turbopack -p 3001
```
Open `http://localhost:3001/` — confirm: sidebar renders + collapses, nav highlights the active item, theme toggle flips light/dark with no flash on reload, user menu shows Legal (+ Sign out if Clerk configured), locale switcher swaps `/` ↔ `/fr`. Home shows the two quick-link cards + share; account + legal render inside the shell.

- [ ] **Step 7: Commit**

```bash
git add "code/projects/web/surfaces/app/src/app/[locale]"
git commit -m "feat(app): move pages into (app) shell + shadcn restyle"
```

---

### Task 7: Admin visual-polish pass

An in-place polish pass across admin's already-shadcn pages. **Polish, not restructure** — no nav/route/data changes. Invoke the `visual-polish` skill (and `design-critique` if a page needs a fuller lens) and apply the checklist below with surgical diffs.

**Files (polish only):**
- `code/projects/web/surfaces/admin/src/app/[locale]/(dashboard)/page.tsx` (Overview)
- `…/(dashboard)/{users,sessions,data-requests,csp,backups,system,settings,security}/page.tsx`
- Shared components: `…/(dashboard)/{admin-role-form,settings-form,sessions-table,backups-table,data-requests-table}.tsx`

**Checklist (apply per file, token-only):**
- **Spacing rhythm:** consistent `Card` padding; normalize the parked in-card margin drift (`mt-6`/`mt-8` → a single scale); consistent gap between `PageHeader` and content.
- **Hierarchy:** heading sizes/weights consistent; secondary text `text-muted-foreground`; clear section separation (`Separator`/spacing, not ad-hoc borders).
- **States:** every data list has a real empty state (a short line, not only "—"); fetched data shows a loading affordance where practical; error fallbacks stay honest (no fake success).
- **Overview dashboard feel:** stat cards get a secondary label/delta line (e.g. muted caption) so the numbers read as a dashboard, not bare figures.
- **Restraint + motion:** subtle hover/focus transitions via existing tokens; remove any one-off color or arbitrary value; no new dependencies.

**Interfaces:** none produced/consumed — presentational only.

- [ ] **Step 1: Invoke the polish skill and read the current pages**

Invoke `visual-polish`. Read each target file before editing; keep changes within the checklist.

- [ ] **Step 2: Apply the polish** across the pages + shared components, one file at a time.

- [ ] **Step 3: Verify — typecheck, lint, tokens**

Run: `pnpm --filter @indiecrafts/web-surfaces-admin tsc && pnpm --filter @indiecrafts/web-surfaces-admin lint`
Expected: clean.
Token check: `grep -rEn "#[0-9a-fA-F]{3,8}\b|rgb\(|hsl\(" code/projects/web/surfaces/admin/src/app/"[locale]"/"(dashboard)"` → no color literals in the touched files (token classes only).

- [ ] **Step 4: Eyeball on the admin prod build** (dev CSP won't hydrate)

The admin prod server is already running on `http://localhost:3002` from earlier; if not, rebuild:
```bash
pnpm --filter @indiecrafts/web-surfaces-admin build && pnpm --filter @indiecrafts/web-surfaces-admin exec next start -p 3002
```
Walk every page: spacing/hierarchy consistent, empty/loading states present, Overview reads as a dashboard, light + dark both clean.

- [ ] **Step 5: Commit**

```bash
git add "code/projects/web/surfaces/admin/src/app/[locale]/(dashboard)"
git commit -m "style(admin): visual-polish pass — rhythm, hierarchy, states"
```

---

### Task 8: Docs, Storybook-clean, changelogs, final verify

Update the app brief/README (scaffold → shelled), log both changelogs, refresh any product-doc drift, and prove Storybook + tags stay clean.

**Files:**
- Modify: `code/projects/web/surfaces/app/.claude/CLAUDE.md` (bare-scaffold → shadcn sidebar shell wired)
- Modify: `code/projects/web/surfaces/app/README.md`
- Modify: `code/projects/web/surfaces/app/CHANGELOG.md`
- Modify: `code/projects/web/surfaces/admin/CHANGELOG.md`
- Modify (if drift): `code/docs/apps/web/**` page(s) describing the app surface

- [ ] **Step 1: Update the app brief** — in `app/.claude/CLAUDE.md`, change the "minimal Next.js surface… Build real pages on top" framing to describe the shipped shell: `src/user-interface/layout/` (`AppShell` → `AppSidebar` + `SidebarInset`/`AppHeader`, flat nav from `src/user-interface/lib/nav.ts`, no-flash `ThemeToggle`, `LocaleSwitcher`, `NavUser`), the `(app)` route group, and the `PageHeader` + `Card` page treatment. Note: **app-owned components, no Storybook.**

- [ ] **Step 2: Update `app/README.md`** to match (shell + the three shelled pages + sign-in outside the group).

- [ ] **Step 3: Changelogs** — add an entry to `app/CHANGELOG.md` (shadcn sidebar shell + page restyle + vitest wired) and `admin/CHANGELOG.md` (visual-polish pass). One entry each, at its home altitude.

- [ ] **Step 4: Product-doc drift** — grep and fix any doc that calls app a chrome-less scaffold:
```bash
grep -rln "scaffold\|no header\|no nav" code/docs/apps/web 2>/dev/null
```
Update matches that describe the app surface; leave unrelated ones.

- [ ] **Step 5: Storybook clean — prove no admin/app stories**

```bash
find code/projects/web/surfaces/app code/projects/web/surfaces/admin -name "*.stories.*"
```
Expected: no output. (If any appear, they violate the constraint — remove them.)
Optional build smoke: `pnpm --filter @indiecrafts/web-tools-storybook build` → succeeds.

- [ ] **Step 6: Tags clean + whole-repo verify**

```bash
pnpm tags:check
pnpm verify
```
Expected: `tags:check` green (no off-list/new parked tags); `pnpm verify` green (fans out to every app — app + admin `tsc`, website full, workers, etc.).

- [ ] **Step 7: Commit**

```bash
git add code/projects/web/surfaces/app/.claude/CLAUDE.md code/projects/web/surfaces/app/README.md code/projects/web/surfaces/app/CHANGELOG.md code/projects/web/surfaces/admin/CHANGELOG.md code/docs
git commit -m "docs(app,admin): shell + polish briefs, changelogs, doc drift"
```

---

## Self-Review

**Spec coverage:** app shell (Tasks 4–5) · app nav own-links (Task 3) · restyle-only pages (Task 6) · app i18n (Task 2) · shared tokens enforced (Global Constraints + Task 7 grep) · admin visual-polish (Task 7) · Storybook clean (Task 8 §5) · docs clean (Task 8) · typed routing / single-main / no-inline-strings (Global Constraints, honored per task). Test infra gap (app had no runner) closed by Task 1. All spec sections map to a task.

**Type consistency:** `NavItem`/`NAV`/`activeKey` (Task 3) consumed by `AppSidebar` (Task 5). `THEME_SCRIPT`/`ThemeToggle` (Task 4) consumed by layout + `AppHeader` (Tasks 4/5). `PageHeader({title,description,actions})` (Task 5) consumed by all three pages (Task 6). Message keys added in Task 2 match every `t("…")` call in Tasks 5–6.

**No placeholders:** every code step carries real content; the only "read then apply" step is Task 7 (a polish pass, where the checklist + `visual-polish` skill are the how).

## Execution notes

- Branch: `feat/admin-app-shadcn-alignment` (off `main`); merge on green.
- Dev servers from earlier (website :3000, app :3001, admin :3002) are handy for eyeballing; app/admin need report-only CSP or a prod build to hydrate.
- Presentational UI is test-exempt per the repo's standing ruling; the logic that has tests (nav `activeKey`, message parity) is covered in Tasks 1–3.
