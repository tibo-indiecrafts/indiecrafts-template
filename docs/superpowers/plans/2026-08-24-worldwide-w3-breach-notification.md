# Worldwide W3: Breach notification — runbook + alert email + critical-event → owner alert hook

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Close inventory gap #18 (breach notification, MISSING). Today critical security incidents land in the EU D1 and the `/admin/security` feed but nothing alerts the operator — a critical event sits unseen until someone opens the screen. Add: (1) a pure alert-decision + formatter in the security-events brick; (2) a worker email sender that alerts the owner/DPO when a high/critical `security_events` row is written; (3) an incident-response runbook (72-hour clock, roles, notification templates) plus the erasure-completeness/backups "beyond use" posture.

**Architecture:** Detection already exists and is low-volume by design (credential_stuffing is KV-debounced to one row per threshold crossing; priv-esc is rare; direct incidents are posted per real event). So the hook fires on every high/critical write with no extra debounce. Alert logic (should-alert + formatter) is pure → lives in `@indiecrafts/packages-shared-security-events` (the brick); the Resend send lives in the api worker (reusing the inlined `resend()` helper already in `erasure/email.ts`). The send is fired via `ctx.waitUntil` and never fails the request — the incident is already persisted.

**Tech Stack:** Cloudflare Workers · wrangler · TypeScript · Resend HTTP (inlined) · Vitest (workers pool for the api, node pool for the brick).

