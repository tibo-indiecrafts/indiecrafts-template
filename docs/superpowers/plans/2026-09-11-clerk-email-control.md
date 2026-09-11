# Clerk Email Control + Support Address Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make every Clerk auth/security email editable in a dedicated Sanity collection, sent by our api (branded, localized, from `no-reply@updates.indiecrafts.dev`) with an editor-owned support address in the footer of **every** transactional email.

**Architecture:** Extend the existing `emails.created` take-over (`code/shared/api/src/clerk-email`) from 4 slugs to the full auth/security set, driven by a **new, separate `clerkEmails` Sanity singleton** (moved out of `emailStrings`). Every rendered email — the 10 website emails, the erasure emails, and the Clerk take-over — flows through the shared `renderEmailLayout`, whose footer now shows the Sanity `supportEmail`. Finally, toggle all Clerk templates `delivered_by_clerk:false` so the take-over actually fires.

**Tech Stack:** Cloudflare Workers (bare) · TypeScript · Sanity v5 (GROQ over HTTP, no client) · Resend REST · Vitest (workerd pool for the api).

**Spec:** none written — this plan is the spec (design agreed in-session; see Global Constraints).

## Global Constraints

- **Never `throw` from a Sanity read** in the api — an unset/unreachable Sanity resolves to `null`/defaults; a mandatory auth email must never be blocked by Studio being down (mirror `fetchAuthEmailStrings`).
- **`renderEmailLayout` is a pure string function** in `@indiecrafts/packages-web-email` — no `server-only`, no DOM, importable in the bare api worker (it already is via `erasure/email.ts`).
- **French Studio legends** on every `defineField` (`.claude/rules/sanity-legends.md`): plain words, say what "empty" does, an example.
- **Sender is `EMAIL_FROM`** (`no-reply@updates.indiecrafts.dev`, a committed `[vars]`) — no info@, no per-email from.
- **The support address is one global value** — `emailStrings.supportEmail` (already added + seeded `support@indiecrafts.dev`), read once per send, passed into `renderEmailLayout`.
- **Escape every interpolated value** in email HTML (`escapeHtml`), including the support address.
- **Tests run in the api's workerd pool** — `pnpm --filter @indiecrafts/shared-api exec vitest run <file>`; website/packages tests via their own filters. Studio schema `defineField`/`defineType` additions are **not** unit-tested (Studio config, per the testing rule) — the render + resolve logic IS.
- **Commit scope:** stage only this feature's files; the working tree carries an unrelated parallel react-doctor WIP (`.claude/settings.json`, `.vscode/tasks.json`, root `package.json`, `.claude/hooks/react-doctor-changed.sh`) — never stage those.
- **No deploy inside tasks.** Deploys + the Clerk template toggles are the final runbook task, done by the controller, not implementers.

---

## File Structure

- `code/packages/web/email/src/layout.ts` — `renderEmailLayout` gains an optional `supportEmail`, rendered in the footer. The one footer for the website + api emails.
- `code/packages/web/email/src/sanity/email-strings.ts` — **DONE** (has the global `supportEmail` field). No change.
- `code/packages/web/email/src/sanity/clerk-emails.ts` — **NEW** — `buildClerkEmails()` + `clerkEmailsStructureItem`: the separate "E-mails Clerk" singleton, one uniform group per Clerk template slug.
- `code/packages/web/email/src/sanity/auth-email-groups.ts` — **REMOVED** — its 4 groups move into `clerkEmails`; the file is deleted and its export dropped from the barrel.
- `code/packages/web/email/src/sanity/index.ts` — export `buildClerkEmails`/`clerkEmailsStructureItem`; drop `authEmailGroups`.
- `code/projects/web/surfaces/website/sanity.config.ts` — register the `clerkEmails` singleton in the "Contenu partagé" group; drop the `authEmailGroups` wiring from `emailSanity(...)`.
- `code/shared/api/src/clerk-email/slugs.ts` — **NEW** — the canonical slug table (all templates), `authKind`→`templateKind`, `KIND_FOR_SLUG`, `SLUG_FOR_KIND`. Extracted from `sanity.ts` and widened.
- `code/shared/api/src/clerk-email/sanity.ts` — read the new `clerkEmails` singleton (all groups), `resolveClerkCopy`, extended kinds. Also surface `supportEmail`.
- `code/shared/api/src/clerk-email/templates.ts` — `AUTH_TEMPLATES` widened to every kind; notification kinds render `intro`+`outro` only. Each template returns a body fragment (unchanged contract).
- `code/shared/api/src/clerk-email/handle.ts` — wrap every rendered fragment (localized AND passthrough) in `renderEmailLayout({ supportEmail })`.
- `code/shared/api/src/erasure/email.ts` — pass `supportEmail` to its `renderEmailLayout` calls; extend `MailEnv`/reader to fetch it.
- The 10 website email templates (waitlist ×2, contact ×2, blog comment, newsletter ×3, compliance data-request) — thread `supportEmail` from their sender into `renderEmailLayout`.
- Docs/changelog: `code/docs/packages/email.md` (**partly DONE**), `code/packages/CHANGELOG.md` (**partly DONE**), `code/shared/api/CHANGELOG.md`.
- Runbook: `code/docs/apps/web/config/clerk-emails.md` — the toggle + webhook + Google-screen steps.

