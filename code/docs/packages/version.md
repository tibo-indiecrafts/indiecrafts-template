# Version-update prompt

Tells a visitor a **new version shipped while their tab was open**, and offers a one-click reload.
Lives in the **`@indiecrafts/packages-web-version`** brick (`code/packages/web/version`), consumed as source.
i18n-agnostic (copy comes in as props, like `system-pages`), so any app reuses it.

> **Portable compare split out.** The version comparison — `isUpdateAvailable(current, latest)`
> (string identity, not semver) + the `VersionResponse` shape + `versionId` + `VERSION_ENDPOINT` —
> now lives in **[`@indiecrafts/packages-shared-version`](./version-shared)**, so the Expo shell
> reuses it. This web brick re-exports `isUpdateAvailable` and its
> hook/component build the DOM poll on top.

The app is OpenNext/Cloudflare — **no service worker** — so detection is a small `no-store` poll of a
version endpoint, compared to the build id baked into the running bundle. An old tab polling the live
worker sees the mismatch.

## Exports

| Import                                      | What it is                                                                                                                                                                                                                 |
| ------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `useVersionCheck` (`./use-version-check`)   | `"use client"` hook. `{ current, endpoint = "/api/version", intervalMs = 15min }` → `{ updateAvailable, latest }`. Polls on mount, on the interval, and on tab-focus / network-back (people leave tabs open for days).     |
| `UpdatePrompt` (`./update-prompt`)          | `"use client"` self-contained banner (no `<Toaster>` needed) — fixed bottom, token-styled, `role="status"` + `aria-live`. Props: `current, message, reloadLabel, dismissLabel, endpoint?, intervalMs?, reloadOnNavigate?`. |
| `isUpdateAvailable` (`./use-version-check`) | Re-exported from [`packages-shared-version`](./version-shared) — the string-identity compare the hook uses (`latest !== null && latest !== current`). One import surface for web consumers.                                |

## How detection works

1. `build:cf` runs `scripts/version.mjs`, which bakes `src/lib/build-info.ts` (`{ version, branch, commit, buildTime }`) at build time — each deploy gets its own id.
2. The app serves `GET /api/version` (`no-store`) returning the **live** deploy's `{ version, commit }`.
3. `useVersionCheck({ current: buildInfo.commit })` polls that endpoint and reports `updateAvailable` when the served id differs from `current`.
4. In dev, `buildInfo.commit` is the `"unknown"` placeholder and the endpoint returns the same → `current === latest` → no false prompt.

Two update paths, never a forced reload: the **Reload** button, and — the safe one — an **automatic
reload on the next navigation** (`reloadOnNavigate`, default on): a natural break with no unsaved-input
risk.

## Copy is in Sanity (no fallback)

The banner text is edited per language in Sanity — `siteMeta.<locale>.versionPrompt`
(`message` · `reload` · `dismiss`), read by `getVersionPrompt` (`src/lib/system-pages.ts`). There is
**no `messages` fallback**: the layout mounts `<UpdatePrompt>` only when all three strings are present,
so an unset banner is simply off. Studio → SEO par langue → Pages système → Bandeau « nouvelle version ».

## Wiring an app

```tsx
// app/[locale]/layout.tsx
import { UpdatePrompt } from "@indiecrafts/packages-web-version/update-prompt";
import { getVersionPrompt } from "@/lib/system-pages";
import { buildInfo } from "@/lib/build-info";

const versionPrompt = await getVersionPrompt(locale);
{
  versionPrompt.message && versionPrompt.reload && versionPrompt.dismiss ? (
    <UpdatePrompt
      current={buildInfo.commit}
      message={versionPrompt.message}
      reloadLabel={versionPrompt.reload}
      dismissLabel={versionPrompt.dismiss}
    />
  ) : null;
}
```

Plus the endpoint (`app/api/version/route.ts`, `no-store`, returns `buildInfo`) and a `@source` line in
`ui-tokens/globals.css` (the banner renders token classes — done for the web app).

## Deps

`@indiecrafts/packages-web-ui` (`Button`) · `@indiecrafts/packages-shared-utils` (`cn`). Peer `react`/`react-dom`/`next`
(`usePathname`). Never imports an app or a module.
