# Announcements — bar + toast

Editor-managed announcements shown across every surface. The **web presentation + Sanity
schema** live in **`@indiecrafts/packages-web-announcement`** (`code/packages/web/announcement`);
the **portable resolve + types + fetch** live in
[`@indiecrafts/packages-shared-announcement`](./announcement-shared) so the Next readers and the
`code/shared/api` Worker share one transform. Two formats:

- **Bar** — the rotating strip under the nav (message + optional copyable discount code + link).
- **Toast** — a richer corner card: title + body + **optional image** + link. Not a sonner toast
  (sonner's own guidance says never auto-dismiss a must-click link) — a self-contained
  `role="status"` card like the version `UpdatePrompt`.

## Content (Sanity)

Two singletons, both with **per-surface targeting** (`surfaces` — empty = all;
`website · app · mobile · hybrid`, **no admin**):

**`announcementBar`** (Studio → **Bandeau d'annonce**) — `enabled` · `dismissible` · `variant`
(`brand`/`neutral`/`contrast`) · `surfaces` · `start`/`end` · `items[]` (each `message` +
optional `discountCode` + optional `link` + per-item window).

**`announcementToast`** (Studio → **Toast d'annonce**) — `enabled` · `surfaces` · `title` · `body`
· optional `image` + `imageAlt` · `link` · `autoDismissSeconds` (empty = persists until closed) ·
`start`/`end`.

Read by `getAnnouncement(locale, surface)` / `getAnnouncementToast(locale, surface)` (thin
adapters over the shared `resolveBanner`/`resolveToast`).

## Delivery per surface

| Surface           | Reads from                         | Gate                          |
| ----------------- | ---------------------------------- | ----------------------------- |
| **website**       | Sanity server-side (no flash)      | public (ungated)              |
| **app** (Next)    | api Worker (client fetch)          | logged-in (`<SignedIn>`), online |
| **mobile** (RN)   | api Worker (client fetch)          | logged-in, online             |
| **hybrid** (Electron) | api Worker (client fetch)      | logged-in, online             |

The three product surfaces gate on **client-side** `<SignedIn>`, so they fetch the Worker (no
server-render benefit); only the public website reads Sanity directly. app reuses the web
`AnnouncementBar`/`AnnouncementToast`; mobile + hybrid render bespoke shells (next-intl can't run
outside Next) — same tokens, `Linking`/`openExternal` for links.

## Behaviour

- **Rotating bar** — multiple live items cycle; a single item is static.
- **No flash (website)** — `DefaultLayout` reads the `announcement-ack` / `announcement-toast-ack`
  cookies server-side and renders only when the deposited version ≠ the current one. The bar/toast
  also self-suppress client-side (`useSyncExternalStore`) so the client-gated surfaces stay
  dismissed across a reload.
- **Re-shows on change** — the resolved content is hashed into a `version`; a new announcement
  re-shows after a prior dismiss.
- **Image** — CDN-sized by the resolver (`?w=128&auto=format&fit=max&q=75`).

## Wiring

`announcementSanity` → `sharedModules` in `sanity.config.ts` (registers both singletons + the two
desk sections). `@source "../../announcement/src"` in `ui-tokens/globals.css`. Web surfaces:
`transpilePackages` + deps (+ a `tsconfig` `paths` entry for the `./*` wildcard). The Worker route +
the api URL env vars (`NEXT_PUBLIC_API_URL` / `EXPO_PUBLIC_API_URL` / `VITE_API_URL`) → see
[the api Worker](../shared/api).

## Deps

`@indiecrafts/packages-shared-announcement` (resolve/types/fetch) · `@indiecrafts/packages-web-ui` ·
`@indiecrafts/packages-web-i18n` (`Link`) · `@indiecrafts/packages-web-sanity` (`client`) ·
`@indiecrafts/packages-shared-utils` (`cn`) · `@indiecrafts/packages-shared-config` (`site.prefix`).
Story: `AnnouncementBar.stories.tsx` (Storybook › Chrome).
