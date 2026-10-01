# Data-request operator flow — design

Status: approved in chat 2026-10-01 ("go"). Source card: QA Runbook card 25.

## Goal

An operator can open a GDPR data-subject request in the admin, see all of it, move it
through its life (start → done / rejected) with a note, and close it with an email to the
requester. The requester gets a receipt as soon as they submit.

## Decisions (from the user)

- Actions: status + note + email. Closing (`done` / `rejected`) can email the requester; the
  note is the email body.
- Requester confirmation: **receipt only** (no verify link). Every reply goes to the
  submitted address, so a spoofed request only reaches the real owner.
- Detail UI: **side sheet** over the list (not a separate page). `?id=<n>` opens it.
- Owner: the **api** sends both requester emails (approach A). The website keeps the owner
  alert only.

## Global constraints

- Never log email, message, or note (PII). Log error names and status codes only.
- `email`, `message` and `note` use the existing field encryption (`PII_ENCRYPTION_KEY`; unset →
  plaintext). Reads decrypt both forms.
- An email failure never undoes a stored request or a status change.
- Admin writes go through a server action that re-checks `isAdmin` and writes `audit(...)`.
- User-facing copy: website `messages/` and admin `messages/` (en + fr). Email copy: Studio
  `emailStrings` groups with a hard-coded en/fr fallback per field.
- D1 is forward-only (expand → migrate → contract).

## 1. Data — migration `0013_data_request_events.sql` (main D1)

- `data_requests.status` gains `rejected` → `new | in-progress | done | rejected`. The column is
  `TEXT`, so no schema change; the allowed set lives in the api.
- New table:

```sql
CREATE TABLE data_request_events (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  request_id  INTEGER NOT NULL REFERENCES data_requests(id) ON DELETE CASCADE,
  status      TEXT NOT NULL,          -- the status this event moved to
  note        TEXT,                   -- operator note (encrypted when a key is set)
  actor       TEXT NOT NULL,          -- Clerk user id of the admin
  notified    INTEGER NOT NULL DEFAULT 0, -- 1 = closing email sent
  at          TEXT NOT NULL           -- ISO8601
);
CREATE INDEX idx_data_request_events_request ON data_request_events (request_id, at);
```

- Retention: the cron purge already deletes `data_requests` after 365 days. It also deletes
  their events explicitly (`DELETE FROM data_request_events WHERE request_id NOT IN (SELECT id
FROM data_requests)` after the parent delete) — no reliance on FK enforcement.

## 2. Api (`code/shared/api/src/data-request/`)

Allowed transitions:

| From          | To                                |
| ------------- | --------------------------------- |
| `new`         | `in-progress`, `done`, `rejected` |
| `in-progress` | `done`, `rejected`                |
| `done`        | — (closed)                        |
| `rejected`    | — (closed)                        |

Routes (all bearer `APP_API_TOKEN`, JSON, same envelope as today):

- `GET /v1/data-requests/:id` → `{ data: { ...row, due_at, events: [...] } }` (decrypted).
  `due_at` = `submitted_at` + 1 calendar month. 404 `not_found`.
- `POST /v1/data-requests/:id/status` body `{ status, note?, notify?, actor }`:
  - `invalid` (400): unknown status, bad id, missing actor, note > 4000 chars.
  - `not_found` (404).
  - `not_allowed` (409): the transition is not in the table (includes any move from a closed
    status).
  - `note_required` (400): `notify: true` on `done` / `rejected` with an empty note.
  - On success: one `UPDATE` (guarded `WHERE id = ? AND status = ?` — a concurrent change →
    409 `changed`) + one event insert; then, when `notify` and closing, the closing email.
    Response `{ ok: true, status, notified }`; a mail failure → `notified: false`
    (the change stands; the event records `notified = 0`).
- `POST /v1/data-request` (existing): after the insert, send the **receipt** (best-effort;
  the response stays 201). Needs the new row id (`RETURNING id`).

Emails (`data-request/email.ts`, reusing `resend`, `supportFooter`, `readProfileLocale`'s
locale handling from `erasure/email.ts` — move the shared bits into a small
`src/mail.ts` only if two modules need them; otherwise import from `erasure/email.ts`):

- Locale = the row's `locale` (`fr` → French, else English).
- **Receipt** (`dataRequestReceipt` group): subject "We received your request (#{{id}})";
  body names the right (localized label), the reference `#id`, and the due date.
- **Closed** (`dataRequestClosed` group): subject "Your request (#{{id}}) — {{outcome}}";
  body: outcome line (done → "is complete", rejected → "was declined") + the operator note
  (escaped, line breaks kept).
- `EMAIL_FROM` unset or Resend error → logged (`name`/status only), never thrown to the caller.

## 3. Studio copy (`code/packages/web/compliance/src/sanity/email.ts`)

Two new `emailStrings` groups next to `dataRequestOwner`: `dataRequestReceipt` and
`dataRequestClosed` — `enabled`, `subject`, `heading`, `intro`, `outro` as `localeString` /
`localeText`. `enabled: false` disables that email. Every blank field falls back to the
api's en/fr text.

## 4. Admin

- List (`/data-requests`): unchanged columns + a **Due** column (overdue → destructive badge with
  the word "Overdue", never color alone). Each row is a button that opens the sheet.
- Sheet (`DataRequestSheet`, client, Radix `Sheet` from `packages-web-ui`):
  - Header: `#id`, right, status badge.
  - Facts: email (`mailto:`), language, source, submitted, due (overdue flag), policy version.
  - Message: full text (`whitespace-pre-wrap`).
  - History: events, newest first — status, note, actor, time (UTC), "email sent" marker.
  - Actions (only those the transition table allows):
    - **Start** (→ in-progress), no note.
    - **Mark done** / **Reject**: a note textarea + "Email the requester" checkbox (on by
      default; when on, the note is required — the button stays disabled until it has text).
  - Result: toast (success, `notified: false` → warning "Saved; the email was not sent"),
    then `router.refresh()`.
- Deep link: `/data-requests?id=12` opens the sheet for #12 (the page reads `searchParams.id`
  and fetches that request's detail server-side). Closing the sheet drops `?id`.
- Server action `setDataRequestStatus(id, status, note, notify)` in
  `monitoring-actions.ts` (the erasure pattern): `adminId()` → `postApi(...)` with `actor` →
  `audit("admin.data_request_status", { actor, target: "data-request:<id>" })`. Result union
  mirrors the api errors + `forbidden` / `unreachable`.
- Owner alert: `reviewUrl` becomes `${ADMIN_URL}/data-requests?id=<id>` — so the api must
  return the new id to the website (`{ ok: true, id }`), and `submitDataRequest` passes it.

## 5. Website

- `submitDataRequest`: reads `id` from the api response for the owner alert link. No new
  email here (the receipt is the api's).
- Form success message: mention the receipt email ("Check your inbox for a confirmation.").

## 6. Testing

- Api: route tests per transition (allowed, `not_allowed`, `changed`, `note_required`,
  `not_found`, `invalid`), events written, notify true/false, mail failure → `notified:false`;
  receipt sent after insert and never fails the 201; detail returns decrypted events.
- Cron: the purge deletes orphaned events.
- Emails: receipt + closed render in en and fr, note escaped, Studio override wins, blank →
  fallback.
- Admin: sheet renders facts/history; only allowed actions show; note required when emailing;
  server action rejects non-admins and audits; `?id` opens the sheet.
- Live: submit → receipt arrives → admin Start → Mark done with email → closing email arrives;
  history shows both events.

## Out of scope

- Identity verification links, attachments, editing the request, reopening a closed request,
  bulk actions, SLA reminders by email.
