# Consent-confirmation toast (web) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax.

**Goal:** After an explicit cookie-consent or legal-reacceptance choice on `website`/`app`/`hybrid`, show an identical success toast ("Preferences saved · change in profile settings · Manage"), and give users a real place to change consent later.

**Architecture:** The shared `ConsentBanner`/`LegalReacceptancePrompt` stay toast-agnostic (they also serve React Native). A one-line `toast` export + a thin `showConsentSavedToast` helper land in `@indiecrafts/packages-web-ui`; each surface calls it from the consent/legal callback it already owns. A `<Toaster>` sits at `[locale]/layout` level (with the banner). A "Cookie preferences" settings control on `/account` makes "change in settings" real — website reuses its `ManagePreferencesButton`/dialog; app+hybrid get a small wrapper around the shared `ConsentPreferences` toggle list.

**Tech Stack:** Next.js 16 · React 19 · TS · Tailwind v4 · shadcn/ui · sonner · next-intl · Electron (hybrid renderer).

**Spec:** `docs/superpowers/specs/2026-09-01-consent-confirmation-toast-web-design.md`

**Base branch note:** This builds on the held `feat/admin-app-shadcn-alignment` branch (app's `<Toaster>` + shelled `/account` come from it). At execution, base off that branch or off `main` after it merges — decide at SDD setup. Two tasks below edit files that branch introduced (`app` AppShell / `[locale]/layout`).

## Global Constraints

- **NEVER add toast to the shared `ConsentBanner`/`LegalReacceptancePrompt`** (`@indiecrafts/packages-shared-compliance`) — its `/native` fork has no sonner. Toast fires in surface callbacks + the web-ui helper only.
- **Explicit choices only.** Fire on banner Accept/Reject/Save + legal Accept. NEVER on the geo auto-seed (`source === "auto"` on website; the `useEffect` seed on app/hybrid).
- Config-first; typed `@/i18n/routing` for the Manage navigation (never `next/link`); user-facing strings in `messages/<locale>.json`, en/fr parity (parity tests guard it).
- No cross-app imports; compose the web-ui helper + compliance components. No edits to a surface's `src/user-interface/ui/**` (shadcn CLI). Token-only styling.
- One `<Toaster>` per surface tree (a second renders every toast twice).
- Package names: web-ui = `@indiecrafts/packages-web-ui`, shared-compliance = `@indiecrafts/packages-shared-compliance`, web-compliance = `@indiecrafts/packages-web-compliance`.

---

## Phase 1 — The toast (plumbing + fire points)

### Task 1: Export `toast` + the shared helper

**Files:**
- Modify: `code/packages/web/ui/src/web/sonner.tsx`
- Create: `code/packages/web/ui/src/web/consent-toast.ts`
- Test: `code/packages/web/ui/src/web/consent-toast.test.ts`

**Interfaces:**
- Produces: `toast` (re-export) and `showConsentSavedToast({ saved, description, manage, onManage })` from `@indiecrafts/packages-web-ui/web/consent-toast`.

- [ ] **Step 1: Export `toast`** — append to `code/packages/web/ui/src/web/sonner.tsx` (after the existing `export { Toaster };`):
```ts
export { toast } from "sonner";
```

- [ ] **Step 2: Write the failing test** `consent-toast.test.ts`:
```ts
import { describe, it, expect, vi } from "vitest";

const success = vi.fn();
vi.mock("sonner", () => ({ toast: { success } }));

import { showConsentSavedToast } from "./consent-toast";

describe("showConsentSavedToast", () => {
  it("fires a success toast with a Manage action that calls onManage", () => {
    const onManage = vi.fn();
    showConsentSavedToast({ saved: "Saved", description: "Change in settings", manage: "Manage", onManage });
    expect(success).toHaveBeenCalledTimes(1);
    const [msg, opts] = success.mock.calls[0];
    expect(msg).toBe("Saved");
    expect(opts.description).toBe("Change in settings");
    expect(opts.action.label).toBe("Manage");
    opts.action.onClick();
    expect(onManage).toHaveBeenCalledTimes(1);
  });
});
```

- [ ] **Step 3: Run — verify it fails** (`pnpm --filter @indiecrafts/packages-web-ui test -- consent-toast`) → FAIL (module missing).

- [ ] **Step 4: Implement** `consent-toast.ts`:
```ts
import { toast } from "sonner";

/** The one consent/legal "choice saved" toast shape — identical on every web surface.
 *  Copy is injected (each surface resolves its own i18n); `onManage` opens that
 *  surface's cookie-preferences control. */
export function showConsentSavedToast({
  saved,
  description,
  manage,
  onManage,
}: {
  saved: string;
  description: string;
  manage: string;
  onManage: () => void;
}): void {
  toast.success(saved, { description, action: { label: manage, onClick: onManage } });
}
```

- [ ] **Step 5: Run — verify pass.** Then `pnpm --filter @indiecrafts/packages-web-ui tsc`.

- [ ] **Step 6: Commit** — `feat(web-ui): export toast + showConsentSavedToast helper`.

---

### Task 2: app — Toaster at layout level + fire the toast

**Files:**
- Modify: `code/projects/web/surfaces/app/src/app/[locale]/layout.tsx` (mount `<Toaster>`)
- Modify: `code/projects/web/surfaces/app/src/user-interface/layout/AppShell.tsx` (remove its `<Toaster>` — moved up, avoids double)
- Modify: `code/projects/web/surfaces/app/src/user-interface/ShellOverlays.tsx` (fire the toast)
- Modify: `code/projects/web/surfaces/app/messages/{en,fr}.json`

**Interfaces:**
- Consumes: `showConsentSavedToast` (Task 1), `Toaster` + `useRouter` from `@/i18n/routing`, `toast` copy from `consent.*`/`legal.reaccept.*`.

- [ ] **Step 1: Relocate the Toaster.** Remove `<Toaster />` + its import from `AppShell.tsx`. Add to `[locale]/layout.tsx`: `import { Toaster } from "@indiecrafts/packages-web-ui/web/sonner";` and render `<Toaster />` as the last child inside `<NextIntlClientProvider>` (sibling of `ShellOverlays`). This covers every app page (shelled + sign-in) with exactly one Toaster.

- [ ] **Step 2: Add i18n keys** to `app/messages/en.json` under `consent`:
```json
    "saved": "Preferences saved",
    "savedBody": "You can change these anytime in your profile settings.",
    "manage": "Manage"
```
and under `legal.reaccept` add `"saved": "Thanks — your acceptance is saved."`. Mirror in `fr.json`:
`consent.saved`="Préférences enregistrées", `consent.savedBody`="Vous pouvez les modifier à tout moment dans les paramètres de votre profil.", `consent.manage`="Gérer", `legal.reaccept.saved`="Merci — votre acceptation est enregistrée." (Parity test guards the set.)

- [ ] **Step 3: Fire the toast in `ShellOverlays.tsx`.** In `ConsentGate`, wrap the `persist` helper so every explicit path toasts; in `LegalGate`, toast after `legalStore.save`. Concretely: add `const router = useRouter();` (from `@/i18n/routing`), `const tc = useTranslations("consent");`, and after each `consentStore.save(...)` inside `persist` (the accept/reject/save button handlers — NOT the `useEffect` auto-seed), call:
```ts
showConsentSavedToast({
  saved: tc("saved"), description: tc("savedBody"), manage: tc("manage"),
  onManage: () => router.push("/account"),
});
```
In `LegalGate`'s `onAccept` (after `legalStore.save`), call the same with `t("reaccept.saved")` for `saved` (namespace `legal`). **Do NOT** add the toast to the `useEffect` seed in `ConsentGate` (opt-out/none silent path).

- [ ] **Step 4: Verify** — `pnpm --filter @indiecrafts/web-surfaces-app tsc && pnpm --filter @indiecrafts/web-surfaces-app test` (parity + nav). Eyeball via `CSP_MODE=report-only … next dev`: accept cookies → toast appears with Manage; Manage → `/account`; reload with no banner shown → no toast (record persisted, seed silent).

- [ ] **Step 5: Commit** — `feat(app): consent/legal confirmation toast`.

---

### Task 3: website — Toaster + fire the toast via `applyConsent`

**Files:**
- Modify: `code/projects/web/surfaces/website/src/app/[locale]/layout.tsx` (mount `<Toaster>`)
- Modify: `code/packages/web/compliance/src/consent/consent-store.ts` (`applyConsent` fires the toast, gated `source !== "auto"`)
- Modify: the website legal-reacceptance accept path (`packages/web/compliance/src/reacceptance/*` or its website mount)
- Modify: `code/projects/web/surfaces/website/messages/{en,fr}.json`

**Interfaces:**
- Consumes: `showConsentSavedToast` (Task 1). Note the website namespace is `cookies.*` (not `consent.*`).

- [ ] **Step 1: Mount `<Toaster>`** in website `[locale]/layout.tsx` (co-located with `<CookieBanner>`), one instance, last child of the provider tree.

- [ ] **Step 2: i18n** — add to website `messages/en.json` under `cookies`: `"saved": "Preferences saved"`, `"savedBody": "You can change these anytime in your profile settings."` (reuse the existing `cookies.manage` = "Manage cookie preferences"). Mirror in `fr.json`. Add a legal `saved` line under the website legal namespace if legal toasts.

- [ ] **Step 3: Fire on consent.** `applyConsent` (`consent-store.ts:112`) can't import i18n or `@/i18n/routing` (it's a package). So DON'T toast inside `applyConsent`; instead toast at the CALL SITES that pass an explicit `source` — the `CookieBanner` buttons and the `CookiePreferences` Save. Simpler + correct: add an optional callback param, OR (recommended) fire the toast in the website's banner/preferences components after they call `applyConsent`. Pick the recommendation: in `CookieBanner`'s accept/reject/save handlers and `CookiePreferences`'s save handler (`packages/web/compliance/src/consent/`), after `applyConsent(...)`, call `showConsentSavedToast({ saved: t("saved"), description: t("savedBody"), manage: t("manage"), onManage })`. These components already have next-intl (`useTranslations("cookies")`) and can route via `next-intl` navigation — use the website's typed routing for `onManage` → `/account`. The auto-seed path calls `applyConsent(..., "auto")` from a non-UI effect and gets no toast automatically (it isn't in these handlers).

