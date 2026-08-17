# @indiecrafts/email — transactional email

**Stack:** TypeScript · Resend REST (no SDK) · Sanity v5. The home for the shared HTML email **layout**, **every email template**, and the **`emailStrings` content entity** — one branded, mail-client-safe, editor-configurable system for all outbound mail.

Auto-loads under `code/packages/email/**`. Consumed as source via `transpilePackages`. Three subpaths keep the pure send/render separate from the Sanity/Studio side:

- **`@indiecrafts/email`** (`.`, pure — deps: config only)
  - `resend.ts` — `sendEmail({ from, to, cc?, bcc?, replyTo?, subject, text, html? })`. `import "server-only"`; one `fetch` to `https://api.resend.com/emails`; reads `RESEND_API_KEY` (never `NEXT_PUBLIC_`). Throws on missing key / non-2xx — callers treat sending as **best-effort**.
  - `layout.ts` — `renderEmailLayout({ title, preheader?, contentHtml, lang? })` → a full, table-based, inline-styled document (only technique email clients render reliably). `escapeHtml(value)` — **always escape user values**. Palette hex is inlined on purpose (oklch tokens never reach an inbox — same exception as the PWA manifest).
  - `templates/<name>.ts` — one file per email; `render<Name>Email(input) => { subject, text, html }` from **plain, resolved strings** (no Sanity/module types). Today: `comment-notification` · `newsletter-confirm` · `newsletter-notification` · `waitlist-confirm` · `waitlist-notification`.
- **`@indiecrafts/email/sanity`** — Studio-side (`sanity`/`@sanity/ui`/`@sanity/icons`):
  - `emailSanity(modules)` — builds the `emailStrings` singleton (+ its "E-mails" desk) from every module's `emailGroups`. **Field-less on its own** — the brick names no module. App wires `emailSanity(allModules)` into a `composeStudio([...])` group in `sanity.config.ts`.
  - `confirmationGroup(…)` / `ownerAlertGroup(…)` — the two group factories a module uses in its `src/sanity/email.ts` (subscriber-facing translated vs internal alert). Both carry a `bcc` field.
  - `sendTestEmailAction` — the "Envoyer un test" document action on `emailStrings` (wired via `document.actions` in `sanity.config.ts`); POSTs `/api/emails/test`.
- **`@indiecrafts/email/strings`** — `getEmailStrings()` (React-`cache`d read of the singleton) + `pick(localeValue, locale)`. `import "server-only"`; used by the senders.

**Split of concerns:** the entity holds _what an email says + who gets it_ (translated where it's visitor-facing); the templates hold _how it looks_; the feature (blog/newsletter/waitlist) reads config/Sanity and passes resolved strings. A module never imports another module for copy. **Each module owns its email group** (`emailGroups` in its `SanityModule` barrel) — the brick provides the factories, never the module-specific config.

**Adding an email:** add a group with a factory in the owning module's `src/sanity/email.ts` (exported as `emailGroups`) → a `templates/<name>.ts` (re-export the render fn from `src/index.ts`) → the feature reads `getEmailStrings()` + `sendEmail` → add its render to `buildSamples` in `/api/emails/test` so "Send test" covers it.

Depends on `@indiecrafts/config` + `@indiecrafts/sanity`. Never imports an app or a module.

Full reference → [`docs/packages/email.md`](../../../../docs/packages/email.md).
