# Unified account-management modal (web) — design

- **Date:** 2026-09-09
- **Status:** Implemented (Revision 2, 2026-09-09). Website (modal + `/account` page), app (embedded `/account`), and hybrid + mobile (browser hand-off to `accountUrl`) are all wired; admin stays sign-out-only. See §3.5 for the authoritative per-surface model.
- **Author:** platform
- **Scope:** the account experience across all five surfaces. **website** — a modal (avatar) plus a standalone `/account` page. **app** — embedded in the `/account` page (the canonical web account). **hybrid + mobile** — a direct link that opens the canonical web account in a browser (no native account UI). **admin** — out of scope (sign-out only).

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

- **No native account UI on hybrid or mobile.** They do not host profile /
  security / data tabs of their own. They open the **canonical web account** (the
  app's `/account`, else the website's) in a browser (§3.5). This supersedes the
  earlier "hybrid clerk-react modal" and "phase-2 native bottom-sheet" plans.
- **No account modal on admin.** Admin keeps its sign-out-only sidebar menu.
- **No new profile/security UI.** Clerk owns profile, password, MFA, devices,
  and sign-out-everywhere. We never re-implement them.
- **No change to the erasure/export server contracts** (`/v1/erasure/self`,
  `/v1/export`) or the consent store. Each surface keeps its **own** consent
  control (a browser can't set a native app's tracking prefs).

## 3. Decisions (resolved in brainstorming)

1. **Shell = Clerk `<UserProfile>` + custom tabs.** Not a hand-rolled Dialog.
2. **Scope = website + app + hybrid.** Design for the hardest case (hybrid /
   Electron) so the two easier surfaces follow for free. Mobile is phase 2.
3. **Keep a thin `/account` route** as a full-page fallback for direct links and
   emails, rendering the same custom pages (not modal-only).
4. **Fold in the optimization** (a headless data-tab + a per-surface `AuthPort`
   adapter) as part of this work — delete the per-surface `AccountDeletePanel`
   wrappers. (During implementation the standalone `useAccountActions` hook was
   dropped as YAGNI; the shared sections own their own state and take an injected
   `AccountAuth` port instead — see §5, updated.)

## 3.5 Revised per-surface model (Revision 2 — authoritative)

The unified web core (§5) stands for **website + app**. Hybrid + mobile do **not**
render it; they open the canonical web account in a browser. Admin is untouched.

| Surface     | SDK                  | Account experience                       | Trigger                                                          |
| ----------- | -------------------- | ---------------------------------------- | ---------------------------------------------------------------- |
| **website** | `@clerk/nextjs`      | **Modal** + a standalone `/account` page | header avatar opens the modal; `/account` = the page             |
| **app**     | `@clerk/nextjs`      | **Embedded** in the `/account` page      | sidebar avatar **navigates** to `/account` (no modal)            |
| **hybrid**  | `@clerk/clerk-react` | **Link-out** to the web account          | a "Manage account" link → `shell.openExternal(accountUrl)`       |
| **mobile**  | `@clerk/clerk-expo`  | **Link-out** to the web account          | a "Manage account" link → in-app browser tab (Expo `WebBrowser`) |
| **admin**   | `@clerk/nextjs`      | none (sign-out only)                     | unchanged                                                        |

**The canonical web account = `accountUrl`.** Big products put account management on
the authenticated product surface (or a dedicated `accounts.` subdomain), never the
marketing homepage. So:

- **`accountUrl` is one config value** on the mobile + hybrid configs. **Default:**
  `${websiteUrl}/account` — the website is the one surface present in every project
  and its URL is already configured. **Override:** a project that ships the `app`
  surface points it at `app.<domain>/account` (the authenticated product surface —
  the conceptually-correct, common-practice home).
- **Both candidate surfaces already serve a standalone `/account` page**, so either
  is a valid hand-off target. The website additionally opens the modal from its
  avatar; the app is embedded-only.

**Hand-off mechanism (avoids re-auth where the platform allows):**

- **mobile** — an **in-app browser tab** (`expo-web-browser` `openBrowserAsync`,
  which is `SFSafariViewController` / Chrome Custom Tabs). It shares the system
  browser's cookie jar, so an existing web session usually carries over (no second
  sign-in). A bare external URL would not — do not use `Linking.openURL` for this.
- **hybrid** — `shell.openExternal(accountUrl)` (the same OS-browser path legal
  links already use). The renderer's security posture (will-navigate allowlist,
  no cross-origin nav, no spawned windows) forbids opening it in-renderer, so the
  system browser is the path; a fresh browser may prompt a sign-in. Accepted
  trade-off (the desktop billing/account-in-browser norm).

**App Store constraint (mobile).** Apple Guideline 5.1.1(v): an app that supports
account creation must let the user **initiate account deletion from within the app**.
So mobile keeps a **native "Delete account" entry** that opens the delete flow in the
in-app browser tab — the button stays in the app; a pure "visit our website" link is
non-compliant.

**Consent stays per-surface.** The cookie-consent control is **not** part of the
hand-off. Website + app manage consent in the modal/page; hybrid + mobile keep their
existing **native** consent controls (banner + preferences), because a web page can't
write a native client's tracking store.

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

