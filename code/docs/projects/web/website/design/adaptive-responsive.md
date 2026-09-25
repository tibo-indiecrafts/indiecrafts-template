---
title: "Adaptive & responsive design"
description: "The template is Tailwind v4, mobile-first."
status: stable
---

# Adaptive & responsive design

The template is Tailwind v4, mobile-first. Components use Tailwind's default
`sm 640 · md 768 · lg 1024 · xl 1280` prefixes, and two shared CSS variables carry the page
container. Verify every change at **375 / 768 / 1280** — the floor, not the definition.

> **See it live:** Storybook › _Adaptive & container queries_ (`pnpm storybook`) has a drag-to-resize
> demo — watch a container query change columns on the element's **own** width, not the viewport —
> plus the resizable `CardList` / `StatList` / `PersonList` stories.

## Responsive or adaptive? Name the mechanism

"Responsive" gets used for five different things; the failure mode is ambiguity — a designer hands
off three fixed frames meaning _adaptive_, a dev builds fluid CSS meaning _responsive_, both say
"responsive." Decide, and say which in the PR:

- **Same content reflowing → responsive** — the default. One markup tree, fluid, one codebase.
- **Different content by context → adaptive** — for that component only. A deliberate swap of markup,
  not a shrink, and only when the component's **content** (not just its size) must change — a dense
  12-column table becoming 3 prioritised cards on a phone, not the same 12 squeezed.

Most surfaces are responsive; a component earns an adaptive swap where the experience genuinely
differs. This is the same idea the impeccable `adapt` skill and the `adaptive-design` rule carry:
adaptation is rethinking the experience for the context, not scaling pixels — design each device
class deliberately.

## Adaptive tools (reach for the lightest that holds)

- **Reflow (responsive) — the default:** fluid grid `repeat(auto-fit, minmax(…, 1fr))`, `clamp()`
  type, flexbox. Much needs no breakpoint.

  ```css
  .card-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 1.5rem;
  }
  h1 {
    font-size: clamp(1.5rem, 4vw + 1rem, 3rem);
  }
  ```

- **Container queries — when a component's own width drives its layout** (a card full-width vs in a
  sidebar). Baseline since 2023, native in Tailwind v4 (`@container` on the parent + named
  `@sm`…`@7xl` variants on children — write `@4xl:`, **not** `@min-4xl:`; `@min-[…]`/`@max-[…]` are
  only for arbitrary widths), and performant
  (native layout engine, no JS). Use `container-type: inline-size`.

  ```css
  .sidebar {
    container-type: inline-size;
  }
  @container (min-width: 400px) {
    .card {
      grid-template-columns: 100px 1fr;
    }
  }
  ```

  **The rule: viewport breakpoints size the PAGE; `@container` sizes a COMPONENT.** Any block
  renderer that can appear **inline in the blog prose column** — the inline-embeddable `module.*`
  types (`card-list`, `stat-list`, `person-list`, …) — MUST be container-driven, because it renders
  in two widths: the ~1152px full-width slot (`ModuleRenderer` → `ModuleSection`) **and** the ~768px
  article column (`BlogPostContent`). A viewport grid (`lg:grid-cols-4`) reads 1440px even while
  squeezed into a 768px column. Put `@container` on the block's wrapper (see
  `ui-components/.../collection/{PersonList,CardList,StatList}.tsx`) and key columns off `@2xl`/`@4xl`.

- **Input method, not screen size:** a touch laptop and a keyboard tablet both exist. Never gate
  functionality on hover.

  ```css
  @media (pointer: coarse) {
    .button {
      padding: 12px 20px;
    }
  } /* bigger touch target */
  @media (hover: hover) {
    .card:hover {
      transform: translateY(-2px);
    }
  }
  ```

- **Safe areas:** `env(safe-area-inset-*)` + `<meta name="viewport" content="…, viewport-fit=cover">`
  for notches / home indicators.

- **Context swap (adaptive) — only where earned:** different markup at a threshold. `srcset` /
  `<picture>` for art direction is adaptive sitting quietly inside a responsive page; a distinct
  dense-vs-simple component is adaptive where the content differs.

**❌ Anti-patterns:** a separate mobile codebase / `m.` site / user-agent sniffing (fragile —
feature-detect); different information architecture per context; hiding core functionality on small
screens; calling everything "responsive" without naming reflow vs swap.

## Mobile-first defaults

Base utilities target the smallest screen; breakpoint prefixes layer on larger-screen overrides.
From `src/user-interface/homepage/sections/Features.tsx`:

```html
<section class="bg-muted/40 border-b py-16 md:py-32">
  <div class="@container mx-auto max-w-5xl px-(--gutter)">
    <ul
      class="grid max-w-sm gap-6 md:mt-16 @4xl:max-w-full @4xl:grid-cols-3"
    ></ul>
  </div>
</section>
```

