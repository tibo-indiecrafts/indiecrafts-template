---
description: Screenshot any UI change at 375/768/1280 and review the pixels — green tests don't prove a human can see it.
---

# Visual verification — look at the pixels before "done"

Load when building or changing any UI. **Green tests do not prove a human can see and use the
screen.** jsdom (Jest/Vitest/RTL) has no layout — an element positioned off-screen, painted
white-on-white, or buried under a `z-index` still "exists" and "clicks". Snapshots diff **markup,
not pixels**, so a shared-stylesheet change wrecks a layout with a clean snapshot. A passing suite
tests the app you *wrote*, not the app the user *sees*. Close that gap by looking.

## The loop — after any UI change

1. **Render it.** Start the app (the `run` skill), then **connect to the running dev tab** —
   `/connect-chrome` (or `claude-in-chrome` `tabs_context_mcp`) attaches to the live `localhost` tab,
   so you screenshot the **real, stateful** app, not a fresh blank tab claude-in-chrome opens by
   default. Then open every affected page (`claude-in-chrome` tools / `webapp-testing`).
2. **Screenshot at the three widths — always the same three:** **375 · 768 · 1280** (the
   [adaptive-design](./adaptive-design.md) floor). Fixed widths every run — drifting widths make the
   review flag viewport noise, not bugs.
3. **Review the screenshots _as images_, not the DOM.** Look for: layout breakage · overlapping
   elements · clipped / overflowing text · a card wrapping to a lonely second row · an off-centre
   modal · **low contrast / dark-mode grey-on-grey** · a control hidden behind a sticky footer.
   These are exactly what selector assertions miss.
4. **Fix what you saw, re-screenshot, confirm.** **Do not mark the task done until the screenshots
   look correct.** Interpret the image ("is this usable?") — don't chase byte-identical pixels.

## Adaptive & responsive — verify the mechanism, not just the width

- **Reflow (responsive)** — the same content must reflow cleanly at all three widths (no overflow,
  no clip). **Context-swap (adaptive)** — where a component deliberately shows *different* content by
  context, confirm each device class renders its intended variant, not a squeezed desktop. Name the
  mechanism (per [adaptive-design](./adaptive-design.md)); the screenshot check differs for each.
- **Also check a coarse-pointer / touch view** and a between-size (~820px tablet) — the three widths
  are the floor, not the definition. Hover-only affordances must not hide function ([accessibility](./accessibility.md)).
- **Run the full loop for any change to layout, a shared component, or responsive behaviour.** A
  logic-only change can rely on normal tests — the loop burns tokens (3 viewports × images × a fix
  cycle), so spend it where layout can break.

## Make the check honest

- **Stub dynamic data.** Live data / timestamps / user content make every screenshot differ, and the
  review reads variation as breakage. Intercept the API → fixture JSON for verification runs.
- **Record design intent.** An *intentional* asymmetry or off-balance hero will get "fixed" because
  it looks unbalanced in one frame. Link the Figma / note the intent ([figma-handoff](./figma-handoff.md))
  so a deliberate decision is not undone. Fold recurring design notes into a branch `checks.md` the
  agent reads before verifying ("card grid broke at 768 last time").

## It is the first reviewer, not QA

A screenshot is **one frame of one state**. It will not catch hover states, focus rings, keyboard
navigation, a focus trap behind a closed modal, loading skeletons, error banners, or the empty-list
state — unless you **explicitly render and screenshot those states**. Verification moves the human
eye later and hands it less garbage; it does not replace exploratory QA, `e2e` journeys, or
`accessibility-pass`. Sequence bugs ("start a form, go back, change language, return") stay a human's job.
