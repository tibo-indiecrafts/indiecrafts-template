# `@indiecrafts/packages-shared-announcement` — the portable announcement core

The React/Next-free core every surface's announcements share. Lives in
**`code/packages/shared/announcement`**, consumed as source. Extracted so the Next server
readers ([`@indiecrafts/packages-web-announcement`](./announcement)) **and** the bare
`code/shared/api` Worker run the **same** resolve logic — no duplication, and the web brick
stays web-only.

One dependency (`@indiecrafts/packages-shared-config`, for the locale set); no
`react`/`next`/`next-sanity`.

## Exports

| Export                                    | What it is                                                                                                                                                     |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SURFACES` / `Surface`                    | The targetable surfaces — `["website","app","mobile","hybrid"]`. **Admin is not a surface** (product decision).                                               |
| `resolveBanner(raw, {locale, surface})`   | The banner transform: enable + date-window "live now", surface targeting (empty list = all), localize, resolve links, hash a `version`. Returns an empty banner when nothing is live. |
| `resolveToast(raw, {locale, surface})`    | The toast transform: same gates + title/body/optional CDN-sized image URL/link + editor `autoDismissSeconds`→`autoDismissMs`. Returns `null` when nothing is live. |
| `bannerQuery` / `toastQuery`              | The two GROQ strings (plain strings — no `defineQuery`, so the Worker can build one combined query).                                                          |
| `fetchAnnouncements(baseUrl, {locale, surface})` | The client read of the Worker's `GET /v1/announcements` — isomorphic, never throws, `null` when the URL is unset or unreachable.                       |
| `Banner` · `Toast` · `AnnouncementPayload` · `AnnouncementLink` | The resolved shapes (`AnnouncementPayload = { banner, toast }`).                                                                          |

## Two entry points, one resolve

```
Sanity (announcementBar + announcementToast)
  ├── website (Next, public)   → web client.fetch → resolveBanner/resolveToast (server, no flash)
  └── app · mobile · hybrid     → api Worker GET /v1/announcements → resolveBanner/resolveToast → JSON
        (client-gated by <SignedIn>, so they fetch the Worker; no server-render benefit)
```

- **`version` hash** — the resolved content is hashed so a NEW announcement re-shows after a
  prior dismiss (the dismiss store records the last-closed version per surface).
- **Image** — the resolver returns a CDN-sized URL (`?w=128&auto=format&fit=max&q=75`); a raw
  `<img>` with those explicit params is compliant (`rules/sanity-images.md`).

## Consumers

`website` + `app` (via `web-announcement` readers/components) · `code/shared/api` Worker · the
`mobile`/`hybrid` shells (types + `fetchAnnouncements`). Tests: `src/resolve.test.ts`.
