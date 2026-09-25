---
title: "Breach response (GDPR Art. 33/34)"
description: "This is the operator's runbook for a personal-data breach."
status: stable
---

# Breach response (GDPR Art. 33/34)

This is the operator's runbook for a personal-data breach. It covers the legal
deadlines, what the system does on its own, and the decisions a human must make.

## 1. Scope

GDPR Art. 33 requires notice to the supervisory authority within 72 hours of
awareness. GDPR Art. 34 requires notice to affected data subjects when the breach
creates a high risk to them. US state laws, for example California, impose their
own breach-notice duties — check those separately for US-based subjects.

See also: [Records of processing (ROPA)](/projects/web/website/config/ropa) and
[Sub-processors & transfers](/projects/web/website/config/sub-processors).

## 2. What the system does automatically

A high or critical `security_events` row triggers an automatic email alert.

- **Recipient:** `SECURITY_ALERT_EMAIL`, falling back to `EMAIL_ADMIN_BCC`. If
  neither is set, the alert does not send. The incident is still written to D1.
- **Content:** internal, operator-facing, hard-coded English. It never carries a
  raw IP address or an email address. It may carry the pseudonymous Clerk user id —
  the same id the admin `/security` screen shows.
- **Caller obligation:** a directly-posted incident's `description` is caller-supplied
  and the alert forwards it to the email processor (Resend). Per the
  `@indiecrafts/packages-shared-security-events` contract, `description` must be a
  short non-PII label — never an email, username, or raw IP.
- **Delivery:** sent through `ctx.waitUntil`. It never delays or fails the request.
- **No review link:** the email has no admin-dashboard link. No `ADMIN_URL`
  variable exists. Read the incident at `/admin/security` instead.

The alert fires at three points:

1. A `credential_stuffing` incident (high severity), once the KV failed-login
   counter crosses its threshold.
2. Any high or critical incident posted directly to `POST /v1/events`.
3. A `privilege_escalation` incident (high severity), from the Clerk webhook.

The alert starts the human 72-hour clock. It is not a regulator notification. An
operator must still read the incident and decide whether to notify anyone.

## 3. The 72-hour clock

"Awareness" means the point the operator has reasonable certainty a breach
happened — not the point the breach itself happened. Record the discovery time as
soon as you have it. The deadline is discovery time plus 72 hours.

## 4. Decision tree

Work through these questions in order:

1. **Does the incident involve personal data?** No → log it internally. Stop.
2. **Is there a risk to individuals?** Low or no risk → log it internally. Stop.
3. **Is there a real risk?** Notify the supervisory authority within 72 hours.
4. **Is the risk high?** Also notify the affected individuals, without undue delay.

## 5. Roles

- **Owner/DPO** — decides whether the breach needs notification, and to whom.
- **Investigator** — confirms the facts: what happened, what data, how many
  subjects.
- **Notice drafter** — fills in the templates below and sends the notices.

On a small team, one person can hold all three roles.

## 6. Notification templates

Fill in every blank before sending. Both templates cover the content Art. 33(3) and
Art. 34(2) require.

### Supervisory-authority notice (Art. 33(3))

```
Subject: Data breach notification — [organisation name]

Nature of the breach: [what happened]
Categories of data affected: [e.g. email addresses, hashed IPs]
Approximate number of data subjects affected: [number]
Approximate number of records affected: [number]
Likely consequences: [likely impact]
Measures taken or proposed: [containment + remediation steps]
Contact point: [name, email, phone]
```

### Data-subject notice (Art. 34(2))

```
Subject: Notice about a data breach affecting your account

We are writing to tell you about a data breach that may affect your data.

Nature of the breach: [what happened, in plain language]
Data affected: [what data of theirs was involved]
Likely consequences: [what this could mean for them]
Measures taken: [what we have done to contain and fix it]
What you can do: [recommended steps, e.g. change your password]
Contact point: [name, email, phone]
```

## 7. Containment checklist

- [ ] Rotate every leaked secret — API keys, tokens, passwords.
- [ ] Revoke active sessions in Clerk.
- [ ] Review the incident at `/admin/security`.
- [ ] Preserve evidence — logs, the D1 row, timestamps — before any cleanup.
- [ ] If containment restored Cloudflare D1 from a snapshot, re-run the erasure
      engine for every erasure completed since that snapshot. See "Erasure
      completeness & backups" in [Data retention + audit](/projects/web/website/config/data-retention).

## Out of scope

External credential-leak scanning, for example HaveIBeenPwned, is not built. This
is a possible future addition, not a current capability.
