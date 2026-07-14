# DESIGN.md — indiecrafts.dev design system

The visual language and its tokens. Everything here is **config-first**: values
live in `src/config/index.ts` (`theme`, `fonts`) and are mirrored as CSS vars in
`src/app/globals.css`, then exposed as Tailwind v4 utilities. Edit the config and
globals together, never hard-code. Deeper guides live in `docs/design/` and
`docs/config/theme-modes.md`.

## Personality

Quiet, modern, editorial. A single indigo accent doing one job at a time; near-
neutral greys everywhere else; generous whitespace; one deliberate "signature"
moment per surface rather than scattered flourishes. Restraint is the brand.

## Color tokens

OKLCH at runtime (`globals.css`), with **hex mirrors** in `theme.hexColors` for
`next/og` — Satori can't parse oklch, so **keep the two in sync** for the
brand/foreground pair. Accent hue is a retuned indigo (**hue 260**).

| Token                  | Light                          | Dark                    | Role                           |
| ---------------------- | ------------------------------ | ----------------------- | ------------------------------ |
| `background`           | `oklch(1 0 0)` #ffffff         | `oklch(0.145 0 0)`      | page surface                   |
| `foreground`           | `oklch(0.145 0 0)` #171717     | `oklch(0.985 0 0)`      | body text                      |
| `brand`                | `oklch(0.55 0.18 260)` #4f69d9 | `oklch(0.72 0.16 260)`  | the accent (lighter in dark)   |
| `brand-foreground`     | `oklch(0.985 0 0)`             | `oklch(0.145 0 0)`      | text on brand                  |
| `muted`                | `oklch(0.97 0 0)`              | `oklch(0.205 0 0)`      | soft surfaces                  |
| `muted-foreground`     | `oklch(0.556 0 0)`             | `oklch(0.708 0 0)`      | secondary text                 |
| `border`               | `oklch(0.84 0 0)`              | `oklch(0.5 0 0)`        | hairlines (dark bumped for AA) |
| `ring`                 | = brand                        | = brand                 | focus ring                     |
| `destructive`          | `oklch(0.577 0.245 27.325)`    | —                       | errors (red-600)               |
| `selection-bg` / `-fg` | pale indigo / foreground       | indigo-800 / foreground | text selection                 |

`primary`→`brand`, `accent`→`muted`, `card`→`background` are shadcn aliases.
Use utilities (`bg-brand`, `text-muted-foreground`, `ring-border`) — never raw hex.

## Typography

**Pairing** (`config.fonts`, registry in `src/lib/fonts.ts`):

| Role    | Font                   | Source                             | Var → utility               |
| ------- | ---------------------- | ---------------------------------- | --------------------------- |
| display | **Satoshi** (variable) | local `.woff2` (`next/font/local`) | `--font-display` → headings |
| body    | **Geist**              | Google (`next/font`, self-hosted)  | `--font-sans` → `font-sans` |
| mono    | **Geist Mono**         | Google                             | `--font-mono` → `font-mono` |

`--font-display` drives all `h1–h6` (set `display: "geist"` for a single-face
look). Swapping the pairing is a one-line edit in `config.fonts`.

**Scale** (the recurring treatment across sections):

- Eyebrow — `text-xs font-medium uppercase tracking-widest text-brand`
- Section heading — `text-3xl lg:text-4xl font-semibold tracking-tight text-balance`
- Hero H1 — `text-3xl md:text-5xl xl:text-6xl font-bold tracking-tight`
- Body — base, `text-muted-foreground` for secondary; `text-balance`/`text-pretty` on headings/leads

**Locale-aware typographic rules** live in `messages.<locale>.typography.*` —
quote marks (`" "` en / `« »` fr), date/time formats, Oxford comma, thousands
separator, and a **non-breaking space before `: ; ? ! %`** in French. See
`docs/design/typography.md`.

## Spacing, radius, container

- Radii (`theme.radii`): `sm 0.375rem` · `md 0.5rem` (`--radius`) · `lg 0.75rem` · `xl 1rem`. Cards use `rounded-xl`.
- Container: `--max-container` **1280px**, page gutter `--gutter` **1rem** (`px-(--gutter)`).
- Section rhythm: `border-t py-16 md:py-24`, centered intro capped at `max-w-2xl`.

## Dark mode

Two triggers, both mapped to the same tokens: the attribute
`html[data-theme="dark"]` (next-themes toggle) **and** `@media (prefers-color-scheme: dark)`
(so no-JS surfaces like `/maintenance` still adapt). `@custom-variant dark` binds
`dark:` to the attribute. Availability (`light`/`dark`/`system`/`forced`) is
declared in `config.themeConfig` → resolved in `@/lib/theme`.

## Motion

Sparing and purposeful — one signature per surface (e.g. the maintenance status
dot's pulse, the featured lead's hover scale), never ambient clutter. **Always**
guard transforms with `motion-reduce:` (e.g. `motion-reduce:transition-none`,
`motion-reduce:group-hover:scale-100`). Respect `prefers-reduced-motion`.

## Component patterns

- **Cards** — `bg-card ring-1 ring-border/60 rounded-xl shadow-sm`; hover lifts subtly.
- **Focus** — every interactive element: `focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none`.
- **Eyebrow marker** — a short brand rule (`h-px w-8 bg-brand`) or a small dot preceding the label; use it to _encode_ something (status, category), not as decoration.
- **Icons** — Lucide for UI, Reicon (outline/filled) for range, Reicon Brands for logos; `aria-hidden` unless the sole label. See `docs/design/icons.md`.

## Accessibility bar (non-negotiable)

WCAG 2.1 **AA**. `pnpm verify:contrast` asserts AA on the theme tokens (run after
any color change). `jsx-a11y` rules are all **errors** in eslint. One
`<main id="main" tabIndex={-1}>` per layout; `SkipLink` first in the body;
`<section aria-labelledby>`; `<html lang>` + `dir` from the active locale.
