# Newsletter module — CLAUDE.md

**Stack:** Sanity v5 · TypeScript · `@indiecrafts/sanity/write` (server-only) · `@indiecrafts/email`. The newsletter feature — subscribe engine + subscriber data + settings singleton + double opt-in.

Auto-loads under `code/modules/newsletter/**`. Feature-flagged by `features.newsletter` (app-owned in `@/config`, injected into the module — see below).

- **No provider adapters.** The engine **always stores** a `subscriber` doc in Sanity (read/export in Studio). To use an external ESP, the editor drops that service's own embed form in a `custom-html` block — it posts to the provider directly, never touching this path (add the provider host to `EMBED_HOSTS` in `next.config.ts`).
- `src/lib/newsletter.ts` — the subscribe engine: validate → dedupe → write (`writeClient`). On a new subscriber, two **best-effort** emails may fire (never throw): a double opt-in confirmation → the subscriber, and an owner alert. `subscribe()`. Feature-gating is the **app's** job (`features` is app-owned): the `/api/newsletter*` routes gate on `features.newsletter`, and `newsletterSanity(enabled)` hides the desk — the module reads no central flag.
- `src/lib/confirm.ts` — `confirmSubscriber(token)`: flips a `pending` subscriber to `confirmed` via its one-time `confirmToken`, then clears it (single-use). Called by `/api/newsletter/confirm`.
- **Email config + copy** live on the shared `emailStrings` singleton (Studio → **E-mails**), owned by `@indiecrafts/email` — `newsletterConfirm` (translated) + `newsletterOwner`. Read via `getEmailStrings()` from `@indiecrafts/email/strings`; the only secret is `RESEND_API_KEY`.
- `src/lib/settings.ts` — `getNewsletterSettings()` (React-`cache`d) reads the editor-configurable `newsletterSettings` singleton (form copy + `enabled`).
- `src/sanity/` — the `newsletterSettings` singleton + `subscriber` doc + the desk (`newsletterStructure`), exported as the `newsletterSanity` **`SanityModule`** barrel (`src/sanity/index.ts`). Activate = one line in `composeSanity([...])`.
- The public **form is a page-builder block** (`module.newsletter` schema in the blog, renderer in `@indiecrafts/ui-components`) that POSTs `/api/newsletter` (a thin app route → this module's engine). The block stays in the page-builder by design; this module owns the feature's data + logic + config.
