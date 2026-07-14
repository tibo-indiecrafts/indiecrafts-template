# Responsive design

The template is Tailwind v4, mobile-first. There's no custom breakpoint config — components use Tailwind's default `sm / md / lg / xl` prefixes, and a couple of shared CSS variables carry the page container.

## Mobile-first defaults

Base utility classes target the smallest screen; breakpoint prefixes layer on larger-screen overrides. From `src/parts/sections/Features.tsx`:

```html
<section class="bg-muted/40 border-b py-16 md:py-32">
  <ul class="grid max-w-sm gap-6 md:mt-16 @min-4xl:max-w-full @min-4xl:grid-cols-3"></ul>
</section>
```

- Vertical rhythm scales up at breakpoints (`py-16 md:py-32`).
- Grids start single-column and add columns higher up.
- Some sections use Tailwind v4 **container queries** (`@container` on the wrapper, `@min-4xl:*` on children) so a block responds to its own width, not the viewport.

## The container variables

Page width and horizontal padding come from two CSS variables, injected once in `src/app/[locale]/layout.tsx` from `theme.container`:

```tsx
<style>{`:root{--max-container:${theme.container.maxWidth};--gutter:${theme.container.gutter};}`}</style>
```

Defaults are `maxWidth: "1280px"`, `gutter: "1rem"` (`src/config/index.ts`). Sections consume them with Tailwind's arbitrary-value-from-var syntax:

```html
<div class="mx-auto max-w-6xl px-(--gutter)">
  <!-- section content -->
  <div class="max-w-(--max-container) px-(--gutter)"><!-- header / footer chrome --></div>
</div>
```

Rebrand the container by editing `theme.container` — every section, the header, and the footer follow. Never hard-code page margins.

## Layout scaffolding

- The `<body>` is `flex min-h-screen flex-col` (`src/app/[locale]/layout.tsx`), so a short page still pushes the footer to the viewport bottom.
- `DefaultLayout`'s `<main>` is `flex-1` and clears the fixed header with `pt-14 lg:pt-20` — matching the header's `h-14 lg:h-20`. Header height and this offset must stay in sync (`src/parts/layout/DefaultLayout.tsx`, `Header.tsx`).

## Responsive imagery

Blog and article images use `next/image` with explicit `sizes` so the browser downloads the right resolution per breakpoint. From `FeaturedArticles.tsx`:

```tsx
<Image
  src={image}
  alt={alt}
  fill
  sizes="(min-width: 1024px) 56vw, (min-width: 768px) 92vw, 100vw"
  className="object-cover"
/>
```

Match the `sizes` hint to the column widths the image actually occupies at each breakpoint.

## Reduced motion

Two layers honor `prefers-reduced-motion: reduce`:

- **Global.** `src/app/globals.css` neutralizes animation and transitions for everyone who asks:

  ```css
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
  ```

- **Per-element.** Interactive hover effects add `motion-reduce:*` utilities to cancel the transform/transition (e.g. `group-hover:scale-[1.03] motion-reduce:group-hover:scale-100` in `FeaturedArticles.tsx`).

When you copy a section that animates, keep both — the global rule is a safety net; the per-element utilities keep the reduced-motion state visually correct.

## Other global responsiveness

`globals.css` also carries cross-cutting rules that adapt to the environment rather than the viewport: OKLCH light/dark tokens with two dark triggers, a `forced-colors` (Windows High Contrast) mapping, and a branded `::selection`. Those are covered in the color-system docs; the responsive takeaway is that layout, motion, and imagery all key off Tailwind defaults plus the two container variables — there's nothing bespoke to learn.
