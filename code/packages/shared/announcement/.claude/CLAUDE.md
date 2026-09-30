# `@indiecrafts/packages-shared-announcement` — portable announcement core

Auto-loads under `code/packages/shared/announcement/**`. The React/Next-free core every surface's
announcement shares — the resolved types, the single resolve path (live-window + surface targeting +
localize + link + version hash + CDN image URL), and the two GROQ strings. Imported by the Next server
readers (`packages-web-announcement`) AND the bare `code/shared/api` Worker (its public `GET /v1/announcements` feeds the `app`
surface — `AnnouncementChrome`). Area rules → `../../../.claude/CLAUDE.md`.

**Stack:** TypeScript — no `react`/`next`/`next-sanity`. One dep: `@indiecrafts/packages-shared-config` (locales).

- **Exports:** `.` — `SURFACES`/`Surface` · `resolveBanner`/`resolveToast` · `bannerQuery`/`toastQuery` · the `Banner`/`Toast`/`AnnouncementPayload` types.
- **Admin is NOT a surface** — `SURFACES = ["website","app"]` by product decision (the Capacitor shell shows `app`).
- **One resolve, two entry points** — the Next readers and the Worker both call `resolveBanner`/`resolveToast`; never re-implement the transform in a caller.
- **Empty/unset `surfaces` = every surface**; a non-empty list gates by membership. Empty banner `items` / a `null` toast = show nothing.
- **Explicit `.` export (no wildcard)** → no `tsconfig` `paths` entry; consumers wire only `transpilePackages` + a `workspace:*` dep (the Worker just needs the dep).

Full reference → [`code/docs/packages/shared/announcement.md`](../../../../docs/packages/shared/announcement.md).
