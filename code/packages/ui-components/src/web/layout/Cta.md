# ModuleCta

> Page-builder CTA button · `renderers/Cta.tsx`

**Use when** a block needs a single call-to-action button (callout, card, hero). Exported as `ModuleCta`.

## Fields

`cta` is a `Cta` object:

| Field          | Type                                    | Default     | Notes                                                    |
| -------------- | --------------------------------------- | ----------- | -------------------------------------------------------- |
| `link.href`    | `string`                                | —           | Resolved target — internal refs are already `/blog/<slug>`. **Required.** |
| `link.label`   | `string`                                | —           | Button text. **Required.**                               |
| `link.newTab`  | `boolean`                               | —           | `true` → opens in a new tab (`rel="noopener noreferrer"`). |
| `variant`      | `"primary" \| "secondary" \| "ghost"`  | `"primary"` | Emphasis of the button.                                  |

## Notes

- Server component — renders a plain `<a>`, styled by token classes (`bg-foreground` / `bg-muted` / hover-only for `primary` / `secondary` / `ghost`).
- Renders `null` unless **both** `href` and `label` are set — a missing label surfaces the gap instead of silently shipping untranslated copy. No English fallback.
- Focus-visible ring is always present (`focus-visible:ring-ring`).
- Not the shadcn `Button` — a lightweight inline anchor for resolved page-builder links.
