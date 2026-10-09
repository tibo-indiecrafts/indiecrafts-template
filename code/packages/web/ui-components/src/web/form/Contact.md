Contact form block. Server `<Contact>` wrapper (feature gate) → client
`<ContactForm>`. Posts to `/api/contact` → a `contactMessage` doc in Sanity
(`@indiecrafts/modules-web-contact`). Every message is stored + (best-effort) emailed to the
sender and the team.

## Props (resolved from the block, per-locale)

| Prop                 | Type                 | Notes                                                         |
| -------------------- | -------------------- | ------------------------------------------------------------- |
| `heading`            | `string`             | Section heading.                                              |
| `body`               | `string`             | Supporting line.                                              |
| `emailPlaceholder`   | `string`             | Email input placeholder.                                      |
| `namePlaceholder`    | `string`             | **Empty = no name field.** Set it to show a name input.       |
| `subjectPlaceholder` | `string`             | **Empty = no subject field.** Set it to show a subject input. |
| `messagePlaceholder` | `string`             | Message textarea placeholder (the field is always shown).     |
| `buttonLabel`        | `string`             | Submit button text.                                           |
| `consentText`        | `string`             | Required GDPR checkbox label; submit disabled until ticked.   |
| `successMessage`     | `string`             | Shown on `201`.                                               |
| `errorMessage`       | `string`             | Shown on any failure.                                         |
| `variant`            | `"card" \| "banner"` | Layout. Default `card`.                                       |
| `anchor`             | `string`             | Section `id` for in-page links.                               |

## Variants

- **card** — bordered, centered card. The default; safe inside a post body.
- **banner** — full-width `bg-primary` band.

## Notes

- **Gated.** The server `<Contact>` wrapper renders `null` when `features.contact` is off; the `/api/contact` route 404s in lockstep. It also renders `null` when the Studio switch (`contactSettings.enabled`) is off — `formBlock`, fed by `MODULES_FRAGMENT`.
- **Honeypot.** A hidden off-screen `website` field — bots that fill it still get `201`.
- The client half posts `{ email, message, name?, subject?, consent, source: location.pathname, honeypot }`. `name`/`subject` are only sent when their placeholder is configured.
- The owner alert email sets `reply-to` to the sender, so hitting Reply answers the person.
- No refs, no images → passes straight through `MODULES_FRAGMENT`.
