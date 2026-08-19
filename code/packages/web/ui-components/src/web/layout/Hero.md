# Hero

> `module.hero` · `code/packages/ui-components/src/web/layout/Hero.tsx`

**Use when** a page needs a lead band — eyebrow, large title, subtitle, and one call-to-action. Centered, with generous vertical rhythm.

## Fields

| Field      | Type     | Notes                                                                                                |
| ---------- | -------- | ---------------------------------------------------------------------------------------------------- |
| `title`    | `string` | Large `h1`. `[[word]]` accents a word in the brand color. **Required** — renders nothing without it. |
| `eyebrow`  | `string` | Optional; small uppercase label above the title.                                                     |
| `subtitle` | `string` | Optional; short supporting line under the title.                                                     |
| `cta`      | `Cta`    | Optional; single button (`link.label`, `link.href`, `variant`).                                      |
| `anchor`   | `string` | Optional; element `id`.                                                                              |

## Notes

- Server component. Renders `null` when `title` is empty.
- Title runs through `RichTitle` — wrap a word in `[[…]]` to color it with the brand token.
- The CTA is a `ModuleCta` (resolved page-builder link), not the shadcn `Button`.
