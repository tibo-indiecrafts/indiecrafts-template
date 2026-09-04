# Cross-platform Parity + Dedup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extract the triplicated offline hook+banner into `system-pages`, add a delete/export copy-builder to `compliance/shared`, and give mobile a dedicated account screen — bringing all four UI surfaces to one home per fact.

**Architecture:** Two shared bricks gain exports (`system-pages` offline; `compliance/shared` copy-builder + moved types), then the four surfaces (website, app, mobile, hybrid) are repointed and their dead duplicates deleted. Web offline detection is shared (3 DOM consumers); mobile's netinfo detection stays local (single consumer) and feeds a presentational native banner.

**Tech Stack:** TypeScript, React 19 (web), React Native/Expo (mobile), Electron+Vite (hybrid renderer), pnpm + Turborepo, vitest for brick unit tests.

**Spec:** `docs/superpowers/specs/2026-09-04-cross-platform-parity-dedup-design.md`

## Global Constraints

- **Native has no host here** — mobile/hybrid code is `tsc`-checked only; on-device validation is the developer's. Never claim a mobile/hybrid screen was runtime-verified.
- **Bricks never import an app; deps point down** (`app → module → package`). A `shared` file must not import from `web`/`native`.
- **≥2-consumer rule** — do not extract a single-consumer helper (mobile's netinfo `useNetworkStatus` stays in mobile).
- **Typed routing** — surfaces route via `@/i18n/routing`, never `next/link` (`check:typed-routing` gate). Not relevant to mobile (expo-router) / hybrid.
- **Copy lives in `messages/`** — never inline user-facing strings; the copy-builder takes a translator, it does not hold literals.
- **Message-key convention:** delete copy = `account.delete.<field>`, export copy = `account.export.<field>`, offline = `offline.banner`. Field names match `DeleteAccountCopy`/`ExportCopy` property names exactly.
- **Changelogs at home altitude:** `code/packages/CHANGELOG.md` for brick changes; each surface's own `CHANGELOG.md` for its wiring.
- **Commit hook** runs repo-wide prettier + website `tsc` (slow ~2min) — expect it on every commit.
- The two dev-ID `wrangler.toml` (`code/shared/{api,cron}`) stay **uncommitted** — never stage them.

---

### Task 1: `system-pages` offline exports (web hook + web banner + native banner)

**Files:**

- Create: `code/packages/shared/system-pages/src/web/useOnlineStatus.ts`
- Create: `code/packages/shared/system-pages/src/web/OfflineBanner.tsx`
- Create: `code/packages/shared/system-pages/src/native/OfflineBanner.tsx`
- Create: `code/packages/shared/system-pages/src/web/OfflineBanner.stories.tsx`
- Modify: `code/packages/shared/system-pages/src/web/index.ts`
- Modify: `code/packages/shared/system-pages/src/native/index.ts`

**Interfaces:**

- Produces: `useOnlineStatus(): boolean` (web); `OfflineBanner({ message }: { message: string })` (web, self-detecting); `OfflineBanner({ message, online }: { message: string; online: boolean })` (native, presentational).

- [ ] **Step 1: Create the web hook** (moved verbatim from `website/src/hooks/useOnlineStatus.ts`)

`code/packages/shared/system-pages/src/web/useOnlineStatus.ts`:

```ts
"use client";

import { useSyncExternalStore } from "react";

function subscribe(callback: () => void) {
  window.addEventListener("online", callback);
  window.addEventListener("offline", callback);
  return () => {
    window.removeEventListener("online", callback);
    window.removeEventListener("offline", callback);
  };
}

/**
 * `true` while the browser reports a network connection, tracking the `online`/`offline`
 * events. `useSyncExternalStore` (not `useState` + `useEffect`) so it is hydration-safe:
 * the server snapshot is `true` (assume online — never flash an offline banner during SSR),
 * and the client reads the real `navigator.onLine` on hydration. `onLine` is a coarse signal
 * (a captive portal reads "online"); pair it with a failed request for certainty.
 */
export function useOnlineStatus(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => navigator.onLine,
    () => true,
  );
}
```

- [ ] **Step 2: Create the web banner** (self-detecting, `{ message }`)

`code/packages/shared/system-pages/src/web/OfflineBanner.tsx`:

```tsx
"use client";

import { useOnlineStatus } from "./useOnlineStatus";

/**
 * A slim, non-blocking strip shown while the browser is offline (auto-hides on
 * reconnect via the `online` event). Copy is injected (`message`). `role="status"` +
 * `aria-live="polite"` so a screen reader announces the change without stealing focus.
 * Shared by the website, the `app` surface, and the Electron renderer (all DOM).
 */
export function OfflineBanner({ message }: { message: string }) {
  const online = useOnlineStatus();
  if (online) return null;
  return (
    <div
      role="status"
      aria-live="polite"
      className="bg-secondary text-secondary-foreground px-(--gutter) py-2 text-center text-sm"
    >
      {message}
    </div>
  );
}
```

- [ ] **Step 3: Create the native banner** (presentational, `{ message, online }`)

`code/packages/shared/system-pages/src/native/OfflineBanner.tsx` — adapted from mobile's banner; detection (`online`) and copy (`message`) are now props so the brick imports neither netinfo nor react-intl:

```tsx
import { View, StyleSheet, Platform, StatusBar } from "react-native";
import { ThemedText, useTheme } from "@indiecrafts/packages-mobile-ui-native";

// Rough status-bar inset (Android exposes it; iOS ~47 on notched devices).
const TOP_INSET =
  Platform.OS === "android" ? (StatusBar.currentHeight ?? 24) : 47;

/**
 * A non-blocking top strip shown while `online` is false; renders nothing otherwise.
 * Copy (`message`) and connectivity (`online`) are injected — the app owns detection
 * (netinfo) so the brick stays free of a single-consumer native dep.
 * `accessibilityLiveRegion` announces the change to TalkBack without stealing focus.
 */
export function OfflineBanner({
  message,
  online,
}: {
  message: string;
  online: boolean;
}) {
  const { theme } = useTheme();
  if (online) return null;
  return (
    <View
      accessibilityLiveRegion="polite"
      style={[
        styles.strip,
        { paddingTop: TOP_INSET + 8, backgroundColor: theme.color.secondary },
      ]}
    >
      <ThemedText
        variant="muted"
        style={{
          color: theme.color["secondary-foreground"],
          textAlign: "center",
          fontSize: 13,
        }}
      >
        {message}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  strip: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingBottom: 8,
    paddingHorizontal: 16,
  },
});
```

- [ ] **Step 4: Add to the barrels**

In `code/packages/shared/system-pages/src/web/index.ts`, after the `OfflineContent` export line, add:

```ts
export { OfflineBanner } from "./OfflineBanner";
export { useOnlineStatus } from "./useOnlineStatus";
```

In `code/packages/shared/system-pages/src/native/index.ts`, after the `OfflineContent` export line, add:

```ts
export { OfflineBanner } from "./OfflineBanner";
```

- [ ] **Step 5: Add a web story** (the visual/a11y gate — this brick has stories, not unit tests)

`code/packages/shared/system-pages/src/web/OfflineBanner.stories.tsx` — mirror the existing `OfflineContent.stories.tsx` structure (open that file first for the exact `Meta`/`StoryObj` shape and title convention), rendering `<OfflineBanner message="You are offline." />`. Since the banner self-detects and defaults to online (renders null), the story wraps it to force-show the strip: render the inner markup directly, or a variant that documents the offline state. Keep one `Default` story showing the offline strip.

- [ ] **Step 6: Typecheck the brick**

Run: `pnpm --filter @indiecrafts/packages-shared-system-pages exec tsc --noEmit` (if the brick has no `tsc` script, run `pnpm exec tsc -p code/packages/shared/system-pages/tsconfig.json --noEmit` or rely on the consuming-app tsc in later tasks).
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add code/packages/shared/system-pages/src/web/useOnlineStatus.ts \
  code/packages/shared/system-pages/src/web/OfflineBanner.tsx \
  code/packages/shared/system-pages/src/native/OfflineBanner.tsx \
  code/packages/shared/system-pages/src/web/OfflineBanner.stories.tsx \
  code/packages/shared/system-pages/src/web/index.ts \
  code/packages/shared/system-pages/src/native/index.ts
git commit -m "feat(system-pages): shared offline hook + banner (web self-detect, native presentational)"
```

---

### Task 2: Repoint `website` to the offline brick

**Files:**

- Modify: `code/projects/web/surfaces/website/src/user-interface/shared/layout/DefaultLayout.tsx` (import of `OfflineBanner`)
- Delete: `code/projects/web/surfaces/website/src/hooks/useOnlineStatus.ts`
- Delete: `code/projects/web/surfaces/website/src/user-interface/shared/layout/OfflineBanner.tsx`

**Interfaces:**

- Consumes: `OfflineBanner` from `@indiecrafts/packages-shared-system-pages/web` (Task 1).

- [ ] **Step 1: Find every importer of the two doomed files**

Run: `grep -rn "layout/OfflineBanner\|hooks/useOnlineStatus\|@/hooks/useOnlineStatus" code/projects/web/surfaces/website/src`
Expected: `DefaultLayout.tsx` imports `./OfflineBanner`; `OfflineBanner.tsx` imports `@/hooks/useOnlineStatus`. If any OTHER file imports `@/hooks/useOnlineStatus`, repoint it to `useOnlineStatus` from `@indiecrafts/packages-shared-system-pages/web` in this task.

- [ ] **Step 2: Repoint DefaultLayout**

In `DefaultLayout.tsx`, replace `import { OfflineBanner } from "./OfflineBanner";` with:

```ts
import { OfflineBanner } from "@indiecrafts/packages-shared-system-pages/web";
```

Leave the `<OfflineBanner message={tOffline("banner")} />` usage unchanged (same `{ message }` prop).

- [ ] **Step 3: Delete the dead files**

```bash
git rm code/projects/web/surfaces/website/src/hooks/useOnlineStatus.ts \
  code/projects/web/surfaces/website/src/user-interface/shared/layout/OfflineBanner.tsx
```

- [ ] **Step 4: Typecheck website**

Run: `pnpm --filter @indiecrafts/web-surfaces-website tsc`
Expected: PASS (no dangling import).

- [ ] **Step 5: Commit**

```bash
git add -A code/projects/web/surfaces/website
git commit -m "refactor(website): use shared OfflineBanner from system-pages; drop local copy"
```

---

### Task 3: Repoint `hybrid` to the offline brick

**Files:**

- Modify: `code/projects/hybrid/surfaces/main/src/renderer/src/App.tsx` (replace inline banner + the local hook import)
- Delete: `code/projects/hybrid/surfaces/main/src/renderer/src/useOnlineStatus.ts`

**Interfaces:**

- Consumes: `OfflineBanner` from `@indiecrafts/packages-shared-system-pages/web`.

- [ ] **Step 1: Read the current offline wiring in App.tsx**

Run: `grep -n "useOnlineStatus\|Offline\|offline" code/projects/hybrid/surfaces/main/src/renderer/src/App.tsx`
Read those lines. Identify (a) the `useOnlineStatus` import from `./useOnlineStatus`, (b) the inline offline `<div>` and its message source (a react-intl `formatMessage({ id: "offline.banner" })`).

- [ ] **Step 2: Replace the inline banner with the shared one**

In `App.tsx`: remove the `import { useOnlineStatus } from "./useOnlineStatus"`; add `import { OfflineBanner } from "@indiecrafts/packages-shared-system-pages/web";`. Replace the inline offline `<div>` (and any `const online = useOnlineStatus()` used only for it) with:

```tsx
<OfflineBanner message={t.formatMessage({ id: "offline.banner" })} />
```

(use the file's existing react-intl handle — it is `useIntl()`, commonly `t`). If `useOnlineStatus` is used elsewhere in App.tsx beyond the banner, keep a local usage by importing the hook from the brick instead of the deleted file.

- [ ] **Step 3: Delete the dead hook**

```bash
git rm code/projects/hybrid/surfaces/main/src/renderer/src/useOnlineStatus.ts
```

- [ ] **Step 4: Typecheck hybrid**

Run: `pnpm --filter @indiecrafts/hybrid-surfaces-main tsc`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add -A code/projects/hybrid/surfaces/main
git commit -m "refactor(hybrid): use shared OfflineBanner from system-pages; drop local hook"
```

---

### Task 4: Add the offline banner to `app` (new consumer)

**Files:**

- Modify: the `app` shell that renders top-of-app chrome — find it in Step 1 (candidate: `code/projects/web/surfaces/app/src/user-interface/**/ShellOverlays.tsx` or the app layout).
- Verify: `code/projects/web/surfaces/app/messages/en.json` has `offline.banner` (add it + `fr.json` if missing).

**Interfaces:**

- Consumes: `OfflineBanner` from `@indiecrafts/packages-shared-system-pages/web`.

- [ ] **Step 1: Locate app's shell + confirm the offline message key**

Run: `grep -rn "ShellOverlays\|AnnouncementChrome\|UpdatePrompt" code/projects/web/surfaces/app/src/user-interface`
Run: `grep -rn "offline" code/projects/web/surfaces/app/messages/en.json`
If `offline.banner` is absent, add `"offline": { "banner": "You are offline. Some features may be unavailable." }` to both `messages/en.json` and `messages/fr.json` (mirror the website's wording/locale).

- [ ] **Step 2: Mount the banner in app's shell**

In app's `ShellOverlays` (the client component that renders the consent gate / announcement / update prompt), add:

```tsx
import { OfflineBanner } from "@indiecrafts/packages-shared-system-pages/web";
```

and render `<OfflineBanner message={t("offline.banner")} />` at the top of the overlay group, using the file's existing `useTranslations` handle (namespace-scope it correctly — if `t = useTranslations()` at root, call `t("offline.banner")`; if scoped, read the key accordingly).

- [ ] **Step 3: Typecheck app**

Run: `pnpm --filter @indiecrafts/web-surfaces-app tsc`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add -A code/projects/web/surfaces/app
git commit -m "feat(app): offline banner via shared system-pages brick"
```

---

### Task 5: Repoint `mobile` to the native offline banner (keep netinfo)

**Files:**

- Modify: `code/projects/mobile/surfaces/main/components/ShellOverlays.tsx` (renders `<OfflineBanner/>`)
- Delete: `code/projects/mobile/surfaces/main/components/OfflineBanner.tsx`
- Keep: `code/projects/mobile/surfaces/main/hooks/useNetworkStatus.ts` (netinfo — single consumer, stays local)

**Interfaces:**

- Consumes: `OfflineBanner` from `@indiecrafts/packages-shared-system-pages/native` (native, `{ message, online }`).

- [ ] **Step 1: Read how ShellOverlays mounts the banner**

Run: `grep -n "OfflineBanner\|useNetworkStatus\|useIntl\|formatMessage" code/projects/mobile/surfaces/main/components/ShellOverlays.tsx`
Read those lines to see the current `<OfflineBanner />` placement and whether `useIntl` + `useNetworkStatus` are already in scope there.

- [ ] **Step 2: Repoint ShellOverlays to the brick banner with injected props**

In `ShellOverlays.tsx`: replace the local banner import with `import { OfflineBanner } from "@indiecrafts/packages-shared-system-pages/native";`. Ensure `useNetworkStatus` (from `@/hooks/useNetworkStatus`) and `useIntl` are in scope in the component, then render:

```tsx
<OfflineBanner
  message={t.formatMessage({ id: "offline.banner" })}
  online={useNetworkStatus()}
/>
```

(if `useNetworkStatus()` cannot be called inline per hooks rules, hoist `const online = useNetworkStatus();` to the component body and pass `online={online}`).

- [ ] **Step 3: Delete the dead banner**

```bash
git rm code/projects/mobile/surfaces/main/components/OfflineBanner.tsx
```

- [ ] **Step 4: Typecheck mobile**

Run: `pnpm --filter @indiecrafts/mobile-surfaces-main tsc`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add -A code/projects/mobile/surfaces/main
git commit -m "refactor(mobile): use shared native OfflineBanner; keep netinfo detection local"
```

---

### Task 6: `compliance` — move copy types to `shared` + add the copy-builders

**Files:**

- Create: `code/packages/shared/compliance/src/shared/account-copy.ts`
- Create: `code/packages/shared/compliance/src/shared/account-copy.test.ts`
- Modify: `code/packages/shared/compliance/src/web/DeleteAccountSection.tsx` (import type from shared, drop inline def)
- Modify: `code/packages/shared/compliance/src/web/ExportSection.tsx` (import type from shared, drop inline def)
- Modify: `code/packages/shared/compliance/src/native/DeleteAccountSection.tsx` (same)
- Modify: `code/packages/shared/compliance/src/native/ExportSection.tsx` (same)
- Modify: `code/packages/shared/compliance/src/shared/index.ts` (export types + builders)
- Modify: `code/packages/shared/compliance/src/web/index.ts` (export builders)
- Modify: `code/packages/shared/compliance/src/native/index.ts` (export builders)

**Interfaces:**

- Produces: `type DeleteAccountCopy` (10 fields), `type ExportCopy` (6 fields), `buildDeleteAccountCopy(t: (key: string) => string): DeleteAccountCopy`, `buildExportCopy(t: (key: string) => string): ExportCopy`. `t(field)` returns the string for relative field key (e.g. `t("heading")`); the caller scopes `t` to `account.delete` / `account.export`.

- [ ] **Step 1: Write the failing test**

`code/packages/shared/compliance/src/shared/account-copy.test.ts` (vitest — the brick's
convention, matching `export-self.test.ts`: `import { describe, expect, it } from "vitest"`,
source imported without the `.ts` extension):

```ts
import { describe, expect, it } from "vitest";
import { buildDeleteAccountCopy, buildExportCopy } from "./account-copy";

describe("account-copy builders", () => {
  it("buildDeleteAccountCopy maps every DeleteAccountCopy field", () => {
    const copy = buildDeleteAccountCopy((k) => `X:${k}`);
    expect(Object.keys(copy).sort()).toEqual([
      "body",
      "confirmButton",
      "emailLabel",
      "emailPlaceholder",
      "error",
      "heading",
      "mismatch",
      "partial",
      "pending",
      "success",
    ]);
    expect(copy.heading).toBe("X:heading");
    expect(copy.mismatch).toBe("X:mismatch");
  });

  it("buildExportCopy maps every ExportCopy field", () => {
    const copy = buildExportCopy((k) => `Y:${k}`);
    expect(Object.keys(copy).sort()).toEqual([
      "body",
      "button",
      "error",
      "heading",
      "pending",
      "success",
    ]);
    expect(copy.button).toBe("Y:button");
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `pnpm --filter @indiecrafts/packages-shared-compliance test`
Expected: FAIL (Cannot resolve `./account-copy`).

- [ ] **Step 3: Create the shared types + builders**

`code/packages/shared/compliance/src/shared/account-copy.ts`:

```ts
/**
 * The copy contracts for the shared account sections + pure builders that assemble
 * them from a namespace-scoped translator. Lives in `shared` (no React) so the
 * `web`/`native` section components AND the builders reference one type. Each surface
 * passes a `t` already scoped to `account.delete` / `account.export`, so `t("heading")`
 * resolves the right string regardless of its i18n runtime (next-intl / react-intl).
 */

export interface DeleteAccountCopy {
  heading: string;
  body: string;
  emailLabel: string;
  emailPlaceholder: string;
  confirmButton: string;
  pending: string;
  success: string;
  partial: string;
  error: string;
  mismatch: string;
}

export interface ExportCopy {
  heading: string;
  body: string;
  button: string;
  pending: string;
  success: string;
  error: string;
}

export function buildDeleteAccountCopy(
  t: (key: string) => string,
): DeleteAccountCopy {
  return {
    heading: t("heading"),
    body: t("body"),
    emailLabel: t("emailLabel"),
    emailPlaceholder: t("emailPlaceholder"),
    confirmButton: t("confirmButton"),
    pending: t("pending"),
    success: t("success"),
    partial: t("partial"),
    error: t("error"),
    mismatch: t("mismatch"),
  };
}

export function buildExportCopy(t: (key: string) => string): ExportCopy {
  return {
    heading: t("heading"),
    body: t("body"),
    button: t("button"),
    pending: t("pending"),
    success: t("success"),
    error: t("error"),
  };
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `pnpm --filter @indiecrafts/packages-shared-compliance test`
Expected: PASS (2 tests).

- [ ] **Step 5: Point the section components at the shared type**

In `web/DeleteAccountSection.tsx`: delete the inline `export interface DeleteAccountCopy { … }` block; add `import type { DeleteAccountCopy } from "../shared/account-copy";`. Keep the `DeleteAccountSectionProps` interface (it references `DeleteAccountCopy`). Do the same in `native/DeleteAccountSection.tsx`. In `web/ExportSection.tsx` and `native/ExportSection.tsx`: delete the inline `export interface ExportCopy { … }`; add `import type { ExportCopy } from "../shared/account-copy";`.

- [ ] **Step 6: Update the three barrels**

In `shared/index.ts`, add:

```ts
export {
  buildDeleteAccountCopy,
  buildExportCopy,
  type DeleteAccountCopy,
  type ExportCopy,
} from "./account-copy";
```

In `web/index.ts`: change the section's `export type { DeleteAccountCopy … }` / `export type { ExportCopy … }` lines so the types come from `../shared/account-copy` (or leave the section re-exporting them — but the section no longer defines them, so re-exporting a re-export can break; safest is `export { buildDeleteAccountCopy, buildExportCopy } from "../shared/account-copy"; export type { DeleteAccountCopy, ExportCopy } from "../shared/account-copy";`, and drop `DeleteAccountCopy`/`ExportCopy` from the `export type { … } from "./DeleteAccountSection"` / `"./ExportSection"` lines — keep `DeleteAccountSectionProps`/`ErasureSelfResult`/`ExportSectionProps` there). Mirror the same change in `native/index.ts`.

- [ ] **Step 7: Typecheck the whole workspace (barrels ripple to consumers)**

Run: `pnpm tsc`
Expected: PASS — every existing `import { …, type DeleteAccountCopy } from ".../compliance/web"` still resolves (re-exported from the barrel).

- [ ] **Step 8: Commit**

```bash
git add code/packages/shared/compliance
git commit -m "refactor(compliance): move account copy types to shared + add copy-builders"
```

---

### Task 7: Repoint the four copy-assembly sites to the builders

**Files:**

- Modify: `code/projects/web/surfaces/website/src/user-interface/account/AccountDeletePanel.tsx`
- Modify: `code/projects/web/surfaces/app/src/user-interface/account/AccountDeletePanel.tsx`
- Modify: `code/projects/hybrid/surfaces/main/src/renderer/src/auth.tsx`
- (mobile's assembly is handled in Task 8 when it moves to the account screen)

**Interfaces:**

- Consumes: `buildDeleteAccountCopy`, `buildExportCopy` from `@indiecrafts/packages-shared-compliance/{web,native}` (Task 6).

- [ ] **Step 1: Read each web assembly to learn its translator handle + namespace**

Run: `grep -n "DeleteAccountCopy\|ExportCopy\|useTranslations\|formatMessage\|account.delete\|account.export" code/projects/web/surfaces/website/src/user-interface/account/AccountDeletePanel.tsx code/projects/web/surfaces/app/src/user-interface/account/AccountDeletePanel.tsx code/projects/hybrid/surfaces/main/src/renderer/src/auth.tsx`
Confirm each builds `const … : DeleteAccountCopy = { heading: t(...), … }` and `const … : ExportCopy = { … }` off keys `account.delete.*` / `account.export.*`.

- [ ] **Step 2: Repoint the two web `AccountDeletePanel.tsx` (next-intl)**

In each, add `buildDeleteAccountCopy, buildExportCopy` to the `@indiecrafts/packages-shared-compliance/web` import. Replace the two inline `const … = { … }` copy objects with:

```tsx
const deleteCopy = buildDeleteAccountCopy(useTranslations("account.delete"));
const exportCopy = buildExportCopy(useTranslations("account.export"));
```

(next-intl's `useTranslations(ns)` returns a `t` where `t("heading")` → `account.delete.heading`, which matches the builder contract.) If the file only had one `useTranslations` call at a different namespace, add the two scoped calls. Remove the now-unused `DeleteAccountCopy`/`ExportCopy` type imports if they were only used to annotate the deleted objects.

- [ ] **Step 3: Repoint hybrid `auth.tsx` (react-intl)**

Add `buildDeleteAccountCopy, buildExportCopy` to the `@indiecrafts/packages-shared-compliance/web` import. Replace the inline `const deleteCopy: DeleteAccountCopy = { … }` / `const exportCopy: ExportCopy = { … }` with:

```tsx
const deleteCopy = buildDeleteAccountCopy((k) =>
  t.formatMessage({ id: `account.delete.${k}` }),
);
const exportCopy = buildExportCopy((k) =>
  t.formatMessage({ id: `account.export.${k}` }),
);
```

(`t` is the file's `useIntl()` handle.)

- [ ] **Step 4: Typecheck the three surfaces**

Run: `pnpm --filter @indiecrafts/web-surfaces-website --filter @indiecrafts/web-surfaces-app --filter @indiecrafts/hybrid-surfaces-main tsc`
Expected: PASS.

- [ ] **Step 5: Confirm no hand-assembly remains (web + hybrid)**

Run: `grep -rn ": DeleteAccountCopy = {\|: ExportCopy = {" code/projects/web/surfaces/website code/projects/web/surfaces/app code/projects/hybrid`
Expected: no matches.

- [ ] **Step 6: Commit**

```bash
git add -A code/projects/web/surfaces/website code/projects/web/surfaces/app code/projects/hybrid/surfaces/main
git commit -m "refactor(website,app,hybrid): assemble account copy via the compliance builders"
```

---

### Task 8: Mobile account screen + `ConsentPreferences` + move delete/export off sign-in

**Files:**

- Create: `code/projects/mobile/surfaces/main/app/account.tsx`
- Modify: `code/projects/mobile/surfaces/main/app/sign-in.tsx` (remove delete/export from `SignedInView`; link to `/account`)
- Modify: `code/projects/mobile/surfaces/main/app/index.tsx` (add an account entry when signed in)
- Verify: `code/projects/mobile/surfaces/main/messages/en.json` has `consent.categories.*`, `consent.preferencesTitle`, `consent.save` (used by the consent panel — add if missing, mirroring hybrid's keys) and `account.*` (already present per sign-in.tsx).

**Interfaces:**

- Consumes: `DeleteAccountSection`, `ExportSection`, `ConsentPreferences`, `createNativeStore`, `buildDeleteAccountCopy`, `buildExportCopy` from `@indiecrafts/packages-shared-compliance/native`; `resolveCategories`, `rejectAllChoices`, `DEFAULT_CONSENT_CATEGORIES`, `type ConsentRecord` from `.../compliance/shared`; `STORAGE_KEYS`, `policyVersion`, `features` from `@/config`.

- [ ] **Step 1: Confirm the consent message keys exist on mobile**

Run: `grep -n "consent.categories\|consent.preferencesTitle\|consent.save\|consent.saved" code/projects/mobile/surfaces/main/messages/en.json`
If absent, add them to `messages/en.json` + `fr.json`, mirroring hybrid's `messages` (`consent.categories.{necessary,analytics,marketing}.{title,description}`, `consent.preferencesTitle`, `consent.save`).

- [ ] **Step 2: Create the account screen** (mirrors hybrid's `CookiePreferencesSection` + `SignedInView`, native idioms)

`code/projects/mobile/surfaces/main/app/account.tsx`:

```tsx
import { useEffect, useState, useSyncExternalStore } from "react";
import { useRouter } from "expo-router";
import { useIntl } from "react-intl";
import { useAuth } from "@clerk/clerk-expo";
import {
  Screen,
  ThemedText,
  Button,
  Card,
} from "@indiecrafts/packages-mobile-ui-native";
import {
  DeleteAccountSection,
  ExportSection,
  ConsentPreferences,
  createNativeStore,
  buildDeleteAccountCopy,
  buildExportCopy,
} from "@indiecrafts/packages-shared-compliance/native";
import {
  DEFAULT_CONSENT_CATEGORIES,
  resolveCategories,
  rejectAllChoices,
  type ConsentRecord,
} from "@indiecrafts/packages-shared-compliance/shared";
import { STORAGE_KEYS, policyVersion, features } from "@/config";

const consentStore = createNativeStore<ConsentRecord>(
  STORAGE_KEYS.cookieConsent,
);

export default function AccountScreen() {
  const t = useIntl();
  const router = useRouter();
  const { signOut, getToken } = useAuth();
  const apiUrl = process.env.EXPO_PUBLIC_API_URL ?? "";

  const record = useSyncExternalStore(
    consentStore.subscribe,
    consentStore.get,
    consentStore.get,
  );
  const [choices, setChoices] = useState<Record<string, boolean>>(() =>
    rejectAllChoices(DEFAULT_CONSENT_CATEGORIES),
  );
  useEffect(() => {
    if (record) setChoices(record.choices);
  }, [record]);

  const cat = (key: string) => ({
    title: t.formatMessage({ id: `consent.categories.${key}.title` }),
    description: t.formatMessage({
      id: `consent.categories.${key}.description`,
    }),
  });
  const categories = resolveCategories(DEFAULT_CONSENT_CATEGORIES, {
    necessary: cat("necessary"),
    analytics: cat("analytics"),
    marketing: cat("marketing"),
  });

  const deleteCopy = buildDeleteAccountCopy((k) =>
    t.formatMessage({ id: `account.delete.${k}` }),
  );
  const exportCopy = buildExportCopy((k) =>
    t.formatMessage({ id: `account.export.${k}` }),
  );

  return (
    <Screen>
      <Card style={{ margin: 24, marginTop: 96, gap: 16 }}>
        <ThemedText variant="title">
          {t.formatMessage({ id: "account.title" })}
        </ThemedText>

        <ThemedText variant="muted">
          {t.formatMessage({ id: "consent.preferencesTitle" })}
        </ThemedText>
        <ConsentPreferences
          categories={categories}
          choices={choices}
          onChange={(key, value) => setChoices((c) => ({ ...c, [key]: value }))}
        />
        <Button
          label={t.formatMessage({ id: "consent.save" })}
          onPress={() =>
            consentStore.save({ v: policyVersion, t: Date.now(), choices })
          }
        />

        {features.exportAccount && apiUrl ? (
          <ExportSection
            copy={exportCopy}
            apiUrl={apiUrl}
            getToken={() => getToken()}
          />
        ) : null}
        {features.deleteAccount && apiUrl ? (
          <DeleteAccountSection
            copy={deleteCopy}
            apiUrl={apiUrl}
            getToken={() => getToken()}
            onDeleted={async () => {
              await signOut();
              router.replace("/");
            }}
          />
        ) : null}
      </Card>
    </Screen>
  );
}
```

NOTE: verify `createNativeStore`'s consent-record generic + the `ConsentRecord` field shape against `native/store.ts` and the `consent.ts` `ConsentRecord` type (the hybrid `consent-preferences.tsx` uses `{ v, t, choices }`); adjust the `save({...})` object to match the real `ConsentRecord` fields. `account.title` must exist in mobile `messages` — add it (e.g. "Account") if missing.

- [ ] **Step 3: Strip delete/export from `sign-in.tsx`'s `SignedInView`, link to /account**

In `sign-in.tsx`: remove the two inline copy objects, the `ExportSection`/`DeleteAccountSection` JSX, and the now-unused imports (`DeleteAccountSection`, `ExportSection`, `type DeleteAccountCopy`, `type ExportCopy`, `features`, `apiUrl`, the `@debt SECURITY` comment). Keep the sign-out + continue buttons; add an account link:

```tsx
<Button
  variant="outline"
  label={t.formatMessage({ id: "account.title" })}
  onPress={() => router.push("/account")}
/>
```

- [ ] **Step 4: Add an account entry from home when signed in**

In `app/index.tsx`, inside the signed-in branch (wrap with Clerk's `SignedIn` if not already), add a button/link `onPress={() => router.push("/account")}` labelled `account.title`. Read the file first to match its existing button/nav idiom.

- [ ] **Step 5: Typecheck mobile**

Run: `pnpm --filter @indiecrafts/mobile-surfaces-main tsc`
Expected: PASS.

- [ ] **Step 6: Confirm no hand-assembly remains on mobile**

Run: `grep -rn ": DeleteAccountCopy = {\|: ExportCopy = {" code/projects/mobile`
Expected: no matches.

- [ ] **Step 7: Commit**

```bash
git add -A code/projects/mobile/surfaces/main
git commit -m "feat(mobile): dedicated account screen with cookie prefs + delete/export"
```

---

### Task 9: Full verification + docs + changelogs

**Files:**

- Modify: `code/packages/CHANGELOG.md`
- Modify: `code/projects/web/surfaces/website/CHANGELOG.md`, `.../app/CHANGELOG.md`, `.../mobile/surfaces/main/CHANGELOG.md`, `.../hybrid/surfaces/main/CHANGELOG.md`
- Modify: `code/docs/packages/system-pages.md`, `code/docs/packages/compliance-shared.md` (new exports)

- [ ] **Step 1: Full workspace gates**

Run: `pnpm tsc` — PASS on all surfaces.
Run: `pnpm test` — PASS (includes the new `account-copy.test.ts`).
Run: `pnpm check:typed-routing && pnpm check:api-guards && pnpm check:tasks` — all green.

- [ ] **Step 2: Website build + e2e (the live site was touched)**

Run: `pnpm --filter @indiecrafts/web-surfaces-website build`
Run: `pnpm --filter @indiecrafts/web-surfaces-website e2e` (if the e2e env/secrets are available locally; otherwise note CI covers it).
Expected: PASS / builds every route × locale.

- [ ] **Step 3: Grep for orphans**

Run: `grep -rn "useOnlineStatus\|OfflineBanner" code/projects --include=*.ts --include=*.tsx | grep -v node_modules | grep -v system-pages`
Expected: only import lines pointing at `@indiecrafts/packages-shared-system-pages/{web,native}` + mobile's `useNetworkStatus` — no local hook/banner definitions.

- [ ] **Step 4: Docs**

Update `code/docs/packages/system-pages.md` (add `useOnlineStatus` + `OfflineBanner` to the web/native exports) and `code/docs/packages/compliance-shared.md` (add `buildDeleteAccountCopy`/`buildExportCopy` + the moved types). Add sidebar lines only if a new page was created (none here — edits only).

- [ ] **Step 5: Changelogs**

- `code/packages/CHANGELOG.md`: the `system-pages` offline hook+banner extraction + the `compliance` copy-builder / type move.
- website/app/hybrid/mobile changelogs: each surface's repoint (offline brick + copy-builder); mobile also the new account screen + ConsentPreferences wiring.

- [ ] **Step 6: Commit**

```bash
git add code/packages/CHANGELOG.md code/projects/**/CHANGELOG.md code/docs/packages/system-pages.md code/docs/packages/compliance-shared.md
git commit -m "docs(compliance,system-pages): document offline + account-copy exports; changelogs"
```

---

## Self-Review notes (author)

- **Spec coverage:** offline extraction (Tasks 1-5) · copy-builder + type move (Tasks 6-7) · mobile account screen + ConsentPreferences (Task 8) · deferred agent→app (not in plan, per spec Non-goals) · verification/docs/changelogs (Task 9). All spec sections covered.
- **Message-key drift risk (spec):** handled by the read-first steps (2.1, 4.1, 7.1, 8.1) that confirm each surface's keys before repointing, and the "add if missing" fallbacks.
- **Type consistency:** `buildDeleteAccountCopy`/`buildExportCopy` signatures and the 10-/6-field shapes are identical in Task 6 (definition), Task 7 + Task 8 (consumers).
- **Native validation limit:** Tasks 3/5/8 end at `tsc` — mobile/hybrid have no host here; on-device is the developer's (stated in Global Constraints).
