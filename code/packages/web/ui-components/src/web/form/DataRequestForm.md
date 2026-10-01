The **GDPR data-subject request form** — a visitor picks a right (access, rectification, erasure,
restriction, portability, objection, withdraw consent), gives their email and an optional message,
and submits. Posts to **`/api/data-request`**, which stores the request in the api's `data_requests` table
(D1) and alerts the controller by email. Satisfies Art. 15–21 (+ Art. 7 consent withdrawal) for a site with
no user accounts — a routed request, not a self-service export.

Mirrors `NewsletterForm`: a hidden **honeypot** + a render-time timestamp block bots, and
`TurnstileWidget` gates submit when `NEXT_PUBLIC_TURNSTILE_SITE_KEY` is set. `201` → stored.

## Props

All copy is **passed in** (resolved server-side from `messages` by the route shell) — the component
imports no app messages.

| Prop                                              | Type                 | Notes                                                                 |
| ------------------------------------------------- | -------------------- | --------------------------------------------------------------------- |
| `legend`                                          | `string`             | Radio-group question ("Which right…?").                               |
| `options`                                         | `{ value; label }[]` | `value` = a compliance request-type key; `label` localized.           |
| `emailLabel` · `emailPlaceholder`                 | `string`             | Email field.                                                          |
| `messageLabel` · `messagePlaceholder`             | `string`             | Optional message field.                                               |
| `consentText`                                     | `string`             | Consent-to-process checkbox (unticked; submit blocked until checked). |
| `submitLabel` · `successMessage` · `errorMessage` | `string`             | Button + result states.                                               |
| `heading` · `body`                                | `string?`            | Optional intro. `heading` renders as the page `<h1>`.                 |
| `locale`                                          | `string?`            | Active locale — stamped on the stored record.                         |

## Where it's used

The app's `/data-request` route shell resolves the copy from `messages.legal.dataRequest.*` and the
option labels for the seven `DATA_REQUEST_TYPES` (`@indiecrafts/packages-web-compliance/requests/request-types`),
then renders this form. Logic lives in `@indiecrafts/packages-web-compliance` (`submitDataRequest`); the request
type list, validator, and record schema all read the one `DATA_REQUEST_TYPES` set.