Mounted in the **website** header (`AuthMenu`) — the one surface whose account is a
modal. The **app** sidebar (`NavUser`) instead **navigates** to `/account` (the
embedded `<AccountPage>`); **hybrid + mobile** hand off to the browser (§8). So
`<AccountButton>` is a website-only trigger; `<AccountPage>` (§5.2) is the shared
render used by the website's `/account`, the app's `/account`, and — reached via the
hand-off — by whichever surface `accountUrl` points at.

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

## 8. Hybrid + mobile (the browser hand-off, revised)

Neither renders the account UI. `SignedInView` (hybrid) and the mobile account
screen keep **sign-out** and their **native consent** control, and replace the
profile/data blocks with a **"Manage account"** action that opens `accountUrl`:

- **hybrid** — `window.desktop.openExternal(accountUrl)` (the existing `open-external`
  IPC + `isSafeExternalUrl` guard, same path as legal links). Remove the built
  `account-button.tsx` (clerk-react `<UserProfile>`), and drop `@clerk/clerk-react`'s
  `useReverification` erasure plumbing from `SignedInView`.
- **mobile** — `WebBrowser.openBrowserAsync(accountUrl)` (in-app browser tab). Keep a
  **native "Delete account"** entry (App Store 5.1.1(v), §3.5) that opens the delete
  path of `accountUrl` in the same in-app tab. The native `ConsentPreferences` +
  consent save stay; the native `ExportSection` / `DeleteAccountSection` full render
  is replaced by the link-out + the compliant delete entry.

**Why not the clerk-react modal we built:** the hand-off keeps one canonical account
implementation (the app's web account) instead of a third fork, matches common
practice (native clients hand off account management to the authenticated web
surface), and removes the clerk-react `<UserProfile>` maintenance surface.

## 9. Universality (website-only vs website + app)

`<AccountButton>` is one Clerk-driven brick, gated on `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
(as today). A website-only instance and a website+app instance mount the exact
same component with the same custom pages — no per-surface divergence, no config
fork. Adding `app` later needs no account-UI change.

## 10. Testing

- **Unit / component (compliance):** the two tab-content components
  (`AccountConsentTab` / `AccountDataTab`) render their sections; consent toggles
  write the store; the data tab wires export/delete through the injected
  `AccountAuth` port. Keep the existing erasure/export worker tests unchanged.
- **Integration (website):** the avatar opens the modal with both custom tabs;
  `/account` renders them full-page; a signed-out user sees no trigger. **(app):**
  the sidebar avatar navigates to `/account`; the embedded page renders the tabs.
- **Manual (hybrid):** the "Manage account" link opens `accountUrl` in the system
  browser; sign-out + native consent still work in the renderer.
- **Manual (mobile):** the "Manage account" link opens `accountUrl` in an in-app
  browser tab; the native "Delete account" entry opens the delete path; native
  consent still saves.

## 11. Phasing

- **Phase 1 (built):** the shared Clerk-free core (`AccountConsentTab` /
  `AccountDataTab` + `AccountAuth`), the `@clerk/nextjs` `<AccountButton>` /
  `<AccountPage>`, and the website + app wiring (both modal + `/account` page).
  Old `AccountDeletePanel` / `CookiePreferencesSection` wrappers deleted.
- **Phase 2 (this revision — the plan update):**
  1. `accountUrl` config on the mobile + hybrid configs (default `${websiteUrl}/account`).
  2. **app** — sidebar avatar navigates to `/account`; drop the app's modal trigger.
  3. **hybrid** — remove `account-button.tsx`; `SignedInView` gets a "Manage
     account" link (`openExternal(accountUrl)`); keep sign-out + native consent.
  4. **mobile** — replace the native profile/data render with a "Manage account"
     link (in-app browser tab) + a compliant native "Delete account" entry; keep
     native consent.
  5. Docs + changelogs; website unchanged (already modal + page).

## 12. Risks / open items

- **Clerk custom-page API** (`<UserButton.UserProfilePage>` + `<UserProfile.Page>`,
  Core 3) — **resolved.** Verified rendering on the app: both custom tabs ("Privacy
  & consent", "Your data") appear in the embedded `<UserProfile>` at `/account`.
- **`accountUrl` target** — a project that ships the `app` surface must set
  `accountUrl` to it; the website default only works if the website has Clerk +
  `features.account` (true whenever native clients exist, since they need auth).
- **Re-auth on hand-off** — the mobile in-app browser tab shares cookies (usually no
  second sign-in); the hybrid system-browser path may prompt one. Accepted.
- **App Store deletion (5.1.1(v))** — mobile MUST keep a native delete entry; a
  pure link-out risks rejection. Tracked as a build requirement, not optional.
- **Consent semantics** — each surface manages the **client** cookie-consent record
  (localStorage / AsyncStorage `consentStore`); no server `consent_events`. Hybrid +
  mobile keep their native consent controls; the hand-off does not carry consent.

## Issue tags

- `@debt E2E` — hybrid profile modal is manual-tested only until an Electron E2E harness exists.
