Announcement / discount strip under the site nav. Rotates through multiple items
(a single item is static), each with a message, an optional click-to-copy discount
code, and an optional link — an internal path (the app's i18n `Link`) or an external
URL with a target.

Non-fixed: it sits at the top of `<main>`, so page content flows below it and a
dismiss reclaims the space by unmounting (no offset math). Editor content is the
`announcementBar` Sanity singleton, read by `getAnnouncement`; the layout renders the
bar **only** when there are live items (the enable toggle + the schedule window) and
the deposited `announcement-ack` cookie ≠ the current `version` — decided server-side,
so no flash. Copy comes in as props (i18n-agnostic).
