# Cross-platform parity + dedup — design

**Date:** 2026-09-04
**Status:** approved design → implementation plan
**Scope:** `app` · `website` · `mobile` · `hybrid` surfaces + `system-pages` and `compliance` bricks.

## Problem

The three UI platforms already share the shell through bricks, so mobile and hybrid sit at
~90% parity with the `app` product surface. Three real gaps remain, and two of them are
duplication rather than a missing capability:

1. **Offline banner is triplicated.** The transient online-status banner + its hook live in
   three surfaces, outside any brick: `website` (`src/hooks/useOnlineStatus.ts` +
   `src/user-interface/shared/layout/OfflineBanner.tsx`), `hybrid`
   (`src/renderer/src/useOnlineStatus.ts` + an inline banner in `App.tsx`), and `mobile`
   (`hooks/useNetworkStatus.ts` + `components/OfflineBanner.tsx`). `app` has none.
2. **Delete/export copy-assembly is copied across four surfaces.** Each of `website`, `app`,
   `mobile`, `hybrid` hand-builds the `DeleteAccountCopy` / `ExportCopy` prop objects
   (~40 lines of `formatMessage` mapping) before passing them to the shared
   `DeleteAccountSection` / `ExportSection`.
3. **Mobile has no dedicated account screen.** Its delete/export sit on the sign-in screen,
   and the already-built `ConsentPreferences` native brick is never mounted, so mobile lacks
   the cookie-preferences manage panel that `app` and `hybrid` have.

The user chose **full dedup** — including the live `website` — accepting the regression risk
in exchange for one home per fact.

## Non-goals

- **Agent → app is DEFERRED (YAGNI).** Wiring `agent-client` into `app` adds a dependency +
  a ~15-line `lib/agent.ts` wrapper with no UI that calls it — matching mobile/hybrid, which
  also have caller plumbing but no screen using it. It is parity-of-plumbing, not a feature.
  Not built in this slice; add it when `app` gains an agent screen. (Reviewer at the spec gate
  may flip this to in-scope.)
- No changes to the offline _page_ (`system-pages` `OfflineContent`) — only the transient
  banner + hook are new.
- No new product screens beyond the mobile account screen.

## Design

### 1. Offline → `system-pages` (respecting the ≥2-consumer rule)

Detection is per-platform by design; the ≥2-consumer extraction rule decides what moves:

- **`system-pages/web`** gains two exports, moved **verbatim** from `website` (both are
  already generic — the hook has no app coupling, the banner already takes `message` as a
  prop):
  - `useOnlineStatus(): boolean` — `navigator.onLine` via `useSyncExternalStore`
    (hydration-safe: server snapshot `true`).
  - `OfflineBanner({ message }: { message: string })` — the slim `role="status"`
    `aria-live="polite"` strip.
  - Consumers: **website, app, hybrid** (three DOM runtimes, all currently duplicate this).
- **`system-pages/native`** gains `OfflineBanner({ message }: { message: string })` — the RN
  `View` presentation, adapted from mobile's component.
  - Consumer: **mobile**.
- **Mobile keeps `hooks/useNetworkStatus()` (netinfo) local** — netinfo has a single
  consumer, so extracting it would break the ≥2-consumer rule. It feeds the shared native
  `OfflineBanner`.

`system-pages` is already a dependency (each surface uses `OfflineContent`), so the only
wiring is adding the two components to the `src/web/index.ts` and `src/native/index.ts`
barrels — no new `transpilePackages` / `workspace:*` / tsconfig-paths entries.

**Repoint + delete dead files:**

- website → import from `@indiecrafts/packages-shared-system-pages/web`; delete
  `src/hooks/useOnlineStatus.ts` + `src/user-interface/shared/layout/OfflineBanner.tsx`;
  fix `DefaultLayout.tsx` import.
- hybrid → import from `.../system-pages/web`; delete `src/renderer/src/useOnlineStatus.ts`
  - replace the inline banner in `App.tsx`.
- mobile → import `OfflineBanner` from `.../system-pages/native`; keep `useNetworkStatus`;
  delete `components/OfflineBanner.tsx`; fix `ShellOverlays.tsx`.
- **app (new consumer)** → mount `OfflineBanner` from `.../system-pages/web` in its shell
  (`ShellOverlays`), fed by app's own offline message.

### 2. Delete/export copy-builder → `compliance/shared`

