# Featured video embeds

A post can carry a video (`metadata.videoUrl` in Sanity). Rather than store raw
`<iframe>` HTML, the template stores a plain **URL** and builds the player itself —
so only a validated URL from a known provider ever reaches an iframe `src`. The
parsing lives in `@indiecrafts/utils` (`parseVideoEmbed`); the player is the shared
`VideoEmbed` renderer in `@indiecrafts/ui-components`
(`renderers/VideoEmbed.tsx`) — so the blog post hero and any page-builder
media/embed block share one player.

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
Every embed host must also be allow-listed in the `frame-src` CSP directive in
`next.config.ts`. It currently allows `https://www.youtube-nocookie.com`,
`https://player.vimeo.com`, and `https://www.dailymotion.com`. Add a provider to the
parser → add its host to `frame-src`.
:::

## Rendering: `VideoEmbed`

`@indiecrafts/ui-components` `renderers/VideoEmbed.tsx` is the consumer. It imports the
`VideoEmbed` type from `@indiecrafts/utils` and the Radix `Dialog` from
`@indiecrafts/ui/dialog`, takes a parsed `embed` plus a poster and labels, and renders a
poster thumbnail with a play button that opens an accessible modal player (focus trap,
Escape, overlay):

```tsx
const embed = parseVideoEmbed(post.metadata?.videoUrl);
if (embed) {
  <VideoEmbed
    embed={embed}
    poster={coverUrl}
    title={post.title}
    playLabel={t("play")}
    closeLabel={t("close")}
  />;
}
```

Key behaviors:

- **Lazy mount** — the third-party iframe (or `<video>`) only mounts when the dialog opens, so nothing loads unprompted.
- **`file` → native `<video controls autoPlay>`**; **`youtube` / `vimeo` / `dailymotion` → `<iframe>`** with `autoplay=1` (YouTube also gets `rel=0`) and a `strict-origin-when-cross-origin` referrer policy.
- **16:9, keyboard-operable, reduced-motion safe** — labels (`playLabel`, `closeLabel`, `title`) are passed in (i18n-agnostic component), resolved from `messages` by the caller.

## Where else it's used

`parseVideoEmbed` is also used as a **flag**: `FeaturedArticles.tsx` calls it just
to decide whether to overlay a `<PlayBadge>` (also in `@indiecrafts/ui-components`) on a
post's thumbnail (`const hasVideo = !!parseVideoEmbed(post.metadata?.videoUrl)`). Same
validation, no player mounted. `PlayBadge` takes its `label` as a prop so the shared
component stays i18n-agnostic. See [Featured articles](./featured-articles.md).
