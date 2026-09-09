# Unified account-management modal (web) — design

- **Date:** 2026-09-09
- **Status:** Implemented (web) — website, app, and hybrid (Electron) surfaces wired to the unified modal; mobile is phase 2.
- **Author:** platform
- **Scope:** one account-management modal for the three web surfaces — `website`, `app` (Next/Cloudflare), and `hybrid` (Electron renderer). `mobile` (Expo) is phase 2.

## 1. Goal

Give every web surface **one** account experience — one trigger, one modal, the
same contents — that covers **all** aspects of an account in a single place:
profile, security, active devices, consent preferences, data export, and account
deletion. The same component works whether an instance ships the `website` alone
or the `website` + `app` together.

Build it on Clerk's prebuilt `<UserProfile>` (which already ships profile,
email, password, MFA, active devices, and sign-out-everywhere) and add our GDPR
sections as **custom pages**. Fold in the earlier account optimization: one
headless `useAccountActions` hook, a small per-surface `AuthPort` adapter, and
the shared `compliance` section bricks.

## 2. Non-goals

- **No mobile in this phase.** `@clerk/clerk-expo` is headless (no prebuilt
  `<UserProfile>`), so mobile is phase 2 — a native bottom-sheet mirroring the
  same tabs, using the RN sections that already exist.
- **No new profile/security UI.** Clerk owns profile, password, MFA, devices,
  and sign-out-everywhere. We never re-implement them.
- **No admin/session views.** The admin dashboard's sessions/security tables are
  operator tooling, out of scope here.
- **No change to the erasure/export server contracts** (`/v1/erasure/self`,
  `/v1/export`) or the consent store.

## 3. Decisions (resolved in brainstorming)

1. **Shell = Clerk `<UserProfile>` + custom tabs.** Not a hand-rolled Dialog.
2. **Scope = website + app + hybrid.** Design for the hardest case (hybrid /
   Electron) so the two easier surfaces follow for free. Mobile is phase 2.
3. **Keep a thin `/account` route** as a full-page fallback for direct links and
   emails, rendering the same custom pages (not modal-only).
4. **Fold in the optimization** (`useAccountActions` + `AuthPort`) as part of
   this work — delete the per-surface `AccountDeletePanel` wrappers.

## 4. Current state (the gap)

The delete/export/consent **sections** are already shared bricks in
`@indiecrafts/packages-shared-compliance` (`web` + `native`). What is missing is
a single **container** and consistent contents:

| Surface              | Consent                                    | Export | Delete | Profile / security                          |
| -------------------- | ------------------------------------------ | ------ | ------ | ------------------------------------------- |
| `website` `/account` | button → cookie banner (no inline toggles) | ✓      | ✓      | only Clerk `UserButton` dropdown (separate) |
| `app` `/account`     | inline toggles + save                      | ✓      | ✓      | Clerk `UserButton` (separate)               |
| `mobile` `/account`  | inline                                     | ✓      | ✓      | Clerk headless                              |
| `hybrid` renderer    | inline + sign out                          | ✓      | ✓      | —                                           |

Each web surface wraps the sections in its own `AccountDeletePanel` (website +
app are near-identical copies), and profile/security lives in a **separate**
Clerk dropdown. Nothing is "all in one place."

## 5. Architecture

Three pieces, each with one job:

### 5.1 `<AccountButton>` — the trigger + modal (new, `packages-web-auth`)

Lives in `@indiecrafts/packages-web-auth` (it already owns `AppClerkProvider`
and re-exports the Clerk components). It renders Clerk's `<UserButton>` and
declares our two custom pages as its children:

```tsx
<UserButton>
  <UserButton.UserProfilePage label="Privacy & consent" url="privacy" labelIcon={…}>
    <ConsentTab />
  </UserButton.UserProfilePage>
  <UserButton.UserProfilePage label="Your data" url="data" labelIcon={…}>
    <DataTab />
  </UserButton.UserProfilePage>
</UserButton>
```

Mounted identically in the website header (`AuthMenu`), the app sidebar
(`NavUser`), and the hybrid renderer. One trigger, same modal, everywhere.

### 5.2 `<AccountPage>` — the `/account` full-page fallback (new, `packages-web-auth`)

Renders Clerk's standalone `<UserProfile routing="path" path="/account">` with
the **same two custom pages** (`<UserProfile.Page>`). The tab _content_
components (`<ConsentTab>`, `<DataTab>`) are defined once and shared by both
`<AccountButton>` and `<AccountPage>`, so there is no duplicated content.

### 5.3 `useAccountActions(port, { apiUrl })` — the headless hook (new, `compliance/web`)

Clerk-free (it lives in `compliance`, which imports no Clerk). It orchestrates
the export and delete flows over an injected `AuthPort` (§5.4):

