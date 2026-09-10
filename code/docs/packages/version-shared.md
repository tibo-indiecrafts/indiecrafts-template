# `@indiecrafts/packages-shared-version` — the portable version-check core

The tiny, platform-agnostic core every shell's "new version available" prompt shares.
Lives in **`code/packages/shared/version`**, consumed as source. **Zero `react`/`next`**
— the poll mechanism is per-platform; this brick is just the compare + the response shape.

Extracted so the `app` web surface and the Expo shell both detect a
new deploy the same way, and [`@indiecrafts/packages-web-version`](./version) (the web hook +
`UpdatePrompt`) re-exports the compare instead of inlining it.

## Exports

| Export                               | What it is                                                                                                                                                    |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `isUpdateAvailable(current, latest)` | `true` when the live id is known and differs from this bundle's `current`. **String identity** — a deploy stamps a new id (commit sha / version), NOT semver. |
| `VersionResponse`                    | The `/api/version` response shape — `{ version?: string; commit?: string }`.                                                                                  |
| `versionId(res)`                     | The live deploy's id from a response — `commit` (sha) preferred, else `version`, else `null`.                                                                 |
| `VERSION_ENDPOINT`                   | The conventional endpoint path a shell polls (`/api/version`).                                                                                                |

## How each surface uses it

- **`app`** (Next) — adopts the web hook `useVersionCheck` + `UpdatePrompt` verbatim, backed by its own `/api/version` route + a `build-info.ts` stamp (`scripts/version.mjs` in `build:cf`). The DOM poll (`visibilitychange`/`online`) lives in the hook.
- **mobile** (Expo/RN) — an `AppState`-`"active"`-driven fetch-poll of a hosted `/api/version`, reusing `isUpdateAvailable`/`versionId`, rendering a native banner. **Ceiling:** `expo-updates`/EAS OTA is unwired, so the banner nudges to restart/update rather than reloading.

## Gotcha — string identity, not semver

The compare never parses versions. A deploy id (`buildInfo.commit`, a git sha) is opaque:
any change means "a different build shipped." Bumping the version number is one way to change
it; a new commit is another. Don't reach for semver here — the endpoint returns whatever id the
deploy baked, and equality is the whole test.

## Wiring & conventions

Explicit per-file `.` export (no wildcard subpath) → **no tsconfig `paths` entry** needed;
consumers wire only `transpilePackages` (web) + a `workspace:*` dep. Full shape → **[Packages
overview](./)**.

- [`code/packages/shared/version/`](../../code/packages/shared/version/) — the source
- [`code/packages/_registry.md`](../../code/packages/_registry.md) — roster + rule
