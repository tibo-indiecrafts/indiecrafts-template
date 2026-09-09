# Unified account modal — per-surface presentation & browser hand-off (Revision 2)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans (or subagent-driven-development) to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Finish the account experience per surface: **website** = modal + `/account` page (built), **app** = embedded `/account` page, **hybrid + mobile** = a direct link that opens the canonical web account (`accountUrl`) in a browser. Admin stays sign-out-only.

**Architecture:** The shared Clerk-free tab bodies + the `@clerk/nextjs` `<AccountButton>`/`<AccountPage>` (website + app) are already built. This revision **removes** the native/clerk-react account UI on hybrid + mobile and replaces it with a browser hand-off to `accountUrl`, adds `accountUrl` config, and switches the app trigger from a modal to page navigation.

**Tech Stack:** Next 16 / React 19 / TS strict · `@clerk/nextjs` · Electron (electron-vite, `@clerk/clerk-react`) · Expo SDK 52 (`@clerk/clerk-expo`, `expo-web-browser@~14`) · react-intl (hybrid/mobile) · next-intl (web).

**Spec:** `docs/superpowers/specs/2026-09-09-unified-account-modal-design.md` (§3.5 is authoritative).

## Global Constraints

- **`accountUrl` default = `${websiteUrl}/account`**, with an env override (`EXPO_PUBLIC_ACCOUNT_URL` / `VITE_ACCOUNT_URL`) so a project that ships the `app` surface points it at `app.<domain>/account`. Never hard-code the URL.
- **Guard on a missing target** — when `accountUrl` is undefined (no `websiteUrl`), the "Manage account" affordance is disabled/hidden (mirror hybrid `LegalLinks`'s `disabled={!websiteUrl}`).
- **Consent stays native** on hybrid + mobile — do not touch their consent controls.
- **Mobile keeps a native "Delete account"** entry (App Store 5.1.1(v)); the existing native `DeleteAccountSection` satisfies it — keep it.
- **No new server contracts**; the web account (`accountUrl`) already serves export/delete.
- **Strings in messages/**, typed everything, per each surface's rules.

## Phase 1 (already built — do not redo)

Shared core (`AccountConsentTab`/`AccountDataTab` + `AccountAuth`), `@clerk/nextjs` `<AccountButton>`/`<AccountPage>`, website wiring (modal + `/account`), app `/account` embedded page, consent-log middleware fix. Commits on `feat/unified-account-modal` through `bae16c8a`. **Website needs no change** — it is already modal + page.

---

### Task R1: `accountUrl` config (hybrid + mobile)

**Files:**

- Modify `code/projects/hybrid/surfaces/main/src/config/index.ts`
- Modify `code/projects/mobile/surfaces/main/config/index.ts`

**Interfaces — Produces:** `accountUrl: string | undefined` from both configs.

- [ ] **Step 1** — Hybrid: after the `websiteUrl` export (line ~37), add:

```ts
/**
 * Canonical web account entry point the desktop shell hands off to (Manage account).
 * Default: the website's `/account`. A project that ships the `app` surface sets
 * `VITE_ACCOUNT_URL` to `https://app.<domain>/account` (the authenticated product surface).
 */
export const accountUrl =
  import.meta.env.VITE_ACCOUNT_URL ??
  (websiteUrl ? `${websiteUrl}/account` : undefined);
```

- [ ] **Step 2** — Mobile: after the `websiteUrl` export (line ~40), add the same with Expo env:

```ts
/**
 * Canonical web account entry point the app hands off to (Manage account / delete).
 * Default: the website's `/account`; override with `EXPO_PUBLIC_ACCOUNT_URL` (e.g. the
 * `app.<domain>/account` product surface).
 */
export const accountUrl =
  process.env.EXPO_PUBLIC_ACCOUNT_URL ??
  (websiteUrl ? `${websiteUrl}/account` : undefined);
```

- [ ] **Step 3** — Add `EXPO_PUBLIC_ACCOUNT_URL` / `VITE_ACCOUNT_URL` to each surface's `.env.example` (documented, optional).
- [ ] **Step 4** — `pnpm --filter @indiecrafts/hybrid-surfaces-main tsc` + `pnpm --filter @indiecrafts/mobile-surfaces-main tsc` (mobile uses `npx expo lint` for lint, tsc for types).
- [ ] **Step 5: Commit** — `feat(config): accountUrl for the hybrid + mobile account hand-off`.

---

### Task R2: app — sidebar footer reverts to Legal + Sign out (drop the modal)

The app's account is the **embedded `/account` page**, already reachable from the main sidebar nav (`nav.ts` → `{ key: "account", href: "/account" }`). So the footer `NavUser` no longer needs the modal trigger; it returns to Legal + a hand-rolled sign-out (the Clerk modal previously owned sign-out).

**Files:**

- Modify `code/projects/web/surfaces/app/src/user-interface/layout/NavUser.tsx`
- Modify `code/projects/web/surfaces/app/messages/{en,fr}.json` (re-add `app.user.signOut`)

- [ ] **Step 1** — Re-add `app.user.signOut` to messages (removed in Phase 1): en `"signOut": "Sign out"`, fr `"signOut": "Se déconnecter"` (keep `legal`).
- [ ] **Step 2** — Rewrite `NavUser.tsx`: drop the `AccountControl` import; render a footer menu with **Sign out** (Clerk `useAuth().signOut`, gated on `CLERK_CONFIGURED`) + the **Legal** link. Mirror the pre-modal shape:

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
import {
  Avatar,
  AvatarFallback,
} from "@indiecrafts/packages-web-ui/web/avatar";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@indiecrafts/packages-web-ui/web/sidebar";

const CLERK_CONFIGURED = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

function SignOutItem({ label }: { label: string }) {
  const { signOut } = useAuth();
  return (
    <DropdownMenuItem onClick={() => void signOut()}>{label}</DropdownMenuItem>
  );
}

/** Sidebar footer: Legal (always) + Sign out (when Clerk is configured). Account lives on the
 *  embedded `/account` page, reached from the main sidebar nav. */
export function NavUser() {
  const t = useTranslations("app");
  const label = t("user.legal");
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
            {CLERK_CONFIGURED ? (
              <SignOutItem label={t("user.signOut")} />
            ) : null}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
```

- [ ] **Step 3** — `pnpm --filter @indiecrafts/web-surfaces-app tsc` + `test`.
- [ ] **Step 4: Commit** — `feat(app): account is the embedded /account page; footer reverts to Legal + Sign out`.

---

### Task R3: hybrid — "Manage account" link-out (remove the clerk-react modal)

**Files:**

- Delete `code/projects/hybrid/surfaces/main/src/renderer/src/account-button.tsx`
- Modify `code/projects/hybrid/surfaces/main/src/renderer/src/auth.tsx` (`SignedInView`)
- Modify `code/projects/hybrid/surfaces/main/src/renderer/messages/{en,fr}.json` (re-add `auth.signOut`, add `account.manage`)

- [ ] **Step 1** — Messages: re-add `auth.signOut` (removed in Phase 1) and add `account.manage`: en `"manage": "Manage account"`, fr `"manage": "Gérer le compte"` under `account`.
- [ ] **Step 2** — Rewrite `SignedInView` in `auth.tsx`: drop the `AccountButton` import; render the signed-in text + a **"Manage account"** button (opens `accountUrl` in the OS browser via the existing `open-external` IPC, disabled when `accountUrl` is undefined) + a **Sign out** button:

```tsx
import { accountUrl } from "../../config";
// ...
function SignedInView() {
  const t = useIntl();
  const { signOut } = useAuth();
  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-sm text-muted-foreground">
        {t.formatMessage({ id: "auth.signedIn" })}
      </p>
      <Button
        variant="outline"
        disabled={!accountUrl}
        onClick={() =>
          accountUrl && void window.desktop.openExternal(accountUrl)
        }
      >
        {t.formatMessage({ id: "account.manage" })}
      </Button>
      <Button variant="ghost" onClick={() => void signOut()}>
        {t.formatMessage({ id: "auth.signOut" })}
      </Button>
    </div>
  );
}
```

- [ ] **Step 3** — Delete `account-button.tsx` (`git rm`). Confirm no other importer (`grep -rn account-button code/projects/hybrid`).
- [ ] **Step 4** — `pnpm --filter @indiecrafts/hybrid-surfaces-main tsc` + `test`.
- [ ] **Step 5: Commit** — `feat(hybrid): Manage-account link-out to the web account (remove clerk-react modal)`.

---

### Task R4: mobile — "Manage account" link-out (keep native consent + delete)

Mobile hands off profile/security/export to the web account via an **in-app browser tab** (shares cookies), keeps its **native consent** panel, and keeps the **native `DeleteAccountSection`** (App Store 5.1.1(v)). The native `ExportSection` is removed (export lives on the web account).

**Files:**

- Modify `code/projects/mobile/surfaces/main/app/account.tsx`
- Modify `code/projects/mobile/surfaces/main/messages/{en,fr}.json` (add `account.manage`)

- [ ] **Step 1** — Messages: add `account.manage` (en `"manage": "Manage account"`, fr `"manage": "Gérer le compte"`).
- [ ] **Step 2** — In `account.tsx`: import `* as WebBrowser from "expo-web-browser"` + `accountUrl` from `@/config`. Remove the `ExportSection` import + render. Add a **"Manage account"** `Button` (disabled when `!accountUrl`) that calls `WebBrowser.openBrowserAsync(accountUrl)` (SFSafariViewController / Custom Tabs). Keep the `ConsentPreferences` + save and the native `DeleteAccountSection` exactly as they are:

```tsx
import * as WebBrowser from "expo-web-browser";
import { accountUrl } from "@/config";
// ...in the Card, replacing the ExportSection block:
{
  accountUrl ? (
    <Button
      label={t.formatMessage({ id: "account.manage" })}
      onPress={() => void WebBrowser.openBrowserAsync(accountUrl)}
    />
  ) : null;
}
// keep <DeleteAccountSection .../> below (native, App-Store-compliant)
```

- [ ] **Step 3** — `pnpm --filter @indiecrafts/mobile-surfaces-main tsc`; `npx expo lint` in the mobile dir (per its rules). Manual (if a simulator is handy): the button opens the in-app browser to `accountUrl`; delete + consent still native.
- [ ] **Step 4: Commit** — `feat(mobile): Manage-account in-app browser hand-off; keep native consent + delete`.

---

### Task R5: docs, changelogs, verify

**Files:** `code/docs/apps/web/config/feature-flags.md`; `code/projects/web/surfaces/app/CHANGELOG.md`; `code/projects/hybrid/surfaces/main/CHANGELOG.md`; `code/projects/mobile/surfaces/main/CHANGELOG.md`; the spec `Status`.

- [ ] **Step 1** — feature-flags doc: update the account paragraph — website = modal + `/account` page; app = embedded `/account`; hybrid + mobile hand off to `accountUrl` (default `${websiteUrl}/account`, override for the app surface).
- [ ] **Step 2** — Changelogs (app/hybrid/mobile): a "Changed" entry per surface (plain-language why): app footer reverts to Legal + Sign out (account is the embedded page); hybrid/mobile now link out to the web account; note `accountUrl`.
- [ ] **Step 3** — Spec `Status:` → "Implemented (Revision 2) — website/app/hybrid/mobile wired; account hand-off via `accountUrl`."
- [ ] **Step 4** — Grep for dead refs to `account-button` / removed imports; `pnpm check:tags` + `check:tasks` + `check:secret-leak` + `check:typed-routing` green; the changed surfaces' tsc/test green.
- [ ] **Step 5: Commit** — `docs(account): per-surface presentation + web hand-off`.

---

## Self-review

- **Spec coverage:** website (Phase 1, no change) · app embedded + footer (R2) · hybrid link-out (R3) · mobile link-out + native delete (R4) · `accountUrl` config (R1) · admin (untouched) · docs (R5). ✓
- **Type consistency:** `accountUrl: string | undefined` used identically in R1/R3/R4 with the `!accountUrl` guard. ✓
- **No placeholders:** every step has concrete code or an exact command. ✓
- **Reversions acknowledged:** R2 re-adds `app.user.signOut`, R3 re-adds `auth.signOut` (both removed in Phase 1 when the modal owned sign-out) — intentional, since the modal no longer does.
