> `module.lead-magnet` renderer · `web/form/LeadMagnet.tsx` (+ client `LeadMagnetForm.tsx`)

**Use when** a page or post needs an email capture tied to a downloadable resource (a guide, checklist, template). Editors drop it inline in a body or into `postModules`; every string is per-instance and per-locale. Picks the `leadMagnet` document to send, then submits to `/api/newsletter` with `source: "lead-magnet"` and the magnet id as a tag — gated delivery reads those to send the right document.

## Fields

| Field              | Type                             | Notes                                                          |
| ------------------ | -------------------------------- | -------------------------------------------------------------- |
| `magnet`           | `reference` → `leadMagnet`       | Required. The document sent after e-mail confirmation.         |
| `heading`          | `string`                         | Required in the schema.                                        |
| `body`             | `string`                         | Short pitch under the heading.                                 |
| `emailPlaceholder` | `string`                         | Also the input's screen-reader label.                          |
| `buttonLabel`      | `string`                         | Submit button text.                                            |
| `consentText`      | `string`                         | Required GDPR checkbox label; submit is disabled until ticked. |
| `successMessage`   | `string`                         | Shown on `201`.                                                |
| `alreadyMessage`   | `string`                         | Shown on `200` (email already on the list).                    |
| `errorMessage`     | `string`                         | Shown on any failure.                                          |
| `variant`          | `"card" \| "inline" \| "banner"` | Layout. Default `card`.                                        |
| `anchor`           | `string`                         | Section `id` for in-page links.                                |

## Variants

- **card** — bordered, centered card. The default; safe inside a post body.
- **inline** — copy left, email + button right; stacks on mobile. Compact.
- **banner** — full-width `bg-primary` band, centered. No image (token band only).

## Notes

- **Gated.** The server `<LeadMagnet>` wrapper renders `null` when `features.newsletter` is off (it shares the newsletter gate); the `/api/newsletter` route 404s in lockstep.
- **Honeypot.** A hidden off-screen `website` field. Bots that fill it still get `201`, so they cannot tell they were dropped.
- The client half posts `{ email, consent, source: "lead-magnet", tags, honeypot }`. `tags` is `[magnet.id]` when a magnet is set — the signal for gated delivery.
- Has one reference (`magnet`) → `MODULES_FRAGMENT` dereferences it to `{ id }`.
