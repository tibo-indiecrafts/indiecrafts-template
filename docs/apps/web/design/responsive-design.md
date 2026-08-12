# Responsive design

The template is Tailwind v4, mobile-first. There's no custom breakpoint config —
components use Tailwind's default `sm 640 · md 768 · lg 1024 · xl 1280` prefixes,
and two shared CSS variables carry the page container. Verify every change at
**375 / 768 / 1280**.

## Mobile-first defaults

Base utilities target the smallest screen; breakpoint prefixes layer on
larger-screen overrides. From `src/user-interface/homepage/sections/Features.tsx`:

```html
<section class="bg-muted/40 border-b py-16 md:py-32">
  <div class="@container mx-auto max-w-5xl px-(--gutter)">
    <ul class="grid max-w-sm gap-6 md:mt-16 @min-4xl:max-w-full @min-4xl:grid-cols-3"></ul>
  </div>
</section>
```

- Vertical rhythm scales up at breakpoints (`py-16 md:py-32`).
- Grids start single-column and add columns higher up.
- Some sections use Tailwind v4 **container queries** (`@container` on the wrapper, `@min-4xl:*` on children) so a block responds to its own width, not the viewport.

## The container variables

Page width and horizontal padding come from two CSS variables, injected once at the
bottom of `src/app/[locale]/layout.tsx` from `theme.container`:

```tsx
<style>{`:root{--max-container:${theme.container.maxWidth};--gutter:${theme.container.gutter};}`}</style>
```

Defaults are `maxWidth: "1280px"`, `gutter: "1rem"` (`theme.container` in
`@indiecrafts/config`). Sections consume them with Tailwind's arbitrary-value-from-var
syntax:

```html
<div class="mx-auto max-w-6xl px-(--gutter)">
  <!-- section content; inner wrapper for chrome uses max-w-(--max-container) -->
</div>
```

Rebrand the container by editing `theme.container` — every section, the header, and
the footer follow. Never hard-code page margins.

## Layout scaffolding

- The `<body>` is `flex min-h-screen flex-col` (`layout.tsx`), so a short page still pushes the footer to the viewport bottom.
- `DefaultLayout`'s `<main id="main" tabIndex={-1}>` is `flex-1 pt-14 lg:pt-20` and clears the fixed header — matching the header's `h-14 lg:h-20`. Header height and this offset must stay in sync (`shared/layout/DefaultLayout.tsx`, `Header.tsx`).

## Responsive imagery

Blog and article images use `next/image` with explicit `sizes` so the browser
downloads the right resolution per breakpoint. From `FeaturedArticles.tsx`:

```tsx
<Image
  src={image}
  alt={alt}
  fill
  sizes="(min-width: 1024px) 56vw, (min-width: 768px) 92vw, 100vw"
  className="object-cover"
/>
```

Match the `sizes` hint to the column widths the image actually occupies at each
breakpoint.

## Reduced motion

Two layers honor `prefers-reduced-motion: reduce`:

- **Global.** `globals.css` (in `@indiecrafts/ui-tokens`) neutralizes animation and transitions for everyone who asks:

  ```css
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
  ```

- **Per-element.** Interactive hover effects add `motion-reduce:*` utilities to cancel the transform/transition (e.g. `group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100` in `FeaturedArticles.tsx`).

When you copy a section that animates, keep both — the global rule is a safety net;
the per-element utilities keep the reduced-motion state visually correct.

## Other global responsiveness

`globals.css` also carries cross-cutting rules that adapt to the environment rather
than the viewport: OKLCH light/dark tokens with two dark triggers
(`html[data-theme="dark"]` + `@media (prefers-color-scheme: dark)`), a
`forced-colors` (Windows High Contrast) mapping, and a branded `::selection`. Those
are covered in [`DESIGN.md`](../../../../code/packages/ui-tokens/DESIGN.md); the
responsive takeaway is that layout, motion, and imagery all key off Tailwind
defaults plus the two container variables — nothing bespoke to learn.
