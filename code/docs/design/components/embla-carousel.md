# Embla carousel

> shadcn `embla-carousel` · `src/user-interface/ui/embla-carousel.tsx`

**Use when** users browse a small set of equal-weight, optional items (logos, testimonials, product shots) and horizontal space is limited. **Don't** use it for primary content, sequential steps, or anything a user must see — off-screen slides are routinely missed.

## Anatomy

- `Carousel` — `role="region"`, `aria-roledescription="carousel"`; owns keyboard arrows + Embla context.
- `CarouselContent` — the scrolling track (`overflow-hidden`, flex).
- `CarouselItem` — one slide, `role="group"` / `aria-roledescription="slide"`; width set via `basis-*`.
- `CarouselPrevious` / `CarouselNext` — icon buttons; auto-`disabled` at the ends (unless `loop`).
- Optional: pagination dots or a slide counter (not shipped — compose via `setApi`).

## Variants

| Variant              | Use for                    | Base (Tailwind defaults + tokens)                                     |
| -------------------- | -------------------------- | --------------------------------------------------------------------- |
| Horizontal (default) | Cards, logos, testimonials | `<Carousel>` with items `basis-full`                                  |
| Multi-item           | Show 2–4 per view          | items `md:basis-1/2 lg:basis-1/3`                                     |
| Vertical             | Tall thumbnail strips      | `orientation="vertical"` (constrain track height)                     |
| Loop                 | Infinite marketing reels   | `opts={{ loop: true }}` — buttons never disable                       |
| Autoplay             | Rarely; brand insists      | `plugins={[Autoplay()]}` + a visible pause control (see Restrictions) |

## States

- **hover** — nav buttons inherit Button `outline`; pause any autoplay on pointer enter.
- **focus-visible** — `focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none` (from Button); the region also takes keyboard ArrowLeft/ArrowRight.
- **active** — current slide tracked via Embla `select`; surface it on dots, never by color alone.
- **disabled** — end-of-track nav buttons get `disabled` + `pointer-events-none` (built in); skip when `loop`.
- **loading** — render skeleton `CarouselItem`s (`bg-muted animate-pulse`), not an empty track.

## Hierarchy

Secondary, supplementary content only — one carousel per section, below the section heading; slides are peers, none more important than the rest.

## Restrictions

- Never autoplay without a visible, always-present pause/stop control that is the first interactive element (WCAG 2.2.2); pause on focus-enter and hover.
- Never put required actions, form steps, or your primary CTA inside a slide — off-screen content is missed and unindexed.
- Never remove the `role="group"`/`aria-roledescription` on items or the region wrapper — that is the only affordance screen readers get.
- Never hard-code slide copy — every visible string lives in `messages/<locale>.json`.
- Never gate scroll on hover-only; nav buttons and swipe must both work, touch targets ≥ 40px.
- Never signal the active slide with color alone — pair with a filled/enlarged dot or label.
- For RTL, set `opts={{ direction: "rtl" }}` and `rtl:rotate-180` the arrows — don't leave LTR arrows.

## Tokens

- **Color** — track/slides `bg-background`/`text-foreground`; skeletons `bg-muted`; nav buttons `outline` (`border-border`, `text-foreground`). No brand fill on chrome; reserve `bg-brand` for a CTA inside a slide.
- **Radius** — nav buttons `rounded-full` (shipped); slide cards `rounded-lg`.
- **Elevation** — flat by default; slide cards `card` (`ring-1 ring-border/60 shadow-sm`).
- **Focus** — `focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none` on every control.
- **Motion** — Embla scroll ~standard; guard any autoplay/transition with `motion-reduce:` (stop autoplay entirely under reduced motion).
- **Icons** — Lucide `ArrowLeft`/`ArrowRight`, 16px in the shipped 32px buttons, `aria-hidden` (buttons carry `sr-only` labels).

Sources:

- https://ui.shadcn.com/docs/components/carousel
- https://www.smashingmagazine.com/2023/02/guide-building-accessible-carousels/
