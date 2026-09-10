# @indiecrafts/packages-shared-version — portable version-check core

Auto-loads under `code/packages/shared/version/**`. The tiny, platform-agnostic core every shell's
"new version available" prompt shares — the compare plus the `/api/version` response shape. The poll
mechanism stays per-platform; this brick is just the logic. Serves the `app` web surface and the
Expo shell. Area rules → `../../../.claude/CLAUDE.md`.

**Stack:** TypeScript, zero-dep — no `react`/`next`; pure compare + shape.

- **Exports:** `.` — `isUpdateAvailable(current, latest)` · `versionId(res)` · `VersionResponse` · `VERSION_ENDPOINT`.
- **String identity, not semver** — a deploy stamps a new opaque id (commit sha / version); equality is the whole test, never parse versions.
- **The web hook + `UpdatePrompt` live in `packages-web-version`** and re-export this compare — don't inline the logic there.
- **Explicit per-file `.` export (no wildcard)** → no `tsconfig` `paths` entry; consumers wire only `transpilePackages` + a `workspace:*` dep.

Full reference → [`code/docs/packages/version-shared.md`](../../../../docs/packages/version-shared.md).
