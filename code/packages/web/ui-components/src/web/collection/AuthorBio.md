> `code/packages/ui-components/src/web/collection/AuthorBio.tsx`

**Use when** you want an end-of-article "Written by" block — one card per author with avatar, name (linked), role, and a short bio. Generic over resolved author data.

## Props

| Prop        | Type                                             | Notes                                       |
| ----------- | ------------------------------------------------ | ------------------------------------------- |
| `authors[]` | `{ name, role?, bio?, imageUrl?, href?, _key? }` | One card each; entries without a name drop. |
| `label`     | `string`                                         | Section heading (e.g. "Written by").        |

## Notes

- `next/image` avatar (falls back to an initial); plain `<a href>` name link (host localizes).
- Renders `null` when there are no named authors.
