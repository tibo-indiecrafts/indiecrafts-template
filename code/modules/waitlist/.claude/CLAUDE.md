# Waitlist module — CLAUDE.md

**Stack:** Sanity v5 · TypeScript · `@indiecrafts/sanity/write` (server-only) · `@indiecrafts/email`. Early-access signups — join engine + entry data + settings singleton. Modeled on `@indiecrafts/newsletter`.

Auto-loads under `code/modules/waitlist/**`. Feature-flagged by `features.waitlist` (`@indiecrafts/config`). **Collect + export only** — no runtime gating.

- `src/lib/waitlist.ts` — the join engine: validate → dedupe → write (`writeClient`) a `waitlistEntry` (`status:"waiting"`). On a **new** entry, two **best-effort** emails may fire (never throw): a "you're on the list" confirmation → the joiner, and an owner alert. `join()` + `isWaitlistEnabled()`.
- `src/lib/settings.ts` — `getWaitlistSettings()` (React-`cache`d) reads the editor-configurable `waitlistSettings` singleton (form copy + `enabled`).
- `src/sanity/` — the `waitlistSettings` singleton + `waitlistEntry` doc + the "Liste d'attente" desk, exported as the `waitlistSanity` **`SanityModule`** barrel (`src/sanity/index.ts`). Activate = one line in `composeSanity([...])`. **The entry doc is editor-creatable** (an admin adds rows via the desk's create-enabled "Tous·tes" list), unlike the API-only `subscriber`.
- **Email config + copy** live on the shared `emailStrings` singleton (Studio → **E-mails**) — `waitlistConfirm` (translated) + `waitlistOwner`. Read via `getEmailStrings()`; the only secret is `RESEND_API_KEY`.
- **Two public surfaces**, same `WaitlistForm` (POSTs `/api/waitlist` → `join()`): a **full page** at `/waitlist` (`[locale]/waitlist/page.tsx`, registered in the `pages` map, copy from `waitlistSettings`) **and** a droppable **page-builder block** (`module.waitlist` schema in the blog, renderer in `@indiecrafts/ui-components`, per-instance copy). `WaitlistForm`'s props are the copy subset (`WaitlistFormProps`) so both reuse it. Export: `pnpm waitlist:export` → CSV.