- Vertical rhythm scales up at breakpoints (`py-16 md:py-32`).
- Grids start single-column and add columns higher up.
- Some sections use Tailwind v4 **container queries** (`@container` on the wrapper, `@4xl:*` on children) so a block responds to its own width, not the viewport.

## The container variables

Page width and horizontal padding come from two CSS variables, injected once at the bottom of
`src/app/[locale]/layout.tsx` from `theme.container`:

```tsx
<style>{`:root{--max-container:${theme.container.maxWidth};--gutter:${theme.container.gutter};}`}</style>
```

Defaults are `maxWidth: "1280px"`, `gutter: "1rem"` (`theme.container` in `projects/web/website/src/config/theme.ts`).
Sections consume them with Tailwind's arbitrary-value-from-var syntax:

```html
<div class="mx-auto max-w-6xl px-(--gutter)">
  <!-- section content; inner wrapper for chrome uses max-w-(--max-container) -->
</div>
```

Rebrand the container by editing `theme.container` — every section, the header, and the footer
follow. Never hard-code page margins.

## Layout scaffolding

- The `<body>` is `flex min-h-screen flex-col` (`layout.tsx`), so a short page still pushes the footer to the viewport bottom.
- `DefaultLayout`'s `<main id="main" tabIndex={-1}>` is `flex-1 pt-14 lg:pt-20` and clears the fixed header — matching the header's `h-14 lg:h-20`. Header height and this offset must stay in sync (`shared/layout/DefaultLayout.tsx`, `Header.tsx`).

## Responsive imagery

Blog and article images use `next/image` with explicit `sizes` so the browser downloads the right
resolution per breakpoint. From `FeaturedArticles.tsx`:

```tsx
<Image
  src={image}
  alt={alt}
  fill
  sizes="(min-width: 1024px) 56vw, (min-width: 768px) 92vw, 100vw"
  className="object-cover"
/>
```

Match the `sizes` hint to the column widths the image actually occupies at each breakpoint. (This is
adaptive image _selection_ — a fixed set of files — inside a responsive layout.)

## Reduced motion

Two layers honor `prefers-reduced-motion: reduce`:

- **Global.** `globals.css` (in `@indiecrafts/packages-shared-ui-tokens`) neutralizes animation and transitions for everyone who asks:

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

- **Per-element.** Interactive hover effects add `motion-reduce:*` utilities to cancel the transform/transition (e.g. `group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100` in `FeaturedArticles.tsx`).

When you copy a section that animates, keep both — the global rule is a safety net; the per-element
utilities keep the reduced-motion state visually correct.

## Other environment adaptation

`globals.css` also carries cross-cutting rules that adapt to the environment rather than the
viewport: OKLCH light/dark tokens with two dark triggers (`html[data-theme="dark"]` +
`@media (prefers-color-scheme: dark)`), a `forced-colors` (Windows High Contrast) mapping, and a
branded `::selection`. Those are covered in
[`DESIGN.md`](../../../../code/packages/shared/ui-tokens/DESIGN.md); the takeaway is that layout, motion, and
imagery all key off Tailwind defaults plus the two container variables — nothing bespoke to learn.

## Visual verification — look at the pixels before "done"

A green test suite does not prove a human can see the screen. jsdom (Jest/Vitest/RTL) has no
layout, so an element painted white-on-white or pushed off-screen still passes. Snapshots diff
markup, not pixels — a shared-stylesheet change wrecks a layout with a clean snapshot. Close the
gap by looking at the rendered output.

**The loop — after any layout, shared-component, or responsive change.** Render the affected pages,
screenshot at the three adaptive widths (**375 · 768 · 1280**), and review the _images_, not the
DOM. Look for overlap, clipped text, an off-centre modal, a card wrapping to a lonely row, and
dark-mode grey-on-grey. Fix what you saw, re-screenshot, and confirm before you call the task done.

**Verify the mechanism, not just the width.** A **reflow (responsive)** layout must reflow cleanly
at all three widths. A **context-swap (adaptive)** component must render its intended variant per
device class, not a squeezed desktop. Name the mechanism first; the check differs for each. Add a
coarse-pointer / touch view and a ~820px tablet — the three widths are the floor.

**Keep the check honest and scoped.** Stub dynamic data so live content does not read as breakage.
Record intentional asymmetry so it does not get "fixed". A screenshot is one frame of one state — it
does not replace hover, focus, keyboard, or `e2e` QA. The engineering rule lives in
[`visual-verification`](../../../../code/projects/web/surfaces/website/.claude/rules/visual-verification.md) and the
[self-review](../../../../code/projects/web/surfaces/website/.claude/rules/self-review.md) checklist.
