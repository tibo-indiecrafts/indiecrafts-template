# Sub-processors & international transfers

This page lists every sub-processor and the cross-border transfers they
create. Pair it with [Records of processing](./ropa) (Art. 30) and
[Data retention + audit](./data-retention) (the privacy-policy checklist).

## Sub-processors

| Processor | Role | Data handled | Location | Transfer mechanism | DPA |
| --- | --- | --- | --- | --- | --- |
| Cloudflare | Edge, plus EU-pinned D1/R2/KV | Audit, session, security, consent, DSAR, and erasure records | EU (D1 `--location weur`); edge is global | EU-resident storage — no transfer for the pinned data | `[link]` |
| Clerk | Authentication | Account identity, credentials, session data | US | SCCs / EU-US Data Privacy Framework `[confirm]` | `[link]` |
| Resend | Transactional email | Recipient email, message content | US | SCCs / EU-US Data Privacy Framework `[confirm]` | `[link]` |
| Sanity | Content CMS | Newsletter, comments, waitlist, contact, and content-authorship records | US, plus a global CDN | SCCs / EU-US Data Privacy Framework `[confirm]` | `[link]` |

## Cross-border transfers

The `api` worker's D1 is EU-pinned (`--location weur`) — that data stays in
the EU. Clerk, Resend, and Sanity process EU personal data outside the EU.
Each of those transfers needs a lawful mechanism: an adequacy decision,
Standard Contractual Clauses, or the processor's participation in the EU-US
Data Privacy Framework.

Confirm each processor's current mechanism and link it in the privacy
policy. See the privacy-policy disclosure checklist in
[Data retention + audit](./data-retention).
