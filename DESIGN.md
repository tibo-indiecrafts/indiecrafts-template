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

Colors carry **roles, not preferences** — each has a job description, not just a
hex. OKLCH in `globals.css` is authoritative; the front-matter hex are sRGB
mirrors (`theme.hexColors` must stay synced with `theme.colors` for the brand
pair — `next/og`'s Satori can't parse oklch). Always use utilities (`bg-brand`,
`text-muted-foreground`), never raw hex.

- **`brand` (indigo, hue 260)** — primary actions, focus rings, active nav, the
  single eyebrow accent. It marks _the one important thing_ on a surface.
  **Never** a decorative fill; never error/success. Lightens to `brand-dark` in
  dark mode to hold contrast.
- **`foreground` / `muted-foreground`** — primary text / secondary + captions.
  The only two text colors — don't invent greys.
- **`muted`** — soft surfaces (chips, alternating section backgrounds). Never text.
- **`border`** — hairlines + rings only (`border-dark` bumped to ~neutral-500 for
  AA on near-black).
- **`destructive`** — error/validation states only, never decorative.
- **`background` / `card`** — page and raised-surface fills.

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

**Long-form prose** uses shadcn **Typeset** (`src/app/typeset.css`, imported
after Tailwind) — wrap rendered content in `<div class="typeset typeset-docs">`.
It owns only the prose _rhythm_; **fonts have a single owner** — headings and
body inherit the config-driven `--font-*` base rules (`globals.css`), so Typeset
never re-declares the pairing (it only sets `--font-mono` for code, which the
base rules don't cover). Flips light/dark via the tokens; coexists with `prose`.

## Layout & Spacing

- Container: max **1280px** (`--max-container`), page gutter **1rem**
  (`--gutter`, applied as `px-(--gutter)`).
- Section rhythm: `border-t py-16 md:py-24`, with a centered intro capped at
  `max-w-2xl`. Content columns cap around `max-w-5xl/6xl`; article prose at
  `max-w-3xl` for readable line length.
- Base spacing is Tailwind's default 0.25rem scale.

## Responsive behavior

Mobile-first — mobile is a different context, not a squeezed desktop. Breakpoints
are Tailwind's (`sm 640 · md 768 · lg 1024 · xl 1280`).

- Grids collapse `grid-cols-1 → md:2 → lg:3`; hero type scales
  `text-3xl → md:5xl → xl:6xl`.
- Section-layout modules render **bare inline** inside prose (no page gutter) so
  they never double-pad on mobile.
- Every desktop-only affordance has a mobile equivalent: the sticky TOC sidebar
  (`lg`+) becomes a collapsible "On this page" disclosure below `lg`.
- Touch targets ≥ 40px; hover-only affordances (tooltips) are `sm:`-gated.
- Nothing scrolls horizontally — wide media/tables get their own `overflow-x`.
- **Always verify** any UI change renders correctly at **mobile (375px),
  tablet (768px), and desktop (1280px)** before shipping — never assume a desktop
  layout reflows. Check the layout, type scale, spacing, and that nothing
  overflows or clips at each size.

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
- **States** — a component is its appearance _and_ its behavior. Interactive
  elements handle keyboard, `focus-visible`, disabled, loading (async), and error;
  **never signal state by color alone**. Use the Radix primitive for
  dialogs/menus/tabs/tooltips (focus trap, Escape, return-focus) — don't hand-roll it.
- **Icons** — Lucide (UI), Reicon outline/filled (range), Reicon Brands (logos);
  `aria-hidden` unless the sole label. Don't substitute Unicode glyphs or add a
  new icon set.

## Component conventions (shadcn/ui + Tailwind v4)

Primitives in `user-interface/ui` are shadcn (Radix behavior + Tailwind styling,
CLI-managed — don't hand-edit). Build on them the shadcn way:

- **Merge classes with `cn()`** (`@/lib/utils`) — never string-concatenate.
  tailwind-merge resolves conflicts and lets a passed `className` win, so a
  component's own classes come first and `{className}` last.
- **Vary with `cva`, not forks** — add a case to the `cva()` map + its union
  type; don't copy a component to change one look.
- **Extend least → most effort:** tweak a token → add a `cva` variant → wrap the
  primitive → compose primitives → (only then) a new shared part.
- **`asChild`** to change the rendered element (a `Button` that's really a
  `Link`) instead of nesting wrappers. **`data-slot`** is the styling hook —
  target parts via `[data-slot="…"]`, don't reach into internals.
- **Semantic tokens over `dark:`** — `bg-card` / `text-foreground` flip
  automatically through the CSS vars, so `dark:` overrides should be rare.
- **Tailwind v4:** container queries (`@container` / `@xl`) are core — use them
  when a component's _own_ width should drive its layout. Plugins load via
  `@plugin` in the single `globals.css`; never add a second Tailwind config.

## Do's and Don'ts

- **Do** use colors by their role — `brand` earns attention, the two greys carry
  everything else.
- **Do** keep OKLCH authoritative; re-sync `theme.hexColors` on any brand change
  and run `pnpm verify:contrast` (WCAG **AA**) after.
- **Do** guard every transform with `motion-reduce:`, and spend boldness once per
  surface — keep everything around it quiet.
- **Do** expose a missing token — name the semantic role and propose adding it;
  never bury a raw value inside a component to paper over the gap.
- **Don't** hard-code colors/spacing/fonts, or invent a grey outside the token
  scale.
- **Don't** use `brand` decoratively, or the display font for body copy.
- **Don't** wrap every content group in a card — reach for spacing, a heading, or
  a divider first; a card is for content that needs its own surface.
- **Don't** mix `rounded` scales, add drop-shadows to flat cards (use `ring` +
  `shadow-sm`), or ship an interactive element without a `focus-visible` ring.

## Definition of done (UI)

A screen that renders is not done. Before calling a UI task complete:

1. **Reused** existing parts where possible — no near-duplicate component.
2. **Tokens only** — no raw colors/spacing/fonts; any genuinely new token is
   surfaced and proposed, not buried.
3. **All states** covered where relevant: loading, empty, error, disabled, success.
4. **Keyboard + `focus-visible`** work; no state communicated by color alone.
5. **Verified at 375 / 768 / 1280** — nothing overflows, clips, or mis-reflows.
6. `pnpm verify:quick` passes and the result matches the reference.
7. **Listed** any intentional deviation, and any new component / variant / token.
