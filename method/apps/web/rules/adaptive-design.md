# Adaptive-aware design

Load when building or changing any layout. "Responsive" gets used for five different things, and the
failure mode is ambiguity — a designer hands off three fixed frames meaning _adaptive_, a dev builds
fluid CSS meaning _responsive_, both say "responsive." Be specific about the mechanism.

## The decision (state it in the PR)

- **Same content reflowing → responsive** — the default. One markup tree, fluid, one codebase.
- **Different content by context → adaptive** — for that component only. A deliberate swap of markup,
  not a shrink, and only when the component's **content** (not just its size) must change — e.g. a
  12-column dashboard becoming 3 prioritised metrics on a phone, not the same 12 squeezed.

Most surfaces are responsive; a component earns an adaptive swap where the experience genuinely
differs. Adaptation is **rethinking the experience for the context** (see the impeccable `adapt`
skill), not scaling pixels. Design each device class (mobile / tablet / desktop) deliberately.

## Tools (reach for the lightest that holds)

- **Reflow (responsive) — ✅ default:** fluid grid (`repeat(auto-fit, minmax(…, 1fr))`), `clamp()`
  type, flexbox. Much of it needs no breakpoint.
- **Container queries — ✅ when a component's own width drives its layout** (a card full-width vs in a
  sidebar): `@container` with `container-type: inline-size`, not a viewport media query. Baseline
  since 2023 + native in Tailwind v4; performant (native layout engine, no JS).
- **Input method, not screen size — ✅:** `@media (pointer: coarse)` / `(hover: hover)`. A touch
  laptop and a keyboard tablet both exist. Never gate functionality on `hover`.
- **Safe areas — ✅:** `env(safe-area-inset-*)` + `viewport-fit=cover` for notches / home indicators.
- **Context swap (adaptive) — ✅ only where earned:** different markup at a threshold — `srcset` /
  `<picture>` for art direction, or a distinct dense-vs-simple component — because the content
  differs, not to avoid a reflow.

## ❌ Anti-patterns

- A separate mobile codebase / `m.` site / user-agent device sniffing (fragile — feature-detect).
- Different information architecture across contexts (confusing).
- Calling everything "responsive" in the ticket without naming reflow vs swap.
- Hiding core functionality on small screens — if it matters, make it work.

## Verify

- **375 / 768 / 1280 is the floor, not the definition** — also check a between size (the ~820px
  tablet gap), landscape, and a coarse-pointer (touch) device.
- Deeper guide: `docs/apps/web/design/adaptive-responsive.md` · the impeccable `adapt` skill.
