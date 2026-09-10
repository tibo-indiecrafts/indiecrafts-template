# Churn tracking — design

**Status:** approved (2026-09-10). Supersedes nothing; extends the account-deletion flow.

## Goal

Capture why users leave, retain departed contacts in Resend under legitimate
interest, and give the operator a light admin page to read churn — without
weakening GDPR erasure.

## Context

Account deletion today runs the full erasure engine and **pure-deletes** the
Resend contact (`handleClerkUserDeleted` → `deleteResendContact`, with a
deliberate `ponytail: pure delete, no win-back audience` note). The user-facing
"delete my account" control calls `POST /v1/erasure/self`. So in this product,
plain account deletion currently equals erasure.

This feature splits two intents that were fused:

- **Plain account deletion** → retain a suppressed contact + capture a reason
  (legitimate interest: understand churn).
- **Explicit GDPR erasure request** (`/v1/erasure/request` → confirm) → still
  pure-deletes, no reason retained. Non-negotiable carve-out.

## Lawful basis

Legitimate interest (Art. 6(1)(f)) — understanding why customers leave. The
retained contact is **globally unsubscribed** (suppression posture, no active
win-back sending). An explicit erasure request always overrides and hard-deletes.

## Non-goals

- Active win-back email sending (retained contacts stay globally unsubscribed).
- A native mobile churn form — mobile redirects to the web account for deletion,
  same handoff as email preferences.
- Automatic Resend topic creation — the operator provisions the churned topic
  once (script or dashboard) and sets the env var.

## Components

### 1. Churn exit-survey form (web)

A step in the delete-account confirmation, modeled on
`DataRequestForm` (`code/packages/web/ui-components/src/web/form/DataRequestForm.tsx`)
— RadioGroup + Textarea + Input, all copy passed in from `messages/<locale>.json`.

Fields:

| Field                           | Control                    | Required |
| ------------------------------- | -------------------------- | -------- |
| Primary reason                  | RadioGroup (single-select) | yes      |
| What could we have done better? | Textarea (free text)       | no       |
| Where are you going?            | Input (free text)          | no       |

Preset reason codes: `too_expensive`, `not_using`, `missing_feature`,
`found_alternative`, `too_hard`, `privacy`, `other`.

The form submits the survey to `POST /v1/erasure/self` alongside the existing
typed-email confirmation. Web builds the form; mobile redirects to the web
account for deletion.

### 2. Resend suppression (replace pure-delete on plain deletion)

New `suppressResendContact(env, { email, reason }, doFetch?)` in
`code/shared/api/src/resend-audience.ts` — one PATCH that sets:

- `unsubscribed: true` (global — guarantees no email fires; this is "off all
  topics" behaviorally),
- `topics: [{ id: churnedTopicId, subscription: "opt_in" }]` (cohort tag, only
  when `RESEND_CHURNED_TOPIC_ID` is set),
- `properties: { churned_at, churn_reason }` (preset **code only** — free text
  never leaves for Resend).

Best-effort, never blocks the D1 write — same contract as `syncContactTopics` /
`deleteResendContact`. Unset key or topic id degrades gracefully (suppress-only,
or no-op). `deleteResendContact` stays for the erasure carve-out.

`ponytail: global unsubscribe is the "off all topics" guarantee; per-marketing-topic
opt_out is skipped to avoid a Sanity read in the deletion path.`

### 3. Churn store (D1 `main`)

New table `churn_events` (migration 0010):

```sql
CREATE TABLE IF NOT EXISTS churn_events (
  user_id     TEXT PRIMARY KEY,          -- opaque Clerk id, dedup key
  deleted_at  TEXT NOT NULL,             -- ISO 8601
  reason      TEXT,                      -- preset code, NULL for webhook-only deletions
  feedback    TEXT,                      -- free text, optional (operator-read)
  competitor  TEXT,                      -- free text, optional
  source      TEXT NOT NULL              -- 'self' | 'clerk_webhook'
);
CREATE INDEX IF NOT EXISTS idx_churn_deleted_at ON churn_events (deleted_at);
```

`feedback`/`competitor` are free text — a deliberate operational-PII departure
from this D1's minimization convention, matching the existing `data_requests`
precedent (documented in the api brief). No email, no name.

Write paths (order-independent via upsert):

- **Self-service** (`/v1/erasure/self`, has the reason) — writes **before**
  triggering Clerk deletion:
  `INSERT INTO churn_events (...) VALUES (...) ON CONFLICT(user_id) DO UPDATE SET
reason = excluded.reason, feedback = excluded.feedback, competitor =
excluded.competitor, source = excluded.source WHERE churn_events.reason IS NULL`.
  So a reason-carrying row always wins over a bare webhook row.
- **Clerk webhook** (`handleClerkUserDeleted`, no reason) — `INSERT OR IGNORE`
  with `reason = NULL`, `source = 'clerk_webhook'`. A no-op when the self row
  already exists.

Explicit erasure-request confirmations write **no** churn_events row.

### 4. Admin churn page

Bearer-gated `GET /v1/churn` in `code/shared/api/src/index.ts` — same guard shape
as `GET /v1/csp-reports` / `GET /v1/security`. Returns a small aggregate:

```
{
  total: number,
  byDay: { date: string, count: number }[],      // last 90 days
  byReason: { reason: string, count: number }[],  // GROUP BY reason
  recentFeedback: { deleted_at, reason, feedback, competitor }[]  // last N non-empty
}
```

Pure `COUNT … GROUP BY` — no per-row scan, no PII beyond the free-text the
operator asked for. New admin page under `code/projects/web/surfaces/admin`
renders a sparkline + reason table + feedback stream, following the existing
dashboard page pattern.

## Data flow

```
delete-account UI (web)
  → survey (reason, feedback, competitor) + typed email
  → POST /v1/erasure/self
      → upsert churn_events (source='self', reason set)     [D1 main]
      → suppressResendContact (unsubscribed + churned topic + props)  [Resend, best-effort]
      → run erasure engine (deletes Clerk user)
          → Clerk user.deleted webhook
              → handleClerkUserDeleted
                  → INSERT OR IGNORE churn_events (source='clerk_webhook')  [no-op]
                  → suppressResendContact (idempotent)

admin churn page → GET /v1/churn → aggregate churn_events
```

## Error handling

- Resend suppression is best-effort; a failure is logged and never blocks the D1
  write or the erasure.
- `GET /v1/churn` returns `{ total: 0, byDay: [], byReason: [], recentFeedback: [] }`
  when `MAIN_DB` is unbound — never throws.
- The survey is optional; a deletion with no reason still succeeds (reason NULL).

## Testing

- `suppressResendContact` — POST-then-PATCH, sets unsubscribed + topics +
  properties; no-op when key/id unset.
- `churn_events` upsert — self row wins over webhook row regardless of order;
  webhook `INSERT OR IGNORE` no-ops on an existing row.
- `GET /v1/churn` — aggregate shape; empty when unbound.
- **Erasure carve-out** — an explicit erasure-request confirmation still
  pure-deletes the Resend contact and writes no churn_events row.
- QA ledger card (runbook artifact) — "Churn on account deletion": delete a test
  account → off all marketing topics + present in `churned` (unsubscribed) in
  Resend → `churn_events` row (reason, no PII) → admin churn page shows it.

## Setup (operator, manual)

1. Create a Resend topic "Win-back (former members)" (dashboard or the
   `resend-topics-sync` script) → set `RESEND_CHURNED_TOPIC_ID`.
2. Migrate `main` D1 (0010) across dev/staging/prod.
3. Verify a valid `RESEND_API_KEY` + `RESEND_AUDIENCE_ID`.

## Global Constraints (for the plan)

- Never commit `.env*` (only `.env.example`); never expose a non-public token
  under `NEXT_PUBLIC_`/`EXPO_PUBLIC_`.
- User-facing strings live in `messages/<locale>.json` — never inline.
- The erasure carve-out is non-negotiable: an explicit erasure request always
  hard-deletes and retains no churn row.
- `churn_events` holds no email and no name; free text is the only PII, matching
  the `data_requests` precedent.
- Resend calls stay best-effort and never block the D1 write.
- Reuse: `DataRequestForm` pattern, the Resend fetch/injectable seam, the
  `INSERT OR IGNORE` idempotency idiom, the admin-dashboard page pattern.