- [ ] **Step 4: Fire on legal re-accept** — in the website legal-reacceptance accept handler, same call with the legal `saved` copy.

- [ ] **Step 5: Verify** — `pnpm --filter @indiecrafts/web-surfaces-website tsc && pnpm --filter @indiecrafts/web-surfaces-website test`. Eyeball on `:3000` dev: banner Accept → toast; the geo auto-seed (simulate opt-out region) shows no toast.

- [ ] **Step 6: Commit** — `feat(website): consent/legal confirmation toast`.

---

### Task 4: hybrid — Toaster + fire the toast

**Files:**
- Modify: `code/projects/hybrid/surfaces/main/src/renderer/src/shell.tsx` (mount `<Toaster>`, fire toast in the `ConsentBannerGate` + legal callbacks)
- Modify: `code/projects/hybrid/surfaces/main/src/renderer/messages/{en,fr}.json`

**Interfaces:** Consumes `showConsentSavedToast` (Task 1). Hybrid renderer is Chromium — sonner works.

- [ ] **Step 1: Read `shell.tsx`** to find the `ConsentBannerGate` persist path + the legal accept + the renderer's routing (hybrid has no `/account` route — find its settings/preferences navigation).

- [ ] **Step 2: Mount `<Toaster>`** once at the renderer root (beside the banner gate).

