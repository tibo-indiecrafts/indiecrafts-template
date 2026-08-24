# Worldwide W2: CCPA "Do Not Sell/Share" + GPC end-to-end

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Give US (opt-out) visitors a clear "Do Not Sell or Share My Personal Information" control, and honor Global Privacy Control (GPC) server-side (the `Sec-GPC` header), not just client-side.

**Map (exact paths):** `.superpowers/sdd/slice-w2-ccpa-gpc-map.md`. **Today:** `browserSignalsDeny()` reads `navigator.globalPrivacyControl` CLIENT-side (`packages/web/compliance/src/consent/consent-store.ts:89` website; `packages/shared/compliance/src/web/signals.ts:8` app/hybrid); `Sec-GPC` is read nowhere server-side; the only preferences affordance is `ManagePreferencesButton`, buried on `/cookie-policy`.

## Global Constraints
- Config-first; geo-gate via `resolveConsentMode(country) === "opt-out"`; no China. Commit `--no-verify`; stage only named files; prettier; writing-style. Machine may be slow — allow time / background.
- Rulings: W2-CONTROL (a footer-mounted link → `openPreferences()`, geo-gated, CCPA copy — not a new `/do-not-sell` page); W2-SERVER-GPC (read `Sec-GPC` in `[locale]/layout.tsx` alongside `cf-ipcountry`, feed as a deny signal — no middleware/cookie hop); W2-NATIVE (GPC is a browser signal, N/A on RN — document as intentional; native still has the full preferences UI).

---

### Task 1: "Do Not Sell or Share" control (website + app)

**Files:** a new `DoNotSellLink` component (home: `code/packages/web/compliance/src/consent/` — website's consent UI; check whether app reuses it or needs the shared `packages/shared/compliance/src/web/`), mounted in the website footer/layout + the app; i18n `messages/*` on each; docs.

- [ ] **Step 1:** Read `code/packages/web/compliance/src/consent/` — the `useConsent`/`openPreferences` API (the map says `openPreferences()` exists + is anticipated for "a footer link"), `ManagePreferencesButton`, `CookiePreferences`, and how the website layout mounts consent (`[locale]/layout.tsx`). Read the website `Footer.tsx` (CMS-driven) + how the layout mounts non-nav components (the banner mounts there per the compliance brief).
- [ ] **Step 2:** Create a `DoNotSellLink` client component: renders a link/button labelled from i18n ("Do Not Sell or Share My Personal Information"), `onClick` → `openPreferences()` (opens the consent-preferences modal where the visitor can deny sale/sharing categories). It renders ONLY when the visitor's mode is opt-out — accept the resolved mode (or country) as a prop resolved server-side in the layout via `resolveConsentMode(headers cf-ipcountry)`, so it's SSR-gated (no flash). Mirror `ManagePreferencesButton`'s structure/consent-store usage.
- [ ] **Step 3:** Mount it in the website layout's footer region (next to where the banner/manage-preferences mount), passing the SSR-resolved opt-out flag. Do the same for the app surface if it has a footer/consent mount (else note app defers). i18n keys (`consent.doNotSell.*` or similar) in each surface's `messages/{en,fr}.json` (en/fr parity).
- [ ] **Step 4:** `pnpm --filter @indiecrafts/web-surfaces-website tsc` + `test` (messages parity) green; app tsc if touched. A component test (Storybook `play` or the package's test pattern) asserting the link opens preferences + only renders in opt-out mode. Docs: `code/docs/apps/web/config/cookie-consent-geo.md` — the Do-Not-Sell control + its geo-gating. Commit `--no-verify` (`feat(compliance): CCPA "Do Not Sell or Share" control (opt-out regions)`).

---

### Task 2: Honor GPC server-side (`Sec-GPC`) + native-GPC doc

**Files:** website + app `[locale]/layout.tsx`; the consent provider/store seeding (`packages/web/compliance/src/consent/` + `packages/shared/compliance/src/web/signals.ts`); `code/docs/packages/compliance-shared.md`.

- [ ] **Step 1:** Read the website `[locale]/layout.tsx` (it already reads `cf-ipcountry` via `headers()` for the geo consent mode) + how it seeds the consent provider / mounts the banner. Read `browserSignalsDeny()` (consent-store.ts:89 + signals.ts:8) — the client-side GPC/DNT deny.
- [ ] **Step 2:** In the layout, read the `Sec-GPC` request header (`headers().get("sec-gpc") === "1"`) alongside the existing `cf-ipcountry` read, and pass a `gpcSignal: boolean` into the consent provider (a prop). The provider/store treats a truthy server GPC as an initial DENY signal — the same effect as the client `browserSignalsDeny`, but seeded server-side (before client JS), so GPC is honored even when `navigator.globalPrivacyControl` isn't exposed. OR (union) it with the existing client check so either source denies. Do NOT weaken the existing client-side check.
- [ ] **Step 3:** Do the same in the app surface's layout if it mounts consent. Add a test asserting: `Sec-GPC: 1` → the consent state seeds as denied/opted-out (a layout or store test — mirror how the existing consent seeding is tested; if hard to test at the layout level, unit-test the store's "server GPC signal → deny" path).
- [ ] **Step 4:** Document native GPC as intentional in `code/docs/packages/compliance-shared.md`: GPC is a browser signal (`navigator.globalPrivacyControl` / `Sec-GPC`), absent on React Native; the native surfaces honor opt-out via the same consent/preferences UI, so there's no native GPC trigger by design.
- [ ] **Step 5:** `pnpm --filter @indiecrafts/web-surfaces-website tsc` + `test` green; app tsc if touched; the consent package test green. Prettier. Commit `--no-verify` (`feat(compliance): honor GPC server-side via the Sec-GPC header`).

---

## Self-review
- Coverage: the Do-Not-Sell control (opt-out geo-gated, opens preferences) + server-side GPC honoring + native-GPC documented. Matches the CCPA/CPRA gaps.
- Consistency: reuses `openPreferences`/the consent store + `resolveConsentMode` + the layout's existing `headers()` read; no new consent architecture, no middleware.
- Deferred/noted: a dedicated `/do-not-sell` page (the footer link → preferences is the CCPA-compliant minimum; a page is optional polish). Native GPC (N/A by design).
- Ruling W2-CONTROL / W2-SERVER-GPC / W2-NATIVE as above.
