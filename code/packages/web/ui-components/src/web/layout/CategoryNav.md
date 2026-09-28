> `code/packages/ui-components/src/web/layout/CategoryNav.tsx`

**Use when** you want a horizontal category bar under a header — top-level categories, each optionally opening a dropdown of sub-categories. Built for the blog category nav; generic over resolved `{ title, href }` items.

## Props

| Prop       | Type                                | Notes                                             |
| ---------- | ----------------------------------- | ------------------------------------------------- |
| `items[]`  | `{ title, href, children?, _key? }` | Top-level categories. `children` → a dropdown.    |
| `label`    | `string`                            | Accessible name for the `<nav>`.                  |
| `allLabel` | `string`                            | Prefix for the "all of {category}" dropdown link. |

## Notes

- `"use client"` — the dropdown is a shadcn `NavigationMenu` (Radix; keyboard + focus handled).
- Plain `<a href>` (resolved hrefs) — the host localizes them.
- Renders `null` when `items` is empty.