- [ ] **Step 3: i18n** — add `consent.saved`/`savedBody`/`manage` + `legal.reaccept.saved` to the hybrid renderer `messages/{en,fr}.json` (same values as app, Task 2 Step 2).

- [ ] **Step 4: Fire the toast** in the consent persist paths + legal accept (not the auto-seed). `onManage` → hybrid's settings/preferences location (Phase 2 Task 6 builds it; until then route to the nearest settings screen or the legal links view — pin the exact target when reading shell.tsx).

- [ ] **Step 5: Verify** — `pnpm --filter <hybrid pkg> tsc` (+ test if present). Eyeball in the Electron renderer if runnable.

- [ ] **Step 6: Commit** — `feat(hybrid): consent/legal confirmation toast`.

---

## Phase 2 — The settings control ("change in profile settings")

### Task 5: app — "Cookie preferences" section on `/account`

**Files:**
- Create: `code/projects/web/surfaces/app/src/user-interface/account/CookiePreferencesSection.tsx`
- Modify: `code/projects/web/surfaces/app/src/app/[locale]/(app)/account/page.tsx`
- Modify: `app/messages/{en,fr}.json`

**Interfaces:** Consumes the shared `ConsentPreferences` (toggle list: `categories`/`choices`/`onChange`) + the app `consentStore` + `policyVersion` from `@/config`.

- [ ] **Step 1: Build `CookiePreferencesSection`** (client). It mirrors how `ConsentBanner` uses `ConsentPreferences`: resolve `categories` from `messages.consent.categories.*` + `DEFAULT_CONSENT_CATEGORIES`, seed `choices` from `consentStore.get()` via `useSyncExternalStore`, render `<ConsentPreferences categories choices onChange />` inside a `Card`, and a Save button that writes `consentStore.save({ v: policyVersion, t: Date.now(), choices })` and fires `showConsentSavedToast` (same copy). Add a link (typed) to re-review legal (`/legal`). All copy from `messages` (add `consent.preferencesTitle`, `consent.save` if not present — reuse existing `consent.save`/`consent.categories.*`).