---

### Task 1: `renderEmailLayout` footer shows `supportEmail`

**Files:**

- Modify: `code/packages/web/email/src/layout.ts` (`EmailLayoutInput` type ~L39-48; `renderEmailLayout` footer row ~L86-88)
- Test: `code/packages/web/email/src/layout.test.ts`

**Interfaces:**

- Produces: `renderEmailLayout({ title, preheader?, contentHtml, lang?, supportEmail? }): string` — when `supportEmail` is a non-empty string, the footer gains a line `Besoin d'aide ? <a href="mailto:…">…</a>`; when absent, the footer is unchanged.

- [ ] **Step 1: Write the failing test** — append to `layout.test.ts`:

```ts
it("renders the support address in the footer when given", () => {
  const html = renderEmailLayout({
    title: "T",
    contentHtml: "<p>x</p>",
    supportEmail: "support@indiecrafts.dev",
  });
  expect(html).toContain("mailto:support@indiecrafts.dev");
  expect(html).toContain("support@indiecrafts.dev");
});
it("omits the support line when no address is given", () => {
  const html = renderEmailLayout({ title: "T", contentHtml: "<p>x</p>" });
  expect(html).not.toContain("mailto:");
});
```

- [ ] **Step 2: Run to verify it fails** — `pnpm --filter @indiecrafts/packages-web-email exec vitest run src/layout.test.ts` → FAIL (no `supportEmail`, no mailto).
- [ ] **Step 3: Add `supportEmail?: string` to `EmailLayoutInput`** (after `lang?`):

```ts
  /** Editor-owned support address (from Sanity). Empty/omitted → no support line. */
  supportEmail?: string;
```

- [ ] **Step 4: Destructure it + render the footer line.** In `renderEmailLayout`, add `supportEmail` to the destructure, then replace the footer row:

