---
version: alpha
name: Indiecrafts
description: Quiet, editorial minimalism — one indigo accent on near-neutral greys, generous whitespace, one signature moment per surface. Config-first (src/config/index.ts + src/app/globals.css). OKLCH is authoritative at runtime; the hex below are sRGB mirrors for tooling + next/og.
colors:
  # Light (sRGB mirrors of the OKLCH tokens in globals.css)
  background: "#ffffff"
  foreground: "#171717"
  brand: "#4f69d9"
  brand-foreground: "#ffffff"
  muted: "#f5f5f5"
  muted-foreground: "#737373"
  border: "#d4d4d4"
  ring: "{colors.brand}"
  destructive: "#dc2626"
  # Dark
  background-dark: "#0a0a0a"
  foreground-dark: "#fafafa"
  brand-dark: "#818cf8"
  muted-dark: "#262626"
  muted-foreground-dark: "#a3a3a3"
  border-dark: "#737373"
typography:
  hero:
    fontFamily: Satoshi
    fontSize: 48px
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: -0.02em
  heading:
    fontFamily: Satoshi
    fontSize: 36px
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: -0.02em
  body:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: normal
  eyebrow:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0.1em
  code:
    fontFamily: Geist Mono
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.5
rounded:
  sm: 0.375rem
  md: 0.5rem
  lg: 0.75rem
  xl: 1rem
  full: 9999px
spacing:
  gutter: 1rem
  section-y: 4rem
  section-y-lg: 6rem
  container-max: 1280px
components:
  button-primary:
    backgroundColor: "{colors.brand}"
    color: "{colors.brand-foreground}"
    borderRadius: "{rounded.md}"
  card:
    backgroundColor: "{colors.background}"
    borderColor: "{colors.border}"
    borderRadius: "{rounded.xl}"
  chip:
    backgroundColor: "{colors.muted}"
    color: "{colors.muted-foreground}"
    borderRadius: "{rounded.md}"
---

# Indiecrafts — Design System

Machine-readable tokens live in the front matter above; the prose below is the
"why". Deeper guides: `docs/design/`, `docs/config/theme-modes.md`.

## Brand & Style

Quiet, modern, editorial — "restraint is the brand." A single indigo accent
(`brand`, hue 260) does one job at a time; everything else is near-neutral grey
with generous whitespace. Each surface earns **one** deliberate signature moment
(a pulsing status dot, an asymmetric featured lead) rather than scattered
flourishes. Audience: developers and agencies shipping client sites — it should
read as crafted and calm, never busy or templated.

## Colors

OKLCH in `globals.css` is authoritative; the front-matter hex are sRGB mirrors
(`theme.hexColors` must stay in sync with `theme.colors` for the brand pair —
`next/og`'s Satori can't parse oklch). Use utilities (`bg-brand`,
`text-muted-foreground`, `ring-border`), never raw hex. The accent lightens in
dark mode (`brand` → `brand-dark`) to hold contrast; `border-dark` is bumped to
`~neutral-500` to keep hairlines AA-visible on near-black.

## Typography

- **Display — Satoshi** (self-hosted variable `.woff2`): all `h1–h6` via
  `--font-display`. Tight tracking, heavier weights for hero/section titles.
- **Body — Geist** (Google, self-hosted): UI + prose via `--font-sans`.
- **Mono — Geist Mono**: code + tabular figures via `--font-mono`.

Think in roles, not sizes: `eyebrow` (uppercase, `tracking-widest`, `brand`) →
`heading` → `hero` → `body` (secondary text is `muted-foreground`). The pairing
is one line in `config.fonts`; set `display: geist` for a single-face look.
Locale-aware punctuation (quotes, dates, French NBSP before `: ; ? !`) lives in
`messages.<locale>.typography.*`.

## Layout & Spacing

- Container: max **1280px** (`--max-container`), page gutter **1rem**
  (`--gutter`, applied as `px-(--gutter)`).
- Section rhythm: `border-t py-16 md:py-24`, with a centered intro capped at
  `max-w-2xl`. Content columns cap around `max-w-5xl/6xl`; article prose at
  `max-w-3xl` for readable line length.
- Base spacing is Tailwind's default 0.25rem scale.

## Elevation & Depth

Flat by default — depth comes from **hairline rings + tonal surfaces**, not heavy
shadows. Cards sit on `bg-card` with `ring-1 ring-border/60` and at most a
`shadow-sm`; hover lifts a touch (`hover:shadow-md`, subtle scale). Overlays
(dialogs, hero gradients) are the only place real shadow/scrim appears.

## Shapes

Soft but disciplined. Radii: `sm 0.375rem` · `md 0.5rem` (`--radius`, the
default) · `lg 0.75rem` · `xl 1rem`. Cards and media use `rounded-xl`; pills and
status dots use `full`. Don't mix radii within one component.

## Components

- **Buttons** — Primary: `brand` bg, `brand-foreground` text, `rounded-md`, no
  shadow. Secondary: transparent, `1px border`, `rounded-md`.
- **Cards** — `bg-card ring-1 ring-border/60 rounded-xl shadow-sm`.
- **Chips / badges** — `bg-muted text-muted-foreground rounded-md`, `text-xs`.
- **Eyebrow marker** — a short brand rule (`h-px w-8 bg-brand`) or dot before the
  label; it should **encode** something (status, category), not decorate.
- **Focus** — every interactive element:
  `focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none`.
- **Icons** — Lucide (UI), Reicon outline/filled (range), Reicon Brands (logos);
  `aria-hidden` unless the sole label.

## Do's and Don'ts

- **Do** keep OKLCH (`globals.css`) authoritative and re-sync `theme.hexColors`
  on any brand-color change; run `pnpm verify:contrast` (WCAG **AA**) after.
- **Do** guard every transform with `motion-reduce:` and respect
  `prefers-reduced-motion`.
- **Do** spend boldness once per surface; keep everything around it quiet.
- **Don't** hard-code colors, spacing, or fonts — read tokens from `@/config`
  and the CSS vars.
- **Don't** mix `rounded` scales or add drop-shadows to flat surfaces.
- **Don't** ship an interactive element without a visible `focus-visible` ring.
