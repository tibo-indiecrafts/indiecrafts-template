> `module.newsletter` renderer · `renderers/web/form/Newsletter.tsx` (+ client `NewsletterForm.tsx`)

**Use when** a page or post needs an email capture block. Editors drop it inline in a body or into `postModules`; every string is per-instance and per-locale. Submits to `/api/newsletter`, which emails a double opt-in link; the confirm click adds the person to Resend, the only list ([Newsletter](/modules/web/newsletter/)).

## Fields

| Field              | Type                             | Notes                                                          |
| ------------------ | -------------------------------- | -------------------------------------------------------------- |
| `heading`          | `string`                         | Required in the schema.                                        |
| `body`             | `string`                         | Short pitch under the heading.                                 |
| `emailPlaceholder` | `string`                         | Also the input's screen-reader label.                          |
| `buttonLabel`      | `string`                         | Submit button text.                                            |
| `consentText`      | `string`                         | Required GDPR checkbox label; submit is disabled until ticked. |
| `successMessage`   | `string`                         | Shown on `201`.                                                |
| `errorMessage`     | `string`                         | Shown on any failure.                                          |
| `variant`          | `"card" \| "inline" \| "banner"` | Layout. Default `card`.                                        |
| `anchor`           | `string`                         | Section `id` for in-page links.                                |

## Variants

- **card** — bordered, centered card. The default; safe inside a post body.
- **inline** — copy left, email + button right; stacks on mobile. Compact.
- **banner** — full-width `bg-primary` band, centered. No image (token band only).

## Notes

- **Gated.** The server `<Newsletter>` wrapper renders `null` when `features.newsletter` is off; the `/api/newsletter` route 404s in lockstep.
- **Honeypot.** A hidden off-screen `website` field. Bots that fill it still get `201`, so they cannot tell they were dropped.
- The client half posts `{ email, consent, source: location.pathname, honeypot }`. `source` records the page the signup came from.
- No refs, no images → passes straight through `MODULES_FRAGMENT`'s leading spread; no query projection.
