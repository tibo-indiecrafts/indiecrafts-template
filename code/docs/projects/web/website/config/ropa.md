---
title: "Records of processing activities (GDPR Art. 30)"
description: "Art."
status: stable
---

# Records of processing activities (GDPR Art. 30)

Art. 30 requires a record of every processing activity. This page lists them
in one table. For the audit, security, consent, DSAR, and erasure tables, the
row is brief — see [Data retention + audit](/projects/web/website/config/data-retention) for the
field-level record.

## The record

| Activity                                                        | Purpose                                                                    | Data categories                                                                                                     | Data subjects                              | Lawful basis                    | Recipients/processors                                            | Retention                                                          | Location                 |
| --------------------------------------------------------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ | ------------------------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------ | ------------------------ |
| Auth & sessions (`session_events`)                              | Secure sign-in, detect abuse                                               | Timestamp, surface, userId, country, hashed IP                                                                      | Registered users                           | Legitimate interest             | Cloudflare (D1), Clerk (auth)                                    | 90 days                                                            | Cloudflare D1, EU        |
| Admin audit (`admin_audit`)                                     | Accountability trail for role grants/revokes                               | Timestamp, event, actor/target userId, country — no IP                                                              | Admin users                                | Legitimate interest             | Cloudflare (D1)                                                  | 90 days; retained through erasure                                  | Cloudflare D1, EU        |
| Retry dedupe (`idempotency_keys`)                               | Make a retried server write (`POST /v1/events`) count once                 | SHA-256 of the caller's bearer and of the request body; the route's answer (`{ "ok": true }`) — no raw request data | First-party servers (no data subject)      | Legitimate interest (integrity) | Cloudflare (D1)                                                  | 24 hours (cron purge)                                              | Cloudflare D1, EU        |
| Security events (`security_events`)                             | Detect and log app-level security incidents                                | Timestamp, event type, severity, surface, userId (when known), country, hashed IP, short label                      | Users involved in an incident              | Legitimate interest             | Cloudflare (D1); Resend (owner/DPO alert email on high/critical) | 90 days; high/critical pseudonymised, not deleted, on erasure      | Cloudflare D1, EU        |
| Consent log (`consent_events`)                                  | Prove cookie-consent decisions                                             | Consent type, decision, subject id or fingerprint; viewed per user by admins (each view audited, no IP shown)       | Site visitors and users                    | `[placeholder — confirm]`       | Cloudflare (D1)                                                  | ~3 years (1095 days)                                               | Cloudflare D1, EU        |
| DSAR intake (`data_requests`)                                   | Intake a GDPR access/rectification/erasure/etc. request                    | Request type, plaintext email, free-text message, status, submitted-at, source page, locale, policy version         | Data subjects submitting a request         | Legal obligation (Art. 15–21)   | Cloudflare (D1); Resend (owner-alert email)                      | 365 days                                                           | Cloudflare D1, EU        |
| Erasure/export requests (`erasure_requests`, `export_requests`) | Track an erasure (Art. 17) or export (Art. 15/20) request to completion    | Email, token, status, due/completed timestamps; export bundle                                                       | Data subjects requesting erasure or export | Legal obligation                | Cloudflare (D1, R2)                                              | Erasure: 1095 days. Export bundle: 1 hour or first download        | Cloudflare D1/R2, EU     |
| Newsletter                                                      | Send the subscriber a newsletter                                           | Email address                                                                                                       | Subscribers                                | `[placeholder — confirm]`       | Sanity (storage); Resend (delivery)                              | `[placeholder]`                                                    | Sanity — US + global CDN |
| Blog comments                                                   | Publish a reader comment on a post                                         | Name, email (not published), comment text                                                                           | Commenters                                 | `[placeholder — confirm]`       | Sanity (storage + moderation)                                    | `[placeholder]`                                                    | Sanity — US + global CDN |
| Waitlist                                                        | Capture a pre-launch signup; send early-access news (Resend General topic) | Email, `[name if collected]`                                                                                        | Prospects                                  | `[placeholder — confirm]`       | Sanity (storage); Resend (contact, General topic)                | `[placeholder]`                                                    | Sanity — US + global CDN |
| Contact                                                         | Respond to an enquiry                                                      | Name, email, message                                                                                                | Enquirers                                  | `[placeholder — confirm]`       | Sanity (storage); Resend (contact, no topic)                     | `[placeholder]`                                                    | Sanity — US + global CDN |
| Sanity content authorship                                       | Track who authored/edited site content                                     | Editor user id/email, revision history, timestamps                                                                  | Content editors (staff)                    | `[placeholder — confirm]`       | Sanity (storage)                                                 | `[placeholder — Sanity account lifecycle]`                         | Sanity — US + global CDN |
| Orders                                                          | Reserved for future commerce                                               | Not built                                                                                                           | Not built                                  | Not built                       | Not built                                                        | Not built (a 7–10y anonymised duty is planned once checkout ships) | Not built                |

See [Sub-processors & international transfers](/projects/web/website/config/sub-processors) for the
processor list and the transfer mechanism each one needs.

## Rectification, restriction, objection

The system has no self-service UI for rectification, restriction, or
objection. An operator actions these manually through the DSAR channel
(`/data-request`) — the same intake `data_requests` uses.

## Controller identity

- **Controller:** `[org name]`
- **DPO / privacy contact:** `[name, email]`

Fill in both before the privacy policy or this record goes live.