```ts
${supportEmail ? `<br>Besoin d'aide&nbsp;? <a href="mailto:${escapeHtml(supportEmail)}" style="color:${C.muted}">${escapeHtml(supportEmail)}</a>` : ""}
```

inserted immediately after the existing `Envoyé par …` line, inside the same footer `<td>`.

- [ ] **Step 5: Run to verify it passes** — same command → PASS.
- [ ] **Step 6: Commit**

```bash
git add code/packages/web/email/src/layout.ts code/packages/web/email/src/layout.test.ts
git commit -m "feat(email): renderEmailLayout footer shows an optional supportEmail"
```

---

### Task 2: Thread `supportEmail` into the website emails + erasure emails

**Files:**

- Modify (each already imports `renderEmailLayout` + is called by a sender that reads `getEmailStrings()`):
  `code/modules/web/waitlist/src/emails/waitlist-confirm.ts`, `waitlist-notification.ts`;
  `code/modules/web/contact/src/emails/contact-confirm.ts`, `contact-notification.ts`;
  `code/modules/web/blog/src/emails/comment-notification.ts`;
  `code/modules/web/newsletter/src/emails/newsletter-confirm.ts`, `newsletter-notification.ts`, `lead-magnet.ts`;
  `code/packages/web/compliance/src/emails/data-request-notification.ts`;
  `code/shared/api/src/erasure/email.ts` (its `renderEmailLayout` calls + `MailEnv` reader).
- Test: `code/shared/api/src/erasure/email.test.ts` (assert the erasure email HTML carries the support address when the reader returns one).

**Interfaces:**

- Consumes: `renderEmailLayout({ …, supportEmail })` from Task 1.
- Each website template function gains a `supportEmail?: string` parameter, passed straight into its `renderEmailLayout({ … })` call. Each **sender** (the feature's `lib/*` that already calls `getEmailStrings()`) reads `strings.supportEmail` and passes it to the template. The api erasure sender reads `supportEmail` from its Sanity fetch and passes it.

- [ ] **Step 1: Batch the mechanical thread.** For each of the 10 website template files: add `supportEmail,` to the template's input params and `supportEmail,` to its `renderEmailLayout({ … })` call. (Same one-line-each edit; the SDD "batch small same-shape work" rule applies — one dispatch, one review.)
- [ ] **Step 2: Update each sender** to read `getEmailStrings()`'s `supportEmail` and pass it to the template call. (Senders already await `getEmailStrings()`; add `supportEmail: strings.supportEmail` to the template invocation.)
- [ ] **Step 3: Erasure emails** — in `code/shared/api/src/erasure/email.ts`, extend the erasure Sanity fetch (`fetchErasureEmailStrings`) GROQ to also select `supportEmail`, thread it into both `renderEmailLayout` calls, and add `supportEmail?: string` to its input types.
- [ ] **Step 4: Failing test first** for the erasure thread — in `erasure/email.test.ts`, a case where the injected string-fetch returns `{ supportEmail: "support@x.com", … }` asserts the sent HTML `toContain("support@x.com")`. Run → FAIL, then implement Step 3 → PASS: `pnpm --filter @indiecrafts/shared-api exec vitest run src/erasure/email.test.ts`.
- [ ] **Step 5: tsc both trees** — `pnpm --filter @indiecrafts/web-surfaces-website exec tsc --noEmit` and `pnpm --filter @indiecrafts/shared-api exec tsc --noEmit` → clean.
- [ ] **Step 6: Commit**

```bash
git add code/modules/web/*/src/emails/*.ts code/packages/web/compliance/src/emails/data-request-notification.ts code/shared/api/src/erasure/email.ts code/shared/api/src/erasure/email.test.ts code/modules/web/*/src/lib/*.ts
git commit -m "feat(email): thread supportEmail into every website + erasure email footer"
```

---

### Task 3: New `clerkEmails` Sanity singleton (all Clerk templates, separate collection)

**Files:**

- Create: `code/packages/web/email/src/sanity/clerk-emails.ts`
- Delete: `code/packages/web/email/src/sanity/auth-email-groups.ts`
- Modify: `code/packages/web/email/src/sanity/index.ts` (barrel), `code/projects/web/surfaces/website/sanity.config.ts` (register singleton; drop `authEmailGroups`)

**Interfaces:**

- Produces: `buildClerkEmails(): SchemaTypeDefinition` — a document `name:"clerkEmails"`, title `"E-mails Clerk"`, `documentId:"clerkEmails"`, one **uniform group per slug** using the existing `confirmationGroup({ name, heading:false, addressFields:false, button?, title, description, …Hint })` factory (reuse — do not invent a new factory).
- Produces: `clerkEmailsStructureItem(S): ListItemBuilder` (mirror `emailPreferencesStructureItem`).
- Group `name`s (the GROQ keys the api reads) — one per template kind, in this exact set:
  `verification` · `magicLink` (button) · `resetPassword` · `newDevice` (button) · `passwordChanged` · `passwordRemoved` · `passkeyAdded` · `passkeyRemoved` · `mfaEnabled` · `primaryEmailChanged` · `accountLocked` · `invitation` (button).
  Each group has `enabled`/`subject`/`intro`/`outro` (+ `buttonLabel` where `button:true`). French legends per slug (say what the email is, that copy is optional, what empty does).

- [ ] **Step 1: Write `clerk-emails.ts`.** `import { confirmationGroup } from "./groups"`, `defineType`, `EnvelopeIcon`. Build the 12 groups (mirror the 4 in the old `auth-email-groups.ts` for the shape; the 8 new notification ones use `button:false`, no OTP — legends describe a security/notice email). Export `buildClerkEmails()` returning the document with `fields: [ …the 12 groups ]`, and `clerkEmailsStructureItem(S)`.
- [ ] **Step 2: Delete `auth-email-groups.ts`** and remove its `export { authEmailGroups }` from `sanity/index.ts`; add `export { buildClerkEmails, clerkEmailsStructureItem } from "./clerk-emails"`.
- [ ] **Step 3: Wire the Studio.** In `sanity.config.ts`: drop `authEmailGroups` from the imports and from the `emailSanity([ …, { emailGroups: [...authEmailGroups, ...securityAlertGroups] } ])` call (leave `securityAlertGroups`). Add a bare entry to the "Contenu partagé" `modules` array (mirror the `app-content`/`email-preferences` entries):

```ts
{ name: "clerk-emails", schemaTypes: [buildClerkEmails()], structure: (S) => [clerkEmailsStructureItem(S)] },
```

- [ ] **Step 4: tsc the website** — `pnpm --filter @indiecrafts/web-surfaces-website exec tsc --noEmit` → clean (Studio schema; no unit test — Studio config).
- [ ] **Step 5: Commit**

```bash
git add code/packages/web/email/src/sanity/clerk-emails.ts code/packages/web/email/src/sanity/index.ts code/projects/web/surfaces/website/sanity.config.ts
git rm code/packages/web/email/src/sanity/auth-email-groups.ts
git commit -m "feat(email): separate clerkEmails Studio singleton for every Clerk auth template"
```

---

### Task 4: api take-over reads `clerkEmails`, renders all kinds, wrapped + footer

**Files:**

- Create: `code/shared/api/src/clerk-email/slugs.ts`
- Modify: `code/shared/api/src/clerk-email/sanity.ts`, `templates.ts`, `handle.ts`
- Test: `code/shared/api/src/clerk-email/sanity.test.ts`, `templates.test.ts` (create if absent), `handle.test.ts`

**Interfaces:**

- Consumes: `renderEmailLayout` (Task 1), the `clerkEmails` groups (Task 3).
- `slugs.ts` produces: `type ClerkKind` (the 12 kinds above); `KIND_FOR_SLUG(slug: string): ClerkKind | null` (forgiving substring match — widen the existing `authKind`: add `"passkey"`→passkeyAdded/Removed by `add`/`remov`, `"mfa"`→mfaEnabled, `"primary_email"`→primaryEmailChanged, `"account_locked"|"locked"`→accountLocked, `"invitation"|"invite"`→invitation, `"password_changed"`→passwordChanged, `"password_removed"`→passwordRemoved; keep verification/reset/magic/device); `SLUG_FOR_KIND: Record<ClerkKind, string>` (canonical slugs).
- `sanity.ts` produces: `resolveClerkCopy(strings, slug, locale): AuthCopy | undefined` (same shape, keyed by the widened kind→group map); `fetchClerkEmailStrings(env, doFetch?)` reading `*[_type=="clerkEmails"][0]{ …all 12 groups… }`; keep the never-throw + 5-min cache pattern verbatim.
- `templates.ts`: `AUTH_TEMPLATES: Record<string, (vars,locale,copy?) => Rendered>` gains the 8 notification kinds. Notification render = `intro`(fallback en/fr) + optional device/email var + `outro`, no code/button. The OTP/link 4 stay as-is.
- `handle.ts`: after producing `{ subject, html, text }` (localized) OR the passthrough body, WRAP the html: `const wrapped = renderEmailLayout({ title: subject, contentHtml: html, lang: locale, supportEmail })` and send `wrapped` (keep `text` as the plain-text). `supportEmail` comes from the same `fetchClerkEmailStrings` read (add it to the GROQ + the returned type) — falling back to `undefined` (no footer line) when unset.

- [ ] **Step 1: Failing tests** — `sanity.test.ts`: `KIND_FOR_SLUG("passkey_added")==="passkeyAdded"`, `("mfa_enabled")==="mfaEnabled"`, `("primary_email_address_changed")==="primaryEmailChanged"`, `("account_locked")==="accountLocked"`, `("invitation")==="invitation"`, plus the existing 4 still map. `handle.test.ts`: a `password_changed` event with a mailer set → `send` called once, its `html` `toContain` the branded shell marker (e.g. `Envoyé par`) AND the support address when the injected fetch returns one. Run → FAIL.
- [ ] **Step 2: Extract + widen `slugs.ts`**, move `authKind`/`SLUG_FOR_KIND`/`GROUP_FOR_KIND` logic here as `KIND_FOR_SLUG`/`SLUG_FOR_KIND`/`GROUP_FOR_KIND` over `ClerkKind`. Re-export from `sanity.ts` for back-compat if other files import them.
- [ ] **Step 3: `resolveClerkCopy` + `fetchClerkEmailStrings`** in `sanity.ts` (mirror `resolveAuthCopy`/`fetchAuthEmailStrings`; new `_type=="clerkEmails"`; add `supportEmail` to GROQ + type).
- [ ] **Step 4: Widen `AUTH_TEMPLATES`** in `templates.ts` — add the 8 notification renderers (hardcoded en/fr fallback copy per kind; `copy?.intro`/`outro` win).
- [ ] **Step 5: Wrap in `handle.ts`** — import `renderEmailLayout`; use `fetchClerkEmailStrings` (replace `fetchAuthEmailStrings`); wrap localized + passthrough html; pass `supportEmail`.
- [ ] **Step 6: Run tests** — `pnpm --filter @indiecrafts/shared-api exec vitest run src/clerk-email/` → PASS. Then `pnpm --filter @indiecrafts/shared-api exec vitest run` (full api suite) → PASS.
- [ ] **Step 7: Commit**

```bash
git add code/shared/api/src/clerk-email/
git commit -m "feat(api): Clerk take-over renders every auth template from clerkEmails, branded + support footer"
```

---

### Task 5: Seed `clerkEmails` + migrate the 4 existing auth-copy values

**Files:** (no repo files — a Sanity dataset write, done by the controller with the authed CLI)

- [ ] **Step 1: Read** the current `emailStrings` singleton's `authVerification`/`authResetPassword`/`authMagicLink`/`authNewDevice` values (if an editor set any).
- [ ] **Step 2: Create `clerkEmails`** (`_id:"clerkEmails"`) copying those 4 groups' values into the new group names + leaving the 8 notification groups empty (they fall back to hardcoded copy). `sanity documents create --replace`.
- [ ] **Step 3: Remove** the 4 now-orphaned `auth*` groups from `emailStrings` (patch unset) so Studio doesn't show dead fields.
- [ ] **Step 4: Verify** `*[_id=="clerkEmails"][0]` reads back through the api's GROQ shape.

---

### Task 6: Activate — toggle templates, verify webhook, Google-screen runbook

**Files:**

- Create: `code/docs/apps/web/config/clerk-emails.md` (+ sidebar line in `code/docs/.vitepress/config.mts`)
- Modify: `code/shared/api/CHANGELOG.md`

- [ ] **Step 1: Verify webhook delivery first** — with the api deployed (done), confirm the Clerk `email.created` webhook reaches `/v1/clerk-webhook` (trigger a test verification email; check the api logs / that the recipient gets OUR branded email from no-reply@). If it doesn't arrive, fix the webhook before toggling.
- [ ] **Step 2: Toggle all templates** — for each of the 25 slugs: `clerk api PATCH templates/email/{slug} --input-json '{"delivered_by_clerk":false}'`. (Auth/security set is what fires; billing/waitlist are inert but toggled too per the "every template" decision.) Re-list to confirm all `delivered_by_clerk:false`.
- [ ] **Step 3: End-to-end verify** — sign up / request a code on dev → the email arrives from `no-reply@updates.indiecrafts.dev`, branded shell, localized, **support address in the footer**. New-device sign-in still fires (it stays `enabled:true`).
- [ ] **Step 4: Google-screen runbook** — write `clerk-emails.md`: the take-over model, the toggle list, and the **Google OAuth app-name** steps (create a production Clerk instance → a Google Cloud OAuth client with "indiecrafts" on the consent screen → paste id/secret into Clerk; the dev instance uses Clerk's shared creds and shows a generic name).
- [ ] **Step 5: Changelog** — `code/shared/api/CHANGELOG.md`: the take-over now covers every auth template from `clerkEmails`, branded + support footer; the templates are Clerk-off.
- [ ] **Step 6: Commit**

```bash
git add code/docs/apps/web/config/clerk-emails.md code/docs/.vitepress/config.mts code/shared/api/CHANGELOG.md
git commit -m "docs(api): Clerk email take-over runbook (toggles, webhook, Google screen)"
```

---

## Self-Review

- **Coverage:** every requirement is a task — all templates editable (T3+T5), support in every footer (T1+T2+T4), take-over active (T6). ✅
- **Placeholders:** none — real code/commands per step; mechanical batches name every file.
- **Type consistency:** `ClerkKind`/`KIND_FOR_SLUG`/`SLUG_FOR_KIND`/`resolveClerkCopy`/`fetchClerkEmailStrings` used consistently across T3/T4; `renderEmailLayout({…, supportEmail})` from T1 consumed in T2/T4; `AuthCopy` shape reused (not renamed).
- **Prereqs already done (not re-done here):** `emailStrings.supportEmail` schema field + seed; api deployed to dev with secrets; the packages CHANGELOG + `email.md` doc lines for the support field.
