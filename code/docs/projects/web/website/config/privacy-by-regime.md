---
title: "Privacy notices by regime & data-scope boundaries"
description: 'The privacy policy is a free-text document per locale, authored in Sanity (legalPage, pageKey: "confidentialite" — see Legal pages).'
status: stable
---

# Privacy notices by regime & data-scope boundaries

The privacy policy is a free-text document per locale, authored in Sanity
(`legalPage`, `pageKey: "confidentialite"` — see [Legal pages](/projects/web/website/config/legal-pages)).
There is no notice generator. This page lists what the operator adds to that
policy body for each regime the platform supports, plus two deliberate
data-scope boundaries.

## Per-regime notice guidance

| Regime                | Consent mode | What the notice adds                                                                                                                                                                                                                                                                                                                                                                                                                               |
| --------------------- | ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| GDPR / UK GDPR        | opt-in       | Lawful basis per processing activity, data-subject rights (access, erasure, rectification, restriction, objection, portability), controller and DPO contact, and the international-transfer mechanism. Mostly covered by the checklist in [Data retention + audit](/projects/web/website/config/data-retention); see also [ROPA](/projects/web/website/config/ropa) and [Sub-processors & transfers](/projects/web/website/config/sub-processors). |
| CCPA/CPRA             | opt-out      | Notice at collection, and the categories of personal information "sold" or "shared." This template sells and shares no personal information — state that plainly. The "Do Not Sell or Share My Personal Information" footer control already shipped; see [Cookie consent (geo modes)](/projects/web/website/config/cookie-consent-geo).                                                                                                            |
| LGPD (Brazil)         | opt-in       | The legal basis per processing activity, and the ANPD (Autoridade Nacional de Proteção de Dados) contact channel for exercising rights.                                                                                                                                                                                                                                                                                                            |
| PIPEDA (Canada)       | opt-in       | An accountability statement — who is responsible for compliance — and explicit consent language for collection, use, and disclosure.                                                                                                                                                                                                                                                                                                               |
| POPIA (South Africa)  | opt-in       | The name and contact details of the Information Officer.                                                                                                                                                                                                                                                                                                                                                                                           |
| Australia Privacy Act | opt-out      | Which Australian Privacy Principles (APP) entity the operator is, and how individuals access or correct their data.                                                                                                                                                                                                                                                                                                                                |

**PIPL (China) is out of scope.** This template ships no PIPL notice guidance
and no China-specific consent handling. Add both yourself if you serve
China-based data subjects — see the `regulations` override in
[Cookie consent (geo modes)](/projects/web/website/config/cookie-consent-geo).

## Minors and age-gating (a deliberate scope decision)

No age gate, birthdate field, or parental-consent flow ships in this
template. This is deliberate: the template targets a marketing/blog site
with no minor-targeted accounts, and Clerk sign-up collects no age field.

If you must gate minors, the extension point is `features.compliance` in
`code/projects/web/surfaces/website/src/config/features.ts`:

```ts
compliance: {
  logAnonymousConsent: false,
  ageGate: false, // add this flag, then gate sign-up / data-collection routes on it
},
```

This flag does not exist today. This shows where it would go, not a
shipped feature.

## Special-category data (a deliberate boundary)

The data model is name, email, locale, and country only. It collects no
health, biometric, genetic, political, religious, or sexual-orientation
data (the GDPR Art. 9 special categories). No special-category path is
built, by design.

If you add a field in one of those categories, add explicit consent for
it and complete a [DPIA](/projects/web/website/config/dpia-template) first.
