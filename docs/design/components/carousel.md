# Carousel

> shadcn `carousel` · `src/user-interface/ui/carousel.tsx`

**Use when** showcasing a small set of equal-weight, visual items (featured work, testimonials, gallery) where browsing is optional and space is tight. **Don't** use it for primary content, sequential steps, or anything the user must not miss — carousels hide most of their payload off-screen.

## Anatomy

- **Region** (`<div aria-labelledby>`) — labelled container; owns the `current` index. One item is "hero" (front, full opacity); neighbours recede (`scale-0.98 rotateX(8deg)`, dimmed).
- **Track** (`<ul>`) — horizontal strip translated by `current`; each slide is `70vmin` square.
- **Slide** (`Slide`) — image (`object-cover`) + dark scrim + **title** (`<h2>`) + **CTA button**; hover parallax tilts the active image. Click a neighbour to promote it.
- **Controls** (`CarouselControl` ×2) — round prev/next buttons **below** the track, arrow icon (`rotate-180` for previous).

This repo's carousel is a single-item **hero** carousel (Aceternity-style 3D card), not the multi-item Embla shadcn variant — one item is focal at a time, `slides: SlideData[]` in, no dots.

## Variants

| Variant                   | Use for                                    | Base (Tailwind defaults + tokens)                                |
| ------------------------- | ------------------------------------------ | ---------------------------------------------------------------- |
| Hero (default, this file) | 3–7 featured visuals, one focal at a time  | `slides` prop; `h-[70vmin] w-[70vmin]`, round controls below     |
| Multi-browse              | Comparing many peers (product grid teaser) | not in repo — add Embla `basis-1/2 md:basis-1/3` items if needed |
| Fade                      | Cross-dissolving full-bleed banners        | not in repo — swap track translate for opacity                   |

Pick **one** carousel style per surface. Never auto-advance (see Restrictions).

## States

- **hover** — active image parallax-tilts toward the cursor (`--x/--y`); controls `hover:-translate-y-0.5`. Neighbours stay dimmed (`opacity-50`).
- **focus-visible** — controls **must** use `focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none` (repo focus token). The upstream file ships `focus:border-[#6D64F7]` — replace it with the repo focus ring.
- **active** (pressed control) — `active:translate-y-0.5`.
- **current slide** — full opacity + scrim + visible title/CTA; carried by scale/opacity, never color alone.
- **loading** — image fades in on `onLoad`; give a `bg-muted` placeholder while the src loads.

## Hierarchy

Secondary — a browsing affordance, never the main reading path. One carousel per section, 3–7 slides. More than ~7 wants a grid or search instead.

## Restrictions

- Never **auto-play / auto-rotate** — W3C APG and every audited system forbid it without a visible pause control; this component intentionally ships none, so don't add a timer.
- Never put **critical, must-see content** (pricing, legal, form steps, the primary CTA) inside a slide — off-screen slides are missed and disorienting to screen readers.
- Never use it as **navigation** or as sequential **steps** — use a nav menu / Stepper.
- Never hard-code slide copy, image URLs, or the CTA label — feed `slides` from `messages/<locale>.json` + `@/config`, not inline strings (the upstream demo data is placeholder only).
- Never wire the CTA button to `next/link` — route via `@/i18n/routing`.
- Keep controls labelled: `title="Go to previous/next slide"` (present) and arrow icons `aria-hidden`; don't rely on the glyph as the accessible name.
- Don't drop the repo focus ring for the upstream hex focus border — signal focus with `ring-ring`, visibly.
- Respect `motion-reduce:` — the 1s track slide and parallax must degrade to an instant swap.

## Tokens

- **Color** — `bg-background` region, `text-foreground` title over a `bg-black/30` scrim; controls `bg-muted` (upstream `bg-neutral-200 dark:bg-neutral-800` → map to `bg-muted`). CTA is neutral (`bg-background`/`text-foreground`); use `bg-brand text-brand-foreground` only if it is the surface's primary action.
- **Radius** — controls `rounded-full`; CTA `rounded-lg` (0.75rem); slide corners near-square (`rounded-[1%]`).
- **Elevation** — flat track; controls lift to raised (`shadow-md`) on hover; active scrim reads as overlay depth.
- **Type** — title uses the `title`/heading role (`text-lg md:text-2xl lg:text-4xl font-semibold`); CTA `text-xs sm:text-sm` (caption/body).
- **Focus** — `focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none` on **every** control (always, replacing upstream `focus:border-[#6D64F7]`).
- **Motion** — track `duration-1000 ease-in-out`, slide transform `0.5s cubic-bezier(0.4,0,0.2,1)`; longer than the 160/240ms standard because it's a full-layout transition — still guard with `motion-reduce:`.
- **Sizing** — controls `h-10 w-10` (40px, meets touch target); slide `70vmin` square; icons Lucide 20px default (upstream uses Tabler — swap to Lucide `ArrowRight` for icon-set consistency).

Sources:

- https://www.w3.org/WAI/ARIA/apg/patterns/carousel/
- https://ui.shadcn.com/docs/components/carousel
- https://ant.design/components/carousel/
- https://m3.material.io/components/carousel/guidelines
