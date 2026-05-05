# Branded wrappers in `ui-effects/`

`src/components/ui-primitives/` is **upstream** — vetted shadcn primitives
that get overwritten when you re-run the shadcn CLI. New drops land in
`src/components/ui/` (the staging dir) where they're linted before being
promoted into `ui-primitives/`. To customize a primitive without forking
it, add a thin wrapper here. Each wrapper folder is editable (unlike the
flat upstream files in this same directory, which are hand-copied from
Aceternity / MagicUI and treated as upstream).

## Pattern

Each wrapper has the same 5-file shape as the rest of the template:

```
<Name>/
├── <Name>.tsx          # imports the primitive, applies defaults
├── config.ts           # namespace + defaults
├── en.json             # English copy (auto-aggregated under blocks.<key>.*)
├── <Name>.stories.tsx  # Storybook
└── index.ts            # barrel
```

## When to wrap vs fork vs replace

| Scenario                                                                              | Path                                                                                             |
| ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| Primitive accepts the strings as props (English defaults)                             | **Wrap** — labels prop merged with defaults                                                      |
| Primitive hardcodes strings inside JSX on a canvas/img we can wrap with `aria-hidden` | **Wrap as decorative** — opt-in `informational` for the rare case the visual carries information |
| Primitive hardcodes asset URLs deep in JSX                                            | **Fork** — edit the upstream file; note the divergence                                           |
| Primitive hardcodes interactive button copy / a11y inside its render tree             | **Fork** — wrappers can't reach into descendants                                                 |
| Primitive's component is opaque and you want a different look                         | **Replace** — write a sibling that owns the rendering                                            |

## Current wrappers (folder children of `ui-effects/`)

### Localized labels / text

- `CommandPalette/` — wraps `Command` (defaults: title, description)
- `HeroVideoDialog/` — wraps `HeroVideoDialog` (defaults: thumbnailAlt; play-button + iframe-title remain English — see fork list below)
- `LayoutTextFlip/` — wraps `LayoutTextFlip` (defaults: text, words, duration)
- `SidebarTrigger/` — re-implements (label not exposed by upstream)
- `TweetNotFound/` — re-implements (`<h3>Tweet not found</h3>` is hardcoded)
- `WebcamPixelGrid/` — wraps `WebcamPixelGrid` (defaults: cameraAccessLabel)

### Decorative-by-default

These primitives render their own `aria-label` on internal canvases we
can't override; the wrapper marks the subtree `aria-hidden` to match how
the effect is actually used (visual flair). Pass `informational` to
opt-in to a translated label.

- `PixelatedCanvas/`
- `DitherShader/`
- `IconCloud/`
- `WorldMap/` — also ships a default `dots` route set so it renders out
  of the box

### Branded data

- `AnimatedTestimonials/` — ships translated default testimonials via
  `blocks.animated-testimonials.items.<id>`. Pass `testimonials` to
  override with caller-supplied data (e.g. CMS).

> The brand mark itself lives at `layouts/_shared/logo` (renders
> `siteConfig.logo`). Use that everywhere you'd reach for `NavbarLogo`.

## Known gaps left as flat upstream files (require a fork, not a wrapper)

These primitives hardcode user-facing strings or assets in places a
wrapper can't reach. Fork the file in place when the limitation actually
hits — accept that re-running the Aceternity sync will clobber the diff.

- `apple-cards-carousel.tsx` — prev/next/close buttons have no `aria-label`. Fork to add them.
- `hero-video-dialog.tsx` — play-button `aria-label="Play video"` + iframe `title="Hero Video player"` are inside the primitive. Fork to localize.
- `tweet-card.tsx` — verified badge `aria-label="Verified Account"` on `MagicTweet`. Fork to localize.
- `noise-background.tsx` — `<img src="https://assets.aceternity.com/noise.webp">`. Self-host the asset + fork to swap.
- `resizable-navbar.tsx` — logo URL hardcoded. Superseded for the brand-mark use case by `layouts/_shared/logo` (`siteConfig.logo`).