- `runExport()` → `requestExport({ apiUrl, getToken: port.getToken })`
- `deleteAccount(email)` → `mapErasureResponse(await port.submitErasure(email))`,
  then `port.onDeleted()` (sign out + route home).

The two custom tabs consume the hook, so the per-surface `AccountDeletePanel`
wrappers are deleted.

### 5.4 `AuthPort` — the ~5-line per-surface adapter (Clerk-coupled)

The only thing that genuinely differs per surface is the Clerk SDK, so the Clerk
calls stay in a thin adapter the surface builds and passes in:

- `getToken()` / `signOut()` — from the surface's `useAuth`.
- `submitErasure(email)` — the surface wraps `rawErasureFetch` in **its own**
  `useReverification` (both `@clerk/nextjs` and `@clerk/clerk-react` export it),
  so the reverification step-up stays in the Clerk context, not in `compliance`.
- `onDeleted()` — the surface's router (route home after sign out).

`@clerk/nextjs` (website/app) and `@clerk/clerk-react` (hybrid) each build this
port in ~5 lines; nothing else per surface.

## 6. Data flow

1. User clicks the `<UserButton>` avatar → Clerk opens `<UserProfile>`.
2. Built-in tabs (Profile / Security / Devices) are handled entirely by Clerk.
3. **Privacy & consent** tab → `<ConsentPreferences>` toggles bound to the
   client `consentStore` (localStorage); Save writes the record. No server call.
4. **Your data** tab → `useAccountActions`:
   - Export → `POST /v1/export` (Clerk-JWT) → 1-hour download link.
   - Delete → reverification → `POST /v1/erasure/self` (Clerk-JWT + typed email)
     → sign out + route home.
5. `/account` route renders the same tabs full-page for direct links.

## 7. What is consolidated / removed

- **Delete:** `website/src/user-interface/account/AccountDeletePanel.tsx`,
  `app/.../account/AccountDeletePanel.tsx`, `app/.../account/CookiePreferencesSection.tsx`.
  The bespoke `/account` **page bodies** shrink to `<AccountPage>`.
- **Keep:** `DeleteAccountSection` / `ExportSection` / `ConsentPreferences`
  (`compliance/web`) — now consumed by the custom tabs, not per-surface wrappers.
- **Keep** the `/account` route on website + app (thin fallback).

## 8. Hybrid (the hard case we design for)

`@clerk/clerk-react` ships `<UserProfile>`, so hybrid is first-class. The Electron
renderer already runs `<SignIn routing="virtual">`, so `<UserProfile routing="virtual">`

- custom pages slot into the same pattern. **Verify during build:** flows that
  open the system browser (OAuth account-linking / device management) still round-trip
  through the `indiecrafts://` deep link, and the custom tabs render inside the
  virtual-routed profile.

## 9. Universality (website-only vs website + app)

`<AccountButton>` is one Clerk-driven brick, gated on `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
(as today). A website-only instance and a website+app instance mount the exact
same component with the same custom pages — no per-surface divergence, no config
fork. Adding `app` later needs no account-UI change.

## 10. Testing

- **Unit:** `useAccountActions` — export success/failure, delete happy path,
  reverification retry (mock the port). Colocated in `compliance`.
- **Component:** the two tab-content components render their sections; consent
  toggles write the store; the data tab wires export/delete to the hook.
- **Integration (per web surface):** the `<UserButton>` opens the modal; the two
  custom tabs appear; a signed-out user sees no button (the auth-gate work already
  landed). Keep the existing erasure/export worker tests unchanged.
- **Manual (hybrid):** open the modal in the Electron renderer; confirm the custom
  tabs render and export/delete work through the deep link.

## 11. Phasing

- **Phase 1 (web, this spec):** `<AccountButton>` + `<AccountPage>` + the two tab
  contents + `useAccountActions` + `AuthPort`; wire into website, app, hybrid;
  delete the old wrappers.
- **Phase 2 (mobile, later spec):** a native bottom-sheet reusing the RN sections
  (`compliance/native`) + `useAccountActions`-equivalent, with password/MFA/devices
  linking out to "manage on the web" (clerk-expo has no prebuilt UI for them).

## 12. Risks / open items

- **Clerk custom-page API** differs slightly between `<UserButton.UserProfilePage>`
  (modal) and `<UserProfile.Page>` (standalone). Confirm both accept the same
  content components in the installed Clerk version (Core 3).
- **Virtual routing in Electron** for `<UserProfile>` — the sign-in path works;
  the profile path needs a smoke test.
- **Consent semantics** — the tab manages the **client** cookie-consent record
  (localStorage `consentStore`), matching app/mobile today. It does not write
  server `consent_events`; that stays the banner/gate's job.

## Issue tags

- `@debt E2E` — hybrid profile modal is manual-tested only until an Electron E2E harness exists.
