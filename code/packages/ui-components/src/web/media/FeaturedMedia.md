# FeaturedMedia

> Post/page cover · `renderers/FeaturedMedia.tsx`

**Use when** a surface needs a single cover slot — a post hero, the blog frontpage, a card thumbnail — that is either an image or an inline-playable video. One box, one look.

## Props

| Prop          | Type      | Default          | Notes                                                        |
| ------------- | --------- | ---------------- | ------------------------------------------------------------ |
| `image`       | `string`  | —                | Cover URL, rendered with `next/image` (`fill`, `object-cover`). |
| `alt`         | `string`  | `""`             | Image alt text.                                              |
| `videoUrl`    | `string`  | —                | A file or YouTube/Vimeo/Dailymotion link → play affordance.  |
| `lqip`        | `string`  | —                | Base64 blur placeholder.                                     |
| `aspect`      | `string`  | `"aspect-video"` | Any Tailwind aspect utility, e.g. `aspect-[4/3]`.            |
| `sizes`       | `string`  | `"100vw"`        | `next/image` `sizes`.                                        |
| `priority`    | `boolean` | —                | Eager-load the cover (above-the-fold heroes).               |
| `interactive` | `boolean` | `true`           | `false` → static marker only, never mounts a player (linked thumbnails). |
| `autoplay`    | `boolean` | `false`          | Mounts muted + looping as an ambient backdrop, no button.   |
| `controls`    | `boolean` | `true`           | Show the native/provider player chrome.                     |
| `playLabel`   | `string`  | —                | **Required.** Accessible label for the play button/marker.  |
| `className`   | `string`  | —                | Extra classes on the outer box.                             |

## Notes

- Client component (`"use client"`) — holds the play-click state.
- Facade pattern: a click swaps the poster for the player **in place** (no modal, no dialog). Files → native `<video>`; providers → a lazy `<iframe>`.
- Browsers block unmuted autoplay, so `autoplay` implies muted + looping.
- i18n-agnostic — `playLabel` is passed in, not read from a message catalog. The play button `stopPropagation`s so it works above a stretched card link without navigating.
