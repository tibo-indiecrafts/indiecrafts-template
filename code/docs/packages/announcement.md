# Announcement bar

Editor-managed announcement / discount strip under the site nav. Lives in the
**`@indiecrafts/announcement`** brick (`code/packages/web/announcement`) — a Sanity singleton

- a small client strip, like `@indiecrafts/consent` / `version`. Site chrome, not a
  product feature.

## Content (Sanity)

The `announcementBar` singleton (Studio → **Bandeau d'annonce**), read by
`getAnnouncement(locale)` (`@indiecrafts/announcement/sanity/announcement`):

| Field           | What it is                                                                                                                                                                               |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `enabled`       | Editor on/off — pull a promo without a deploy.                                                                                                                                           |
| `dismissible`   | Whether the × shows.                                                                                                                                                                     |
| `variant`       | `brand` / `neutral` / `contrast` — the strip style.                                                                                                                                      |
| `start` / `end` | Optional schedule window (bar-wide).                                                                                                                                                     |
| `items[]`       | The announcements — each `message` (`localeString`) + optional `discountCode` (click-to-copy) + optional `link` (internal path **or** external URL + target) + optional per-item window. |

The reader computes "live now" (enable + windows), localizes, resolves each link, and
hashes the live items into a `version`.

## Behaviour

- **Rotating** — multiple live items cycle on a gentle interval (single item = static).
- **Under the nav, no offset math** — a normal-flow strip at the top of `<main>`; a
  dismiss reclaims the space by unmounting.
- **No flash** — `DefaultLayout` reads the `announcement-ack` cookie server-side and
  renders the bar only when there are live items and the deposited version ≠ the current
  one. A new announcement (new `version`) re-shows after a prior dismiss.
- **Discount code** — a click-to-copy chip.

## Wiring

`announcementSanity` → the `sharedModules` array in `sanity.config.ts` (one line). Mounted
in `DefaultLayout` at the top of `<main>`; `@source "../../announcement/src"` in
`ui-tokens/globals.css`; `transpilePackages` + the app dep. Seed ships two demo items.

## Deps

`@indiecrafts/ui` · `@indiecrafts/i18n` (`Link`) · `@indiecrafts/sanity` (`client`) ·
`@indiecrafts/utils` (`cn`) · `@indiecrafts/config` (`site.prefix`). Story:
`AnnouncementBar.stories.tsx` (Storybook › Chrome).
