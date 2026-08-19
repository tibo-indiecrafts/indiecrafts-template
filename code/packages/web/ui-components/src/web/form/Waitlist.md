# Waitlist (`module.waitlist`)

Early-access signup block. Server `<Waitlist>` wrapper (feature gate) → client
`<WaitlistForm>`. Posts to `/api/waitlist` → a `waitlistEntry` doc in Sanity
(`@indiecrafts/waitlist`). Collect + export only — no runtime gating.

## Props (resolved from the block, per-locale)

| Prop               | Type                             | Notes                                                                |
| ------------------ | -------------------------------- | -------------------------------------------------------------------- |
| `heading`          | `string`                         | Section heading.                                                     |
| `body`             | `string`                         | Supporting line.                                                     |
| `emailPlaceholder` | `string`                         | Email input placeholder.                                             |
| `namePlaceholder`  | `string`                         | **Empty = no name field** (email only). Set it to show a name input. |
| `buttonLabel`      | `string`                         | Submit button text.                                                  |
| `consentText`      | `string`                         | Required GDPR checkbox label; submit disabled until ticked.          |
| `successMessage`   | `string`                         | Shown on `201`.                                                      |
| `alreadyMessage`   | `string`                         | Shown on `200` (already on the list).                                |
| `errorMessage`     | `string`                         | Shown on any failure.                                                |
| `variant`          | `"card" \| "inline" \| "banner"` | Layout. Default `card`.                                              |
| `anchor`           | `string`                         | Section `id` for in-page links.                                      |

## Variants

- **card** — bordered, centered card. The default; safe inside a post body.
- **inline** — copy left, form right; stacks on mobile.
- **banner** — full-width `bg-primary` band, centered.

## Notes

- **Gated.** The server `<Waitlist>` wrapper renders `null` when `features.waitlist` is off; the `/api/waitlist` route 404s in lockstep.
- **Honeypot.** A hidden off-screen `website` field — bots that fill it still get `201`.
- The client half posts `{ email, name?, consent, source: location.pathname, honeypot }`. `name` is only sent when a `namePlaceholder` is configured.
- No refs, no images → passes straight through `MODULES_FRAGMENT`.
