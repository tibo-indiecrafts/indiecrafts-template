# @indiecrafts/packages-web-email — transactional email

**Stack:** TypeScript · Resend REST (no SDK) · Sanity v5. The home for the shared HTML email **layout**, the **render contract**, and the **`emailStrings` content entity** — one branded, mail-client-safe, editor-configurable system for all outbound mail. **It owns no templates** — each email template lives with the feature that sends it.

Auto-loads under `code/packages/web/email/**`. Consumed as source via `transpilePackages`. Three subpaths keep the pure send/render separate from the Sanity/Studio side:

- **`@indiecrafts/packages-web-email`** (`.`, deps: config + ui-tokens for the palette hex)
  - `resend.ts` — `sendEmail({ from, to, cc?, bcc?, replyTo?, subject, text, html? })`. `import "server-only"`; one `fetch` to `https://api.resend.com/emails`; reads `RESEND_API_KEY` (never `NEXT_PUBLIC_`). Throws on missing key / non-2xx — callers treat sending as **best-effort**.
  - `layout.ts` — `renderEmailLayout({ title, preheader?, contentHtml, lang? })` → a full, table-based, inline-styled document (only technique email clients render reliably). `escapeHtml(value)` — **always escape user values**. The palette (`theme.ts` `EMAIL_COLORS`) is the **design tokens resolved to inline hex** (`@indiecrafts/packages-shared-ui-tokens/native`, light) — mail clients strip `var()`/CSS, so email inlines the generated token hex (same bridge as the PWA manifest + React Native). Edit `tokens.json` → `pnpm tokens:build`, never the email hex. (One exception: the moderation "approve" green — no success token.)
  - **No templates here.** Each email template — `render<Name>Email(input) => { subject, text, html }` from **plain, resolved strings** (no Sanity/module types) — lives in the owning feature's `src/emails/<name>.ts` (blog · newsletter · waitlist), importing `renderEmailLayout`/`escapeHtml`/`RenderedEmail` from this brick. The brick owns the shared SYSTEM (send · layout · render contract · Sanity group factories) and names no feature. Today: `comment-notification` · `newsletter-confirm` · `newsletter-notification` · `waitlist-confirm` · `waitlist-notification` · `lead-magnet`.
- **`@indiecrafts/packages-web-email/sanity`** — Studio-side (`sanity`/`@sanity/ui`/`@sanity/icons`):
  - `emailSanity(modules)` — builds the `emailStrings` singleton (+ its "E-mails" desk) from every module's `emailGroups`. **Field-less on its own** — the brick names no module. App wires `emailSanity(allModules)` into a `composeStudio([...])` group in `sanity.config.ts`.
  - `confirmationGroup(…)` / `ownerAlertGroup(…)` — the two group factories a module uses in its `src/sanity/email.ts` (subscriber-facing translated vs internal alert). Both carry a `bcc` field.
  - `sendTestEmailAction` — the "Envoyer un test" document action on `emailStrings` (wired via `document.actions` in `sanity.config.ts`); POSTs `/api/emails/test`.
- **`@indiecrafts/packages-web-email/strings`** — `getEmailStrings()` (React-`cache`d read of the singleton) + `pick(localeValue, locale)`. `import "server-only"`; used by the senders.

**Split of concerns:** the entity holds _what an email says + who gets it_ (translated where it's visitor-facing); the templates hold _how it looks_; the feature (blog/newsletter/waitlist) reads config/Sanity and passes resolved strings. A module never imports another module for copy. **Each module owns its email group** (`emailGroups` in its `SanityModule` barrel) — the brick provides the factories, never the module-specific config.

**Adding an email:** add a group with a factory in the owning module's `src/sanity/email.ts` (exported as `emailGroups`) → a `render<Name>Email` template in that module's `src/emails/<name>.ts` (imports `renderEmailLayout` from this brick) → the feature reads `getEmailStrings()` + `sendEmail` → add its render to `buildSamples` in `/api/emails/test` so "Send test" covers it.

Depends on `@indiecrafts/packages-shared-config` + `@indiecrafts/packages-web-sanity`. Never imports an app or a module.

Full reference → [`code/docs/packages/email.md`](../../../../docs/packages/email.md).
