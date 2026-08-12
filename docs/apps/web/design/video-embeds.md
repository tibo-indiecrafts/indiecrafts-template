# Featured video embeds

A post can carry a video two ways, both under `metadata` in Sanity:

- **`videoUrl`** — an embed link (YouTube / Vimeo / Dailymotion).
- **`videoFile`** — the editor **uploads their own** `.mp4` / `.webm` (a Sanity file
  asset). It **wins** over the link when both are set.

GROQ resolves them to one string: `"video": coalesce(videoFile.asset->url, videoUrl)`. An
uploaded file's CDN url ends `.mp4`/`.webm`, so it flows through the same parser as a direct
link (`kind: "file"`). Two booleans control playback: **`videoAutoplay`** (muted + looping
ambient backdrop) and **`videoControls`** (default true).

Rather than store raw `<iframe>` HTML, the template stores a plain **URL** and builds the
player itself —
so only a validated URL from a known provider ever reaches an iframe `src`. The
parsing lives in `@indiecrafts/utils` (`parseVideoEmbed`); the rendering lives in the
shared **`FeaturedMedia`** component in `@indiecrafts/ui-components`
(`renderers/FeaturedMedia.tsx`) — **one structure for a featured image or video**, used by
the post hero, the blog frontpage, and the homepage/blog cards alike.

## Why a URL, not markup

Storing raw embed HTML is a stored-XSS hole (`javascript:` / `data:` URLs,
arbitrary markup). Instead, `parseVideoEmbed(url)` accepts a string and returns a
typed descriptor — or `null` for anything unrecognized, in which case the caller
falls back to the cover image.

```ts
export type VideoEmbed =
  | { kind: "youtube"; id: string; embedSrc: string }
  | { kind: "vimeo"; id: string; embedSrc: string }
  | { kind: "dailymotion"; id: string; embedSrc: string }
  | { kind: "file"; embedSrc: string };
```

The parser is strict:

- Only `http(s)` URLs pass — `javascript:` / `data:` / `vbscript:` are hard-blocked.
- IDs are format-checked (`^[\w-]{11}$` YouTube, `^\d+$` Vimeo, `^[a-zA-Z0-9]{5,32}$` Dailymotion) before being interpolated.

## Supported providers

| `kind` | Accepted hosts / inputs | `embedSrc` produced |
| --- | --- | --- |
| `youtube` | `youtu.be/<id>`, `youtube.com/watch?v=<id>`, `youtube.com/embed/<id>`, `m.youtube.com`, `youtube-nocookie.com` (leading `www.` stripped) | `https://www.youtube-nocookie.com/embed/<id>` |
| `vimeo` | `vimeo.com/<id>`, `player.vimeo.com/video/<id>` | `https://player.vimeo.com/video/<id>` |
| `dailymotion` | `dailymotion.com/video/<id>`, `/embed/video/<id>`, short `dai.ly/<id>` (a `_title` suffix is stripped) | `https://www.dailymotion.com/embed/video/<id>` |
| `file` | direct video URL ending `.mp4` / `.webm` / `.ogg` / `.mov` | the URL itself |

YouTube always resolves to the **privacy-preserving** `youtube-nocookie.com` host —
no cookies until the visitor actually plays.

::: warning
Every embed host must be allow-listed in the `frame-src` CSP directive in `next.config.ts`
(currently `youtube-nocookie.com`, `player.vimeo.com`, `www.dailymotion.com`). **Uploaded
files** play in a native `<video>`, so the Sanity CDN must be in **`media-src`**
(`'self' blob: https://cdn.sanity.io`) — without it the `<video>` falls back to
`default-src 'self'` and is blocked. Add a provider → add its host to `frame-src`.
:::

## Rendering: `FeaturedMedia`

`@indiecrafts/ui-components` `renderers/FeaturedMedia.tsx` renders the cover — image **or**
video — in one fixed-aspect box. It takes the image, an optional `videoUrl`, an `aspect`,
and a `playLabel`; internally it calls `parseVideoEmbed`, so callers don't:

```tsx
<FeaturedMedia
  image={post.metadata?.image?.asset?.url}
  alt={post.metadata?.image?.alt ?? title}
  videoUrl={post.metadata?.videoUrl}
  lqip={post.metadata?.image?.asset?.metadata?.lqip}
  aspect="aspect-video"
  sizes="(min-width: 1280px) 1152px, 100vw"
  playLabel={t("playVideo")}
/>
```

Key behaviors:

- **Inline play, no dialog.** A video shows a play button over the poster; clicking it swaps
  the poster for the player **in place** (`useState`) — the video plays where the image was,
  in cards and heroes alike. There is no modal.
- **`autoplay` (ambient backdrop).** Mounts the player immediately, muted + looping, with no
  play button — browsers block unmuted autoplay, so ambient video is always muted. For
  embeds, the iframe url gets `mute=1`; `controls=0` is added when `controls` is off.
  Honored on the **post hero only** — listing cards stay facade/badge so a page isn't N
  autoplaying iframes.
- **Lazy mount** — the third-party iframe (or `<video>`) mounts only on click, so nothing
  loads unprompted (facade / lite-embed pattern).
- **`file` → native `<video controls autoPlay playsInline>`**; **`youtube` / `vimeo` / `dailymotion` → `<iframe>`** with `autoplay=1` (YouTube also `rel=0`) and a `strict-origin-when-cross-origin` referrer policy.
- **`interactive={false}`** renders only a small marker (for thumbnails that just link to the
  post) and never mounts a player.
- **Image + lqip blur, CDN-sized** via `next/image`; keyboard-operable play button; reduced-motion safe. `playLabel` is passed in (i18n-agnostic component).

## Card integration

Cards wrap the media with a **stretched title link** (`after:absolute after:inset-0`) so a
click anywhere opens the post, while the play button (raised `z-10`, `stopPropagation`) plays
inline without navigating — valid HTML (the `<button>` is a sibling of the link, never nested
inside it). See `BlogCard`, `FeaturedArticles`, and the post hero for the pattern.