- [ ] **Step 2: Mount it** in the app `/account` page under the existing `AccountDeletePanel` card, as its own `Card` section with a `PageHeader`-style subheading (real `<h2>`).

- [ ] **Step 3: i18n** — add `consent.preferencesTitle` (+ any new keys) to en/fr.

- [ ] **Step 4: Verify** — tsc + test + parity; eyeball: open `/account`, toggle a category, Save → toast, and `consentStore` reflects the change (the banner won't reappear).

- [ ] **Step 5: Commit** — `feat(app): cookie-preferences control on /account`.

---

### Task 6: website — mount `ManagePreferencesButton` on `/account`; hybrid settings control

**Files:**
- Modify: `code/projects/web/surfaces/website/src/app/[locale]/(…)/account/page.tsx`
- Modify: `website/messages/{en,fr}.json` (if a section heading is new)
- Modify: hybrid renderer settings location + its `ConsentPreferences` wrapper (mirror Task 5 for hybrid)

**Interfaces:** Website reuses `ManagePreferencesButton` (opens the already-mounted `CookiePreferences` dialog via `openPreferences()`). Hybrid reuses the Task 5 pattern with the shared `ConsentPreferences`.

- [ ] **Step 1: website** — in `/account`, add a "Cookie preferences" `Card`/section rendering `<ManagePreferencesButton label={t("cookies.manage")} />` (import from `@indiecrafts/packages-web-compliance`). Confirm the `CookiePreferences` dialog is mounted site-wide (with `CookieBanner` in `[locale]/layout`) so the button works from `/account`; if it's only mounted with the banner-visible branch, ensure the dialog mounts regardless.

- [ ] **Step 2: hybrid** — build a hybrid `CookiePreferencesSection` (mirror Task 5, hybrid store) and mount it in the renderer's settings location; point Task 4's `onManage` there.

- [ ] **Step 3: Verify** — website tsc/test; open `/account` → Manage opens the dialog → change + save → toast + persisted. Hybrid: settings screen toggles persist.

- [ ] **Step 4: Commit** — `feat(website,hybrid): cookie-preferences settings entry point`.

---

### Task 7: Docs + changelogs + final verify

**Files:** briefs/changelogs for the touched packages + surfaces; `code/docs` if a consent doc describes the flow.

- [ ] **Step 1:** Changelog entries — `code/packages/CHANGELOG.md` (web-ui `toast`/helper), and each surface's `CHANGELOG.md` (consent toast + settings control). One entry each at home altitude.
- [ ] **Step 2:** Update `code/docs/packages/compliance*.md` / any consent doc to mention the confirmation toast + the `/account` cookie-preferences control.
- [ ] **Step 3:** `pnpm check:tags` green; `pnpm verify` green (all surfaces + packages).
- [ ] **Step 4:** Storybook grep still clean of app/admin stories (unchanged, but confirm).
- [ ] **Step 5: Commit** — `docs(consent): confirmation toast + cookie-preferences control`.

---

## Self-Review

**Spec coverage:** toast plumbing (T1) · app toast (T2) · website toast (T3) · hybrid toast (T4) · settings control app (T5) / website+hybrid (T6) · i18n (in each) · explicit-only gating (T2/T3/T4 steps) · docs (T7). All spec §§ map to a task.

**Type consistency:** `showConsentSavedToast({saved,description,manage,onManage})` defined in T1, consumed identically in T2/T3/T4/T5. `ConsentPreferences({categories,choices,onChange,className})` (read from source) used in T5/T6.

**Known soft spots (resolve at plan execution, flagged not hidden):** (a) website `applyConsent` is a package fn with no i18n/routing — plan fires at the component call sites instead (T3 Step 3), which is the correct hook. (b) hybrid has no `/account` route — T4/T6 pin its settings target when reading `shell.tsx`. (c) confirm the website `CookiePreferences` dialog is mounted site-wide for `ManagePreferencesButton` to work off `/account` (T6 Step 1).

## Execution notes

- Phase 1 delivers the visible toast; Phase 2 makes "change in settings" real (Phase 1's Manage routes to `/account`, which Phase 2 fills — Phase 1 is usable before Phase 2 lands).
- Branch decision (base off the held admin/app branch vs main-after-merge) at SDD setup.
- Presentational UI is test-exempt per the repo ruling; the tested logic is the helper (T1) + message parity.
