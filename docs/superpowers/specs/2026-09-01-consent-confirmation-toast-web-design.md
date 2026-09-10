# Consent-confirmation toast — Spec A (web surfaces)

**Date:** 2026-09-01
**Status:** Approved design, pre-plan
**Scope:** `website` · `app` · `hybrid` (Electron renderer, Chromium). Mobile (Expo/RN) is **Spec B**, deferred — it mirrors this UX with native primitives (no sonner).

## Context

When a user makes an explicit cookie-consent or legal-reacceptance choice, nothing confirms it. We want the common **banner → click → toast** pattern: a short success toast confirming the choice, telling them they can change it in their profile settings, with a **Manage** shortcut. And "change it in settings" must be real — a settings control to re-open and change consent is added.

Findings from the code map that shape this design:

- **The shared banner is toast-agnostic on purpose.** `ConsentBanner` / `LegalReacceptancePrompt` (in `@indiecrafts/packages-shared-compliance`) also serve React Native, so a toast must NOT live inside them. It fires in each surface's own callback.
- **Two consent systems.**
  - `website` uses `@indiecrafts/packages-web-compliance` with a single write funnel `applyConsent(categories, choices, version, source)` (`code/packages/web/compliance/src/consent/consent-store.ts`), `source: "banner" | "preferences" | "auto"`. Banner mounted as `<CookieBanner>` in `website/src/app/[locale]/layout.tsx`. It already has a `CookiePreferences` dialog + `openPreferences()` (via `?cookies=manage` / footer), and an **unmounted** `ManagePreferencesButton`.
  - `app` + `hybrid` use `@indiecrafts/packages-shared-compliance/web` with a per-file `persist` closure in `ShellOverlays` (`app/src/user-interface/ShellOverlays.tsx`) / renderer `shell.tsx` (`hybrid/src/renderer/src/shell.tsx`). Consent `onAccept→persist(acceptAll)`, `onReject→persist(rejectAll)`, `onSave→persist`; legal `onAccept→legalStore.save`.