Add two pure functions to `code/packages/shared/compliance/src/shared/` (framework-agnostic,
no React):

```ts
export function buildDeleteAccountCopy(
  t: (key: string) => string,
): DeleteAccountCopy;
export function buildExportCopy(t: (key: string) => string): ExportCopy;
```

`t(relativeKey)` resolves one copy string for a relative key (`"heading"`, `"body"`,
`"emailLabel"`, …). Each surface passes a translator already scoped to its account namespace:
next-intl `useTranslations("<ns>")` (web) or `(k) => intl.formatMessage({ id: "<ns>." + k })`
(react-intl, native).

**Move the copy types down to `shared`.** `DeleteAccountCopy` / `ExportCopy` are today defined
_inside_ `compliance/web` **and** `compliance/native` (two copies). A `shared` builder cannot
return a type owned by `web`/`native` (dependencies point down), so the type definitions move
to `compliance/shared`; `web` and `native` **re-export** them (they already re-export other
shared types), keeping every existing `import { …, type DeleteAccountCopy } from
"…/compliance/web"` call site working. The builders live in `shared` next to the types and are
re-exported from both `web` and `native` barrels for a single import site per surface.

**Repoint** the four hand-assemblies (`website` + `app` `AccountDeletePanel.tsx`, `mobile`
`sign-in.tsx`→account, `hybrid` `auth.tsx`) to the builders. If any surface's message keys
do not already match the relative-key convention, the plan renames them (one home).

### 3. Mobile account screen + ConsentPreferences

- New expo-router route `code/projects/mobile/surfaces/main/app/account.tsx`, mirroring
  `app`'s `/account`. It mounts, for a signed-in user: `DeleteAccountSection` +
  `ExportSection` (copy via `buildDeleteAccountCopy`/`buildExportCopy`) + the
  **`ConsentPreferences` native brick** (currently built but unmounted), wired to the same
  `createNativeStore` consent key the shell already uses (the hybrid
  `consent-preferences.tsx` is the reference pattern).
- Move delete/export **off** `sign-in.tsx`'s `SignedInView`; the signed-in view links to
  `/account`. Add an account entry from mobile home (`app/index.tsx`).
- No new brick — pure composition of existing native bricks.

## Testing

- **compliance:** colocated `build-account-copy.test.ts` — pure, asserts the builders map a
  stub `t` onto every field of `DeleteAccountCopy` / `ExportCopy` (guards a dropped/renamed
  key).
- **system-pages:** a web `OfflineBanner` story (renders offline/online); `useOnlineStatus`
  covered by the existing happy-dom setup if a hook test is cheap, else the story is the gate.
- **tsc:** `turbo run tsc` green on all surfaces — this is how native code is validated here.
- **website:** the build + e2e re-run (the live site was touched).
- **Native runtimes have no host here** — mobile/hybrid are built-to-spec + `tsc`-checked;
  on-device validation (`expo start`, hybrid `dev`) is the developer's.

## Verification

- `pnpm tsc` (all workspaces) + `pnpm test` green.
- `pnpm check:typed-routing` / `check:api-guards` / `check:tasks` still green.
- No `${sitePrefix}.` or hand-built copy objects remain in the four surfaces (grep).
- Dead files deleted (no orphan `useOnlineStatus`/`OfflineBanner` outside the brick).

## Rollout / sequencing (for the plan)

1. **Bricks first, with tests** — system-pages offline exports; compliance copy-builders.
2. **Repoint the three web surfaces** (website, app, hybrid) to the offline brick + builders.
3. **Mobile** — offline banner repoint (keep netinfo), copy-builder, new account screen +
   ConsentPreferences, move delete/export off sign-in.
4. **Delete** the dead per-surface hook/banner files.
5. **Verify** (tsc/test/build) + **docs & changelogs**: `code/packages/CHANGELOG.md`
   (brick changes) + each surface's changelog (wiring) + the `system-pages` /
   `compliance-shared` doc pages (new exports) + their VitePress sidebar lines if any.

## Risks

- **Live website** — the offline banner + account panel are shipped code; the website build +
  e2e are the safety net.
- **Message-key drift** — if a surface's delete/export message keys differ from the
  relative-key convention, the builder needs a per-surface key map or a rename; resolved in
  the plan by reading each surface's `messages/*.json`.
- **netinfo peer** — unchanged: it stays a mobile dep (not moved into the brick), so no new
  brick peer dependency.