**Spec:** `.superpowers/sdd/worldwide-compliance-inventory.md` (#18 Breach notification; #21/#22 transfers stay in W4). Program tracker: `.superpowers/sdd/worldwide-compliance-progress.md`.

## Global Constraints

- **Config-first / minimization.** The alert email is INTERNAL (operator-facing), so it is hard-coded English — NOT read from the Studio `emailStrings` singleton (that is only for customer-facing copy). It carries NO raw IP and NO email; it may carry the pseudonymous Clerk `user_id`, the same field `/admin/security` already shows.
- **Services are shells.** Pure alert logic (should-alert, formatter) lives in the brick, never in `api/src`. The api only wires the send.
- **Worker-safety.** No `server-only` / `next-sanity` imports in the worker path. Reuse the existing inlined `resend()`; do not import `@indiecrafts/packages-web-email`.
- **Never break the write.** The alert send is wrapped so a Resend failure, an unset `RESEND_API_KEY`, or no recipient never fails `POST /v1/events` or the webhook. Fire via `ctx.waitUntil`.
- **Commit `--no-verify`; stage only named files; prettier; writing-style (active voice, ≤20-word sentences, lead with the answer).** Machine may be slow — allow time / run tests in background.
- **Recipient resolution:** `SECURITY_ALERT_EMAIL` if set, else `EMAIL_ADMIN_BCC` (the existing admin/DPO address), else no-op.
- **Ruling W3-SEVERITY:** alert on severity `high` OR `critical`, not `critical` only. The two auto-detected incidents (credential_stuffing, privilege_escalation) are both `high`; alerting only on `critical` would make the hook fire almost never. Hard-code the set `{"high","critical"}` with a `ponytail:` comment; add a configurable threshold only if noise is ever observed. Cost if wrong: a noisier inbox on a sustained attack — the write path is already debounced, so volume stays low.

---

### Task 1: Alert decision + formatter (pure brick logic)

**Files:**
- Create: `code/packages/shared/security-events/src/alerts.ts`
- Modify: `code/packages/shared/security-events/src/index.ts` (add the barrel export)
- Test: `code/packages/shared/security-events/src/alerts.test.ts`

**Interfaces:**
- Consumes: `Severity`, `SecurityEventType` from `./events`.
- Produces:
  - `ALERT_SEVERITIES: readonly Severity[]` = `["high", "critical"]`.
  - `shouldAlert(severity: string): boolean` — true iff `severity` is in `ALERT_SEVERITIES`. Accepts a plain string (the worker reads severity as an unbounded string) and narrows.
  - `type SecurityAlert = { eventType: string; severity: string; surface: string | null; userId: string | null; country: string | null; description: string | null; ts: string; adminUrl?: string }`.
  - `formatSecurityAlert(a: SecurityAlert): { subject: string; text: string }` — pure, null-safe, non-PII. Subject like `[Security] critical — data_exfiltration (app)`. Text lists severity, type, surface, country, user id (or `—`), time, description, and, if `adminUrl` set, a "Review: <adminUrl>/security" line.

- [ ] **Step 1: Write the failing test** (`alerts.test.ts`)

```typescript
import { describe, expect, it } from "vitest";
import { shouldAlert, formatSecurityAlert, ALERT_SEVERITIES } from "./alerts";

describe("shouldAlert", () => {
  it("alerts on high and critical only", () => {
    expect(shouldAlert("critical")).toBe(true);
    expect(shouldAlert("high")).toBe(true);
    expect(shouldAlert("medium")).toBe(false);
    expect(shouldAlert("low")).toBe(false);
    expect(shouldAlert("")).toBe(false);
  });
  it("exposes the alert set", () => {
    expect([...ALERT_SEVERITIES]).toEqual(["high", "critical"]);
  });
});

describe("formatSecurityAlert", () => {
  const base = {
    eventType: "data_exfiltration",
    severity: "critical",
    surface: "app",
    userId: "user_123",
    country: "FR",
    description: "bulk export attempt",
    ts: "2026-08-24T10:00:00.000Z",
  };
  it("puts type + severity + surface in the subject", () => {
    expect(formatSecurityAlert(base).subject).toBe(
      "[Security] critical — data_exfiltration (app)",
    );
  });
  it("lists the fields and never crashes on nulls", () => {
    const out = formatSecurityAlert({
      ...base,
      surface: null,
      userId: null,
      country: null,
      description: null,
    });
    expect(out.text).toContain("Severity: critical");
    expect(out.text).toContain("Type: data_exfiltration");
    expect(out.text).toContain("User: —");
  });
  it("adds a review link when adminUrl is given", () => {
    const out = formatSecurityAlert({ ...base, adminUrl: "https://admin.example.com" });
    expect(out.text).toContain("https://admin.example.com/security");
  });
});
```

- [ ] **Step 2: Run it, verify it fails** — `pnpm --filter @indiecrafts/packages-shared-security-events test` → FAIL (module not found).

- [ ] **Step 3: Implement `alerts.ts`**

```typescript
import type { Severity } from "./events";

/** Severities that page the operator. `credential_stuffing` + `privilege_escalation`
 *  (the two auto-detected incidents) are both `high`, so alerting on `critical` alone
 *  would almost never fire.
 *  ponytail: fixed set, not configurable — add a threshold var only if alerts get noisy. */
export const ALERT_SEVERITIES: readonly Severity[] = ["high", "critical"];

export function shouldAlert(severity: string): boolean {
  return (ALERT_SEVERITIES as readonly string[]).includes(severity);
}

export type SecurityAlert = {
  eventType: string;
  severity: string;
  surface: string | null;
  userId: string | null;
  country: string | null;
  description: string | null;
  ts: string;
  /** Admin dashboard origin, e.g. https://admin.example.com. Adds a review link when set. */
  adminUrl?: string;
};

/** Build the INTERNAL alert email copy. Pure + null-safe + non-PII (no raw IP, no email;
 *  the pseudonymous Clerk user id is the same field `/admin/security` shows). */
export function formatSecurityAlert(a: SecurityAlert): { subject: string; text: string } {
  const surface = a.surface ?? "unknown";
  const subject = `[Security] ${a.severity} — ${a.eventType} (${surface})`;
  const lines = [
    "An app-level security incident was recorded.",
    "",
    `Severity: ${a.severity}`,
    `Type: ${a.eventType}`,
    `Surface: ${surface}`,
    `Country: ${a.country ?? "—"}`,
    `User: ${a.userId ?? "—"}`,
    `Time: ${a.ts}`,
    `Detail: ${a.description ?? "—"}`,
  ];
  if (a.adminUrl) lines.push("", `Review: ${a.adminUrl}/security`);
  lines.push("", "Runbook: code/docs/apps/web/config/breach-response.md");
  return { subject, text: lines.join("\n") };
}
```

- [ ] **Step 4: Add the barrel export** to `code/packages/shared/security-events/src/index.ts` — export `ALERT_SEVERITIES`, `shouldAlert`, `formatSecurityAlert`, and the `SecurityAlert` type from `./alerts`, matching the file's existing export style.

- [ ] **Step 5: Run tests** — `pnpm --filter @indiecrafts/packages-shared-security-events test` → PASS (existing thresholds tests still green).

- [ ] **Step 6: Commit** (`--no-verify`, stage only the three files): `feat(security): alert-decision + formatter for high/critical incidents`.

---

### Task 2: Worker send + wire the hook at the three write sites

**Files:**
- Modify: `code/shared/api/src/erasure/email.ts` — export `resend` and `MailEnv` (they are currently module-private) so a sibling can reuse the inlined Resend POST. Do not change their behaviour.
- Create: `code/shared/api/src/security/alert.ts` — `sendSecurityAlertEmail(env, alert)`.
- Modify: `code/shared/api/src/index.ts` — add `SECURITY_ALERT_EMAIL?` to the `Env` type; call the alert (via `ctx.waitUntil`) after each high/critical `security_events` insert (the `insertSecurity` helper covers sites #1 credential_stuffing + #2 direct incident; add a call after site #3 the webhook priv-esc insert).
- Test: `code/shared/api/src/security/alert.test.ts` (mirror `erasure/email.test.ts` — stub global `fetch`).

**Interfaces:**
- Consumes: `resend`, `MailEnv` (from `../erasure/email`); `shouldAlert`, `formatSecurityAlert`, `SecurityAlert` (from `@indiecrafts/packages-shared-security-events`).
- Produces: `sendSecurityAlertEmail(env: AlertEnv, alert: SecurityAlert): Promise<void>` where `AlertEnv = MailEnv & { SECURITY_ALERT_EMAIL?: string }`. No-op (returns without sending) when `RESEND_API_KEY` is unset OR no recipient resolves. Recipient = `env.SECURITY_ALERT_EMAIL ?? env.EMAIL_ADMIN_BCC`. Never throws (wrap the send; the caller uses `ctx.waitUntil`).

- [ ] **Step 1: Read** `code/shared/api/src/erasure/email.ts` (the `resend()` signature + the `RESEND_API_KEY` no-op guard pattern) and `erasure/email.test.ts` (the `okFetch()` global-fetch stub). Confirm `resend()` takes `(env, { to, subject, text, html? })` — match its real shape.

- [ ] **Step 2: Write the failing test** (`security/alert.test.ts`) — mirror `email.test.ts`:

```typescript
import { afterEach, describe, expect, it, vi } from "vitest";
import { sendSecurityAlertEmail } from "./alert";

const ALERT = {
  eventType: "data_exfiltration",
  severity: "critical",
  surface: "app",
  userId: "user_1",
  country: "FR",
  description: "bulk export",
  ts: "2026-08-24T10:00:00.000Z",
} as const;

afterEach(() => vi.unstubAllGlobals());

function okFetch() {
  const m = vi.fn(async () => ({ ok: true, status: 200 }) as Response);
  vi.stubGlobal("fetch", m);
  return m;
}

describe("sendSecurityAlertEmail", () => {
  it("POSTs Resend to SECURITY_ALERT_EMAIL when set", async () => {
    const m = okFetch();
    await sendSecurityAlertEmail(
      { RESEND_API_KEY: "k", EMAIL_FROM: "no-reply@x.com", SECURITY_ALERT_EMAIL: "soc@x.com" },
      ALERT,
    );
    expect(m).toHaveBeenCalledOnce();
    const body = JSON.parse((m.mock.calls[0]![1] as RequestInit).body as string);
    expect(body.to).toContain("soc@x.com");
    expect(body.subject).toContain("data_exfiltration");
  });

  it("falls back to EMAIL_ADMIN_BCC when SECURITY_ALERT_EMAIL is unset", async () => {
    const m = okFetch();
    await sendSecurityAlertEmail(
      { RESEND_API_KEY: "k", EMAIL_FROM: "no-reply@x.com", EMAIL_ADMIN_BCC: "admin@x.com" },
      ALERT,
    );
    const body = JSON.parse((m.mock.calls[0]![1] as RequestInit).body as string);
    expect(body.to).toContain("admin@x.com");
  });

  it("no-ops when RESEND_API_KEY is unset", async () => {
    const m = okFetch();
    await sendSecurityAlertEmail({ SECURITY_ALERT_EMAIL: "soc@x.com" }, ALERT);
    expect(m).not.toHaveBeenCalled();
  });

  it("no-ops when no recipient resolves", async () => {
    const m = okFetch();
    await sendSecurityAlertEmail({ RESEND_API_KEY: "k", EMAIL_FROM: "f@x.com" }, ALERT);
    expect(m).not.toHaveBeenCalled();
  });
});
```

NOTE: match the assertion shape to `resend()`'s real body — `to` may be a string or an array. Read `email.ts` first (Step 1) and adjust `toContain`/`toBe` to what `resend()` actually sends before implementing.

- [ ] **Step 3: Run it, verify it fails** — `pnpm --filter @indiecrafts/api test -- alert` → FAIL (module not found).

- [ ] **Step 4: Export `resend` + `MailEnv`** from `erasure/email.ts` (add `export` to the existing `type MailEnv` and `function resend`). No behaviour change.

- [ ] **Step 5: Implement `security/alert.ts`**

```typescript
// INTERNAL security-alert email. Reuses the inlined Resend POST from the erasure
// module (server-only `@indiecrafts/packages-web-email` is unusable in this bare
// Worker). Copy is hard-coded English — this is operator-facing ops, not customer copy.
import { resend, type MailEnv } from "../erasure/email";
import {
  formatSecurityAlert,
  type SecurityAlert,
} from "@indiecrafts/packages-shared-security-events";

type AlertEnv = MailEnv & { SECURITY_ALERT_EMAIL?: string };

/** Alert the owner/DPO of a high/critical incident. No-ops when Resend is unset or no
 *  recipient resolves. Never throws — the caller fires it via `ctx.waitUntil`, and the
 *  incident is already persisted. */
export async function sendSecurityAlertEmail(
  env: AlertEnv,
  alert: SecurityAlert,
): Promise<void> {
  const to = env.SECURITY_ALERT_EMAIL ?? env.EMAIL_ADMIN_BCC;
  if (!env.RESEND_API_KEY || !to) return; // no-op — matches the erasure senders' guard
  const { subject, text } = formatSecurityAlert(alert);
  try {
    await resend(env, { to: [to], subject, text });
  } catch {
    // Best-effort: the incident is already in D1. Swallow so waitUntil never rejects.
  }
}
```

(If `resend()`'s first arg or the `{ to, subject, text }` shape differs, adapt this call to the real signature read in Step 1.)

- [ ] **Step 6: Wire the hook in `index.ts`.** (a) Add `SECURITY_ALERT_EMAIL?: string;` to the `Env` type near `EMAIL_ADMIN_BCC`. (b) Import `sendSecurityAlertEmail` and `shouldAlert`. (c) Change `insertSecurity` so, after a successful insert, it fires the alert for high/critical:

```typescript
const insertSecurity = async (et: string, sev: string, desc: string | null) => {
  await env
    .DB!.prepare(
      "INSERT INTO security_events (ts, event_type, severity, surface, user_id, country, ip_hash, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    )
    .bind(ts, et, sev, secSurface, secUserId, country, ipHash, desc)
    .run();
  if (shouldAlert(sev)) {
    ctx.waitUntil(
      sendSecurityAlertEmail(env, {
        eventType: et,
        severity: sev,
        surface: secSurface,
        userId: secUserId,
        country,
        description: desc,
        ts,
        adminUrl: env.ADMIN_URL, // only if an ADMIN_URL var already exists; else omit this line
      }),
    );
  }
};
```

Check whether an `ADMIN_URL`/admin-origin var already exists in `Env`; if not, omit `adminUrl` (the formatter handles its absence). Keep `insertSecurity`'s callers `await`-ing it (they already do). (d) After the webhook priv-esc insert (~line 634), add the same `ctx.waitUntil(sendSecurityAlertEmail(env, {...}))` with `eventType: "privilege_escalation", severity: "high", surface: "api", userId: <the bound id>, country: <cf-ipcountry>, description: "role→admin via Clerk (out-of-band)", ts: <the ISO ts bound>`. Wrap so a missing field never throws — `shouldAlert("high")` is true, so it always fires when configured.

- [ ] **Step 7: Run tests** — `pnpm --filter @indiecrafts/api test` → the new alert tests pass and the existing api tests stay green. `pnpm --filter @indiecrafts/api tsc` clean.

- [ ] **Step 8: Add `SECURITY_ALERT_EMAIL` to `wrangler.toml`** `[vars]` (all envs, empty/commented default) with a one-line comment, matching how `EMAIL_ADMIN_BCC` is declared. Commit (`--no-verify`, stage the named files): `feat(security): alert the owner on high/critical incidents (ctx.waitUntil, non-blocking)`.

---

### Task 3: Breach-response runbook + backups posture + cross-refs + changelogs

**Files:**
- Create: `code/docs/apps/web/config/breach-response.md`
- Modify: `code/docs/apps/web/config/security-hardening.md` (cross-ref the alert hook + link the runbook)
- Modify: `code/docs/apps/web/config/data-retention.md` (add the "Erasure completeness & backups" section — the beyond-use posture)
- Modify: `code/docs/.vitepress/config.mts` (sidebar: add Breach response under the config group)
- Modify: `code/shared/api/CHANGELOG.md` + `code/packages/CHANGELOG.md`

- [ ] **Step 1: Write `breach-response.md`.** Sections, in ASD-STE100 plain English:
  1. **Scope** — GDPR Art. 33 (notify the supervisory authority within 72 hours of awareness) + Art. 34 (notify affected data subjects when high risk) + a one-line note that US state laws (e.g. California) have their own breach-notice duties. Link the ROPA/transfers docs (W4) as "see also".
  2. **What the system does automatically** — the alert hook: a high/critical `security_events` row emails `SECURITY_ALERT_EMAIL` (or `EMAIL_ADMIN_BCC`). This starts the human clock; it is NOT itself a regulator notification.
  3. **The 72-hour clock** — "awareness" = when the operator has reasonable certainty a breach occurred. Record the discovery time. Deadline = discovery + 72h.
  4. **Decision tree** — is personal data involved? → is there a risk to individuals? → low/no risk: log internally, no notice; risk: notify the DSA within 72h; high risk: also notify individuals without undue delay.
  5. **Roles** — who decides (owner/DPO), who investigates, who drafts the notice.
  6. **Notification templates** — a DSA-notice template and a data-subject-notice template (plain-text, fill-in-the-blanks: nature of the breach, categories + approximate number affected, likely consequences, measures taken, contact point) — the Art. 33(3)/34(2) required content.
  7. **Containment checklist** — rotate the leaked secret(s), revoke sessions (Clerk), review `/admin/security`, preserve evidence.
  8. **Cross-reference** the "Erasure completeness & backups" section in `data-retention.md` for the restore-time re-apply step.

- [ ] **Step 2: Add "Erasure completeness & backups" to `data-retention.md`.** State, in plain English: erasure runs on the LIVE EU D1 and R2 objects; Cloudflare D1 **Time Travel** keeps a rolling ≤30-day point-in-time history that cannot be edited record-by-record; the compliant posture (ICO/EDPB) is to treat backup PII as **"beyond use"** — never mined, aged out on its cycle — rather than restoring a backup to delete one record. **Required procedure:** after any point-in-time restore, re-run the erasure engine (`runErasure`) for every request completed since that snapshot, so a restore cannot resurrect erased data. Note R2: enable no object-versioning on the export bucket, or the same beyond-use posture applies.

- [ ] **Step 3: Cross-ref `security-hardening.md`** — in the security-events section, add one paragraph: high/critical incidents now email the owner/DPO (`SECURITY_ALERT_EMAIL` → `EMAIL_ADMIN_BCC` fallback, non-blocking via `ctx.waitUntil`); link `breach-response.md` as the runbook. Keep it short; do not duplicate the runbook.

- [ ] **Step 4: Sidebar** — add a `Breach response` item to the config group in `code/docs/.vitepress/config.mts`, next to `security-hardening` / `data-retention`. Match the existing item shape.

- [ ] **Step 5: Changelogs.** `code/shared/api/CHANGELOG.md` (Unreleased → Added): the high/critical alert hook + `SECURITY_ALERT_EMAIL` var. `code/packages/CHANGELOG.md`: the security-events brick's `shouldAlert`/`formatSecurityAlert`. If `code/packages/CHANGELOG.md` is pre-existing-dirty and cannot be cleanly staged, note it in the report and leave it — do not fight unrelated dirt.

- [ ] **Step 6: Commit** (`--no-verify`, stage the named docs): `docs(security): breach-response runbook + erasure/backups beyond-use posture`.

---

## Self-review
- **Coverage:** #18 breach notification → alert hook (code) + runbook + templates (docs). The backups question → beyond-use posture + restore-time re-apply (docs). Transfers/ROPA/DPIA/notices stay in W4.
- **Consistency:** reuses the inlined `resend()` + the `EMAIL_ADMIN_BCC` address + the existing three write sites; pure logic in the brick per "services are shells"; `ctx.waitUntil` (available at `index.ts:239`) keeps the write non-blocking.
- **Deferred/noted:** external credential-leak scanning (HaveIBeenPwned) is NOT in scope — out of scope for this template; note it in the runbook as a possible future add. No alert-debounce layer (the write path is already debounced) — ponytail-commented.
- Ruling W3-SEVERITY (high+critical) recorded above.