- **Two plumbing gaps.** `@indiecrafts/packages-web-ui/web/sonner` exports only `Toaster`, not `toast`. `website` and `hybrid` mount no `<Toaster>` (app + admin do).
- **No settings consent control exists** on any surface today (website's `ManagePreferencesButton` is unmounted; the shared `ConsentPreferences` is exported but never used; `/account` pages are delete + export only).
- **Explicit vs silent.** The geo auto-seed (opt-out/none regions) writes consent WITHOUT the banner callbacks (`source: "auto"` on website; a bare `useEffect` save on app/hybrid). The toast must fire on explicit choices ONLY.

## Decisions (confirmed with user)

1. **Both** — build a settings control to change consent AND give the toast a Manage shortcut.
2. **All surfaces** — this spec covers the three web surfaces (sonner); mobile is Spec B (native toast).
3. **Consent + legal** — both cookie-consent choices and legal reacceptance trigger the toast.
4. Web-first / mobile-second split; a thin shared toast helper for identical shape; settings control on `/account`.

## Goals

- An explicit consent or legal choice on any web surface shows an identical success toast: confirmation + "change in profile settings" + a **Manage** action.
- Toast fires on explicit choices only, never the silent auto-seed.
- A real **Cookie preferences** control on `/account` (app + website) lets users re-open and change consent; the toast's Manage action and its "profile settings" line route there.
- Identical toast shape/behaviour across all three web surfaces ("clean on all surfaces").

## Non-goals

- Mobile (Spec B). No RN work here.
- No change to WHAT consent stores or to the geo consent-mode logic — only a confirmation layer + a reopen entry point.
- No new consent categories, no analytics-SDK wiring.

## Design

### 1. Toast UX

On an explicit choice (consent Accept/Reject/Save, or legal re-accept):

> ✓ **Preferences saved.** You can change these anytime in your profile settings. **[Manage]**

- `toast.success(saved, { description, action: { label: manage, onClick: onManage } })` — sonner default auto-dismiss.
- **Manage** action → navigate to the `/account` Cookie-preferences section (typed `@/i18n/routing` on app/website; hybrid uses its renderer router). Consistent across surfaces.
- Fires once per explicit action. Legal re-accept shows the same toast (copy may read "Preferences saved" generically, or a legal-specific line — see §5).

### 2. Plumbing (unblock toasts everywhere)

- **Export `toast`:** add `export { toast } from "sonner";` to `code/packages/web/ui/src/web/sonner.tsx` (sonner is already a dep of `web-ui`). Now `import { toast } from "@indiecrafts/packages-web-ui/web/sonner"` resolves for every web surface.
- **Mount `<Toaster>`:** add it to `website` (`DefaultLayout`) and `hybrid`'s renderer shell. `app` + `admin` already have it.

### 3. Shared toast helper (identical shape)

A thin helper so all three surfaces render the SAME toast:

`code/packages/web/ui/src/web/consent-toast.ts`:

```
showConsentSavedToast({ saved, description, manage, onManage }: {
  saved: string; description: string; manage: string; onManage: () => void;
}): void
```

It calls the local `toast.success(...)` with the Manage action. Copy is passed in (each surface resolves its own i18n). Web-ui is the right home — every web surface already depends on it, and it keeps the compliance packages toast-free (RN-safe).

### 4. Fire points (per surface, small)

- **app / hybrid** — in `ShellOverlays` (`app`) / renderer `shell.tsx` (`hybrid`): after `persist(...)` in the consent `onAccept`/`onReject`/`onSave` paths, and after `legalStore.save(...)` in the legal `onAccept`, call `showConsentSavedToast({ …, onManage: () => router.push("/account") })`. The `useEffect` auto-seed path is NOT touched (stays silent).
- **website** — one call inside `applyConsent(...)` gated `if (source !== "auto")`, plus the legal `onAccept`. `onManage` routes to `/account` (or `openPreferences()` — see §Open decision). Covers banner + the preferences dialog in one place.

### 5. Settings control — "Cookie preferences" on `/account`

A new **Cookie preferences** section on the account page of `app` and `website`:

- **app:** mount the exported `ConsentPreferences` (`@indiecrafts/packages-shared-compliance/web`) wired to the app's `consentStore` — lets the user re-open and change categories; a link to re-review legal (the website legal pages via `legalUrl`).
- **website:** wire the existing-but-unmounted `ManagePreferencesButton` + `CookiePreferences` dialog into `/account` (it already funnels through `applyConsent(source: "preferences")`).
- **hybrid:** mount `ConsentPreferences` in the renderer's settings/account location per its shell conventions (hybrid has no `/account` route like the web apps — follow its existing renderer routing).
- The toast's Manage action + its "profile settings" copy route here.

### 6. i18n

- **app / hybrid** (`consent.*` namespace, `messages/{en,fr}.json` — hybrid renderer + app): add `consent.saved`, `consent.savedBody` (the "change in settings" line), `consent.manage`, and `consent.preferencesTitle` (settings section). Reuse `legal.reaccept.*`; add `legal.reaccept.saved` if legal copy differs.
- **website** (`cookies.*` namespace): add `cookies.saved`, `cookies.savedBody`; reuse the existing `cookies.manage`. en/fr parity (guarded by each surface's messages parity test).
- No inline strings.

## Constraints / NEVERs (honored)

- Toast lives in surface callbacks + a web-ui helper — NEVER inside the shared `ConsentBanner`/`LegalReacceptancePrompt` (keeps `@indiecrafts/packages-shared-compliance` RN-safe; its `/native` entry must not import sonner).
- Config-first; typed `@/i18n/routing` for the Manage navigation on web apps; strings in `messages/`.
- No cross-app imports — surfaces compose the web-ui helper + the compliance components, never reach into a sibling app.
- Toast fires on explicit choices only (`source !== "auto"` / banner+legal callbacks), never the auto-seed.
- Token-only styling; no edits to a surface's `src/user-interface/ui/**` (shadcn CLI).

## File-level change map

**Shared packages:**

- `code/packages/web/ui/src/web/sonner.tsx` — add `export { toast } from "sonner"`.
- `code/packages/web/ui/src/web/consent-toast.ts` — new `showConsentSavedToast` helper.

**website:**

- `DefaultLayout` — mount `<Toaster>`.
- `packages/web/compliance/.../consent-store.ts` `applyConsent` + the website legal callback — fire the toast (gated `source !== "auto"`).
- `/account` page — mount `ManagePreferencesButton` + `CookiePreferences`.
- `messages/{en,fr}.json` — `cookies.saved`/`savedBody`.

**app:**

- `src/user-interface/ShellOverlays.tsx` — fire the toast in `persist` + legal `onAccept`.
- `/account` page — add the Cookie-preferences section (`ConsentPreferences`).
- `messages/{en,fr}.json` — `consent.saved`/`savedBody`/`manage`/`preferencesTitle`.

**hybrid:**

- renderer `shell.tsx` — mount `<Toaster>`; fire the toast in the consent/legal callbacks.
- renderer settings/account location — mount `ConsentPreferences`.
- renderer `messages/{en,fr}.json` — same keys as app.

## Verification

- Toast fires on explicit consent (Accept/Reject/Save) and legal re-accept; does NOT fire on the geo auto-seed (`source: "auto"` / the `useEffect` seed). A test asserts the auto-seed path is silent.
- The Manage action opens the `/account` Cookie-preferences control; changing categories there re-writes consent (via `applyConsent(source:"preferences")` / `consentStore.save`).
- `import { toast }` resolves from the web-ui sonner brick; website + hybrid render a `<Toaster>`.
- en/fr parity per surface (parity tests); `pnpm verify` green.
- Visual: banner → choice → toast appears, on website + app + hybrid; both light/dark.

## Open decision (confirm at plan time)

- **Website Manage target:** route to `/account` (consistent with app/hybrid) vs call the existing `openPreferences()` dialog. Recommendation: route to `/account` for cross-surface consistency; keep the dialog for the footer/URL entry points.

## Spec B (mobile) — forward note

Mobile mirrors this UX with native primitives: a native toast via the existing `AnnouncementOverlay` pattern (no sonner), the shared `ConsentBanner`/`ConsentPreferences` from `/native`, and a native "Cookie preferences" screen. Same copy keys (`consent.saved` etc. in the mobile `messages/`). Its own spec + plan.
