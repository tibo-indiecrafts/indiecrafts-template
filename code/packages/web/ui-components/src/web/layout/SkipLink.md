> `code/packages/web/ui-components/src/web/layout/SkipLink.tsx`

**Use when** a page needs its skip-to-content link: every surface renders one as the first focusable element. The website mounts it in `DefaultLayout`; admin and app mount it first in their locale layout.

## Props

| Prop    | Type     | Notes                                                  |
| ------- | -------- | ------------------------------------------------------ |
| `label` | `string` | The link text, from the surface's `messages/<locale>`. |
| `href`  | `string` | The target. Default `#main`.                           |

## Notes

- The target is the page's one `<main id="main" tabIndex={-1}>`. `tabIndex={-1}` lets it take focus.
- Off-screen until focused (`-top-24` → `focus:top-4`). Never `display: none`: that removes it from the tab order.
- Server-safe: no hooks, no `"use client"`.
