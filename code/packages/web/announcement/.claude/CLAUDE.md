# @indiecrafts/packages-web-announcement — announcement bar + toast (web presentation)

Auto-loads under `code/packages/web/announcement/**`. The Sanity schema + web presentation for
editor-managed announcements — the `announcementBar` (rotating strip) + `announcementToast`
(title/body/optional image/link card) singletons, both **per-surface targetable** (`surfaces`, no
admin). Site chrome; consumed by the website `DefaultLayout` + the `app` shell. Area rules →
`../../../.claude/CLAUDE.md`.

**Stack:** React 19 · Sanity v5 · next-sanity. Deps: shared-announcement (resolve/types/fetch) ·
web-ui · web-i18n · web-sanity · shared-utils · shared-config.

- **The resolve + types + GROQ live in [`@indiecrafts/packages-shared-announcement`](../../shared/announcement)**
  (React/Next-free, shared with the `code/shared/api` Worker). The readers here (`sanity/announcement`)
  are thin adapters: `client.fetch(query)` → `resolveBanner`/`resolveToast`. Don't re-implement the
  transform.
- **Exports:** `./*` → `src/*` (no root `.`) — subpaths: `.../AnnouncementBar`, `.../AnnouncementToast`,
  `.../sanity/announcement`, `.../announcement-store`.
- **`AnnouncementToast` is a self-contained card, NOT sonner** — a must-click link must never
  auto-dismiss (`sonner.md`). `getAnnouncement(locale, surface)` / `getAnnouncementToast(locale, surface)`
  now take a surface.
- **Dismiss** — cookies (`announcement-ack` / `announcement-toast-ack`); the website decides them
  server-side (no flash), and both components also self-suppress client-side (`useSyncExternalStore`) so
  the logged-in surfaces stay dismissed across a reload.
- **Wire** the `announcementSanity` barrel into `sharedModules` in `sanity.config.ts` (both singletons +
  desk sections); add a `@source` line in `ui-tokens/globals.css`; consumers need a `tsconfig paths`
  entry for the `./*` export.

Full reference → [`code/docs/packages/announcement.md`](../../../../docs/packages/announcement.md).
