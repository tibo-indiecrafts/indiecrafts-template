# ShareButtons

> `code/packages/ui-components/src/web/layout/ShareButtons.tsx`

**Use when** you want a share row — X / LinkedIn / Facebook + copy-link — for any URL. The blog post mounts it inline (post URL + title); `DefaultLayout` mounts it in the footer for a site-wide "share this page".

## Props

| Prop     | Type                                             | Notes                                       |
| -------- | ------------------------------------------------ | ------------------------------------------- |
| `url`    | `string`                                         | Absolute URL to share (host resolves it).   |
| `title`  | `string`                                         | Pre-fill text for the X intent.             |
| `labels` | `{ label, x, linkedin, facebook, copy, copied }` | i18n strings (aria-labels + the row label). |

## Notes

- `"use client"` — copy-link uses the clipboard API. The share links are plain `<a target="_blank">` (work without JS).
- Icons: `BrandIcon` (X / LinkedIn / Facebook) + lucide `Link2` / `Check` for copy.
