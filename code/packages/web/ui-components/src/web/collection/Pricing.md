> `module.pricing` · `code/packages/ui-components/src/web/collection/Pricing.tsx`

**Use when** you want a row of plan cards — each a name, price, feature list, and CTA. One tier can be highlighted with the brand ring and a badge.

## Fields

| Field     | Type     | Notes                                                                        |
| --------- | -------- | ---------------------------------------------------------------------------- |
| `tiers[]` | array    | Each a `PricingTier` (see below). **Required** — renders nothing when empty. |
| `title`   | `string` | Optional; centered heading above the cards.                                  |
| `intro`   | `string` | Optional; short line under the title.                                        |
| `anchor`  | `string` | Optional; element `id`.                                                      |

### Tier fields

| Field         | Type       | Notes                                              |
| ------------- | ---------- | -------------------------------------------------- |
| `name`        | `string`   | Plan name.                                         |
| `price`       | `string`   | Pre-formatted price (e.g. `$29`).                  |
| `period`      | `string`   | Optional; suffix after the price (e.g. `/mo`).     |
| `description` | `string`   | Optional; one line under the price.                |
| `features`    | `string[]` | Each renders with a check mark.                    |
| `highlighted` | `boolean`  | Adds the brand ring; shows `badge` when set.       |
| `badge`       | `string`   | Optional; shown only when `highlighted` is `true`. |
| `cta`         | `Cta`      | Full-width button per tier.                        |

## Notes

- Server component. Renders `null` when `tiers` is empty.
- The badge appears only when both `highlighted` is `true` and `badge` is set.
- Each CTA is a full-width `ModuleCta` (resolved page-builder link).
