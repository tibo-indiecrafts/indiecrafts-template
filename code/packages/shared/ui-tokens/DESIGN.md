---
version: alpha
name: Indiecrafts
description: Quiet, editorial minimalism — one indigo accent on near-neutral greys, generous whitespace, one signature moment per surface. Config-first (`@indiecrafts/packages-shared-config` data + this package's `src/globals.css`). OKLCH in globals.css is the authoritative color source; the hex below are reference values for tooling, and theme.hexColors.background mirrors --background for the PWA manifest.
colors:
  # Light (sRGB mirrors of the OKLCH tokens in globals.css)
  background: "#ffffff"
  foreground: "#171717"
  brand: "#4f69d9"
  brand-foreground: "#ffffff"
  primary: "{colors.brand}" # spec alias — `brand` is the real token name everywhere else
  muted: "#f5f5f5"
  muted-foreground: "#696969"
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
    fontSize: 48px # text-5xl (scales to 6xl · 60px at xl)
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: -0.02em
  heading:
    fontFamily: Satoshi
    fontSize: 36px # text-4xl
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: -0.02em
  subheading:
    fontFamily: Satoshi
    fontSize: 30px # text-3xl — section titles (h2)
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: -0.02em
  title:
    fontFamily: Satoshi
    fontSize: 24px # text-2xl — card / component titles (h3)
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: -0.01em
  lead:
    fontFamily: Geist
    fontSize: 18px # text-lg — intro / lead paragraphs
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: 0em
  body:
    fontFamily: Geist
    fontSize: 16px # text-base
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0em
  caption:
    fontFamily: Geist
    fontSize: 14px # text-sm — meta, secondary, captions (rendered in muted-foreground — see Colors)
    fontWeight: 400
    lineHeight: 1.4
  eyebrow:
    fontFamily: Geist
    fontSize: 12px # text-xs, uppercase
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0.1em
  code:
    fontFamily: Geist Mono
    fontSize: 14px # text-sm, tabular
    fontWeight: 400
    lineHeight: 1.5
rounded:
  sm: 0.375rem
  md: 0.5rem
  lg: 0.75rem
  xl: 1rem
  full: 9999px
spacing:
  # Step scale (Tailwind's 0.25rem base) — pick from these, don't invent 13px/27px.
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  # Layout tokens
  gutter: 1rem
  section-y: 4rem
  section-y-lg: 6rem
  container-max: 1280px
elevation:
  # Flat by default — depth is rings + tonal surfaces, not heavy shadows.
  flat: none
  card: "ring-1 ring-border/60, shadow-sm" # resting surface
  raised: shadow-md # hover lift
  overlay: shadow-lg # dialogs, hero scrims only
components:
  button-primary:
    backgroundColor: "{colors.brand}"
    textColor: "{colors.brand-foreground}"
    rounded: "{rounded.md}"
  button-primary-hover: # idle brand at ~90% tint — never a new hue (see Interaction & States)
    backgroundColor: "{colors.brand}"
    textColor: "{colors.brand-foreground}"
    rounded: "{rounded.md}"
  button-secondary: # transparent fill + a 1px `border`-token hairline (see Components prose)
    backgroundColor: transparent
    textColor: "{colors.foreground}"
    rounded: "{rounded.md}"
  button-secondary-hover:
    backgroundColor: "{colors.muted}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.md}"
  card:
    backgroundColor: "{colors.background}"
    rounded: "{rounded.xl}" # resting surface = ring-1 ring-border/60 + shadow-sm (elevation.card)
  chip:
    backgroundColor: "{colors.muted}"
    textColor: "{colors.muted-foreground}"
    rounded: "{rounded.md}"
  focus-ring:
    textColor: "{colors.ring}"
    width: 2px # focus-visible:ring-2 ring-ring
---

# Indiecrafts — Design System

Machine-readable tokens live in the front matter above; the prose below is the
"why". Deeper guides: `code/docs/apps/web/design/`, `code/docs/apps/web/config/theme-modes.md`.
This is the **visual** third of the design-context triad — the non-visual product truth
(users, purpose, positioning) lives in [`PRODUCT.md`](../../apps/web/PRODUCT.md), and the
build rules in [`CLAUDE.md`](../../apps/web/CLAUDE.md).

## How to read this system

1. **Tokens win.** The front-matter tokens are normative — when prose and a token
   disagree, the token is right, and a token always overrides a hardcoded value in
   a component.
2. **Runtime source of truth:** OKLCH in `globals.css` is authoritative for color;
   the front-matter hex are reference values for tooling (the PWA manifest reads
   `theme.hexColors.background`) — never hardcode them.
3. **Use utilities, never raw values:** `bg-brand`, `text-muted-foreground`,
   `rounded-md` — never a raw hex, px, or rem in a component.
4. **Deeper detail** → `code/docs/apps/web/design/*` (typography, responsive, sections, icons…).
   Read this file first, then the topic guide.
5. **Log every change** in the app changelog `code/projects/web/surfaces/website/CHANGELOG.md` (code + design share one).
6. **Unsure which rule applies? Ask — never "use your best judgment."**
7. **Uncovered case? Match the nearest existing screen** before inventing a
   pattern — consistency beats local perfection.

## Brand & Style

Quiet, modern, editorial — "restraint is the brand." A single indigo accent
(`brand`, hue 260) does one job at a time; everything else is near-neutral grey
with generous whitespace. Each surface earns **one** deliberate signature moment
(a pulsing status dot, an asymmetric featured lead) rather than scattered
flourishes. Audience: developers and agencies shipping client sites — it should
read as crafted and calm, never busy or templated.

## Colors

Colors carry **roles, not preferences** — each has a job description, not just a
hex. OKLCH in `globals.css` is authoritative and is the **only** color source;
the front-matter hex are reference values for tooling. The one runtime hex mirror
is `theme.hexColors.background` — the PWA manifest can't take oklch; keep it
matched to `--background`. Always use utilities (`bg-brand`,
`text-muted-foreground`), never raw hex.

- **`brand` — `oklch(0.55 0.18 260)` · `#4f69d9` (indigo, hue 260)** — primary
  actions, focus rings, active nav, the single eyebrow accent, and the `[[word]]`
  highlight span inside titles (via `RichTitle`). It marks _the one important
  thing_ on a surface. **Never** a decorative fill; never error/success.
  Lightens to `brand-dark` (`oklch(0.72 0.16 260)`) in dark mode to hold contrast.
- **`foreground` — `#171717` / `muted-foreground` — `#696969`** — primary text /
  secondary + captions. The only two text colors — don't invent greys.
- **`muted` — `#f5f5f5`** — soft surfaces (chips, alternating section
  backgrounds). Never text.
- **`border` — `#d4d4d4`** — hairlines + rings only (`border-dark` bumped to
  `oklch(0.5 0 0)` ≈ neutral-500 for AA on near-black).
- **`destructive` — `#dc2626`** — error/validation states only, never decorative.
- **`background` — `#ffffff` / `card`** — page and raised-surface fills.

## Typography

- **Display — Satoshi** (self-hosted variable `.woff2`): all `h1–h6` via
  `--font-display`. Tight tracking, heavier weights for hero/section titles.
- **Body — Geist** (Google, self-hosted): UI + prose via `--font-sans`.
- **Mono — Geist Mono**: code + tabular figures via `--font-mono`.

Think in roles, not sizes. The display ladder (Satoshi, tight tracking) runs
`hero` → `heading` (h1/h2) → `subheading` (h2) → `title` (h3); the text ladder
(Geist) runs `lead` → `body` → `caption`, with `eyebrow` (uppercase,
`tracking-widest`, `brand`) marking sections. Secondary text and `caption` are
`muted-foreground` — don't invent an in-between size or grey. The pairing
is one line in `config.fonts`; set `display: geist` for a single-face look.
Locale-aware punctuation (quotes, dates, French NBSP before `: ; ? !`) lives in
`messages.<locale>.typography.*`.

**Long-form prose** uses shadcn **Typeset** (`src/typeset.css`, imported
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
- Base spacing is Tailwind's default 0.25rem scale, named in the `spacing` tokens
  as a step scale: `xs 4px` · `sm 8px` · `md 16px` · `lg 24px` · `xl 32px`. **Pick
  from these steps** — usage map: component padding `p-3`/`p-4`, gaps between related
  items `gap-2`/`gap-3`, gaps between sections `gap-6`/`gap-8`. An off-scale need
  (13px, 27px) usually means the wrong two elements are spaced — flag it, don't
  invent a value.

## Responsive & adaptive behavior

**Every UI must adapt to all the screen sizes + input methods we support** — no
exceptions. Lean on the `frontend-design` skill for direction, and build
mobile-first: mobile is a different context, not a squeezed desktop.

**Name the mechanism.** _Same content reflowing_ = **responsive** (the default —
one markup tree, fluid). _Different content by context_ = **adaptive**, for that
component only (a deliberate swap, not a shrink — e.g. a dense table becoming
prioritised cards). Most surfaces are responsive; a component earns an adaptive
swap where its **content**, not just its size, must change.

Breakpoints are Tailwind's (`sm 640 · md 768 · lg 1024 · xl 1280`); verify at
**375 / 768 / 1280** — the floor, not the definition (also a touch device + the
~820px tablet gap). Use **container queries** (`@container` on the parent + named `@4xl:`
variants — not `@min-4xl:`) where a component's own width drives its layout — a block that can
render **inline in the blog column** (`module.*`) MUST be container-driven, never viewport;
**`pointer` / `hover`** queries for input method (never gate function on hover); **safe-area
insets** for notches. Full guide: `code/docs/apps/web/design/adaptive-responsive.md` +
`code/projects/web/surfaces/website/.claude/rules/adaptive-design.md`.

- Grids collapse `grid-cols-1 → md:2 → lg:3`; hero type scales
  `text-3xl → md:5xl → xl:6xl`.
- Section-layout modules render **bare inline** inside prose (no page gutter) so
  they never double-pad on mobile.
- Every desktop-only affordance has a mobile equivalent: the sticky TOC sidebar
  (`lg`+) becomes a collapsible "On this page" disclosure below `lg`.
- Touch targets ≥ 40px; hover-only affordances (tooltips) are `sm:`-gated.
- Wide tables become stacked cards below `md` — not a horizontal-scroll table.
- Nothing scrolls horizontally — wide media/tables get their own `overflow-x`.

## Elevation & Depth

Flat by default — depth comes from **hairline rings + tonal surfaces**, not heavy
shadows. The `elevation` tokens name the three steps: `flat` (none) →
`card` (`ring-1 ring-border/60` + `shadow-sm`, the resting surface) →
`raised` (`shadow-md`, hover lift, subtle scale). `overlay` (`shadow-lg` + scrim)
is the only place real shadow appears — dialogs and hero gradients. Don't reach
past the step a surface needs.

## Shapes

Soft but disciplined. Radii: `sm 0.375rem` · `md 0.5rem` (`--radius`, the
default) · `lg 0.75rem` · `xl 1rem`. Cards and media use `rounded-xl`; pills and
status dots use `full`. Don't mix radii within one component.

## Components

- **Buttons** — Primary: `brand` bg, `brand-foreground` text, `rounded-md`, no
  shadow. Secondary: transparent, `1px border`, `rounded-md`. Never more than
  **one** primary button per view; never use `brand` as the fill of a
  secondary/tertiary action.
- **Cards** — `bg-card ring-1 ring-border/60 rounded-xl shadow-sm`.
- **Chips / badges** — `bg-muted text-muted-foreground rounded-md`, `text-xs`.
- **Eyebrow marker** — a short brand rule (`h-px w-8 bg-brand`) or dot before the
  label; it should **encode** something (status, category), not decorate.
- **Focus** — every interactive element:
  `focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none`.

(Per-state behavior → **Interaction & States**; icons → **Iconography** below.)

## Component conventions

Build on the shadcn primitives the shadcn way — full rules in
[`.claude/rules/component-architecture.md`](../../apps/web/.claude/rules/component-architecture.md):
`cn()` not string-concat, `cva` not forks, `asChild`/`data-slot`, semantic tokens
over `dark:`, container queries, never hand-edit `@indiecrafts/packages-web-ui` primitives.

### Component catalog

Each primitive's usage doc is **colocated with its source** in the `@indiecrafts/packages-web-ui`
package — `code/packages/ui/src/web/<name>.md` sits beside `<name>.tsx`. Edit the component,
its doc is right there. The 61 primitives:

[`accordion`](../../ui/src/web/accordion.md) · [`alert`](../../ui/src/web/alert.md) · [`alert-dialog`](../../ui/src/web/alert-dialog.md) · [`aspect-ratio`](../../ui/src/web/aspect-ratio.md) · [`attachment`](../../ui/src/web/attachment.md) · [`avatar`](../../ui/src/web/avatar.md)  
[`badge`](../../ui/src/web/badge.md) · [`breadcrumb`](../../ui/src/web/breadcrumb.md) · [`bubble`](../../ui/src/web/bubble.md) · [`button`](../../ui/src/web/button.md) · [`button-group`](../../ui/src/web/button-group.md) · [`calendar`](../../ui/src/web/calendar.md)  
[`card`](../../ui/src/web/card.md) · [`carousel`](../../ui/src/web/carousel.md) · [`checkbox`](../../ui/src/web/checkbox.md) · [`collapsible`](../../ui/src/web/collapsible.md) · [`combobox`](../../ui/src/web/combobox.md) · [`command`](../../ui/src/web/command.md)  
[`context-menu`](../../ui/src/web/context-menu.md) · [`dialog`](../../ui/src/web/dialog.md) · [`direction`](../../ui/src/web/direction.md) · [`drawer`](../../ui/src/web/drawer.md) · [`dropdown-menu`](../../ui/src/web/dropdown-menu.md) · [`embla-carousel`](../../ui/src/web/embla-carousel.md)  
[`empty`](../../ui/src/web/empty.md) · [`field`](../../ui/src/web/field.md) · [`form`](../../ui/src/web/form.md) · [`hover-card`](../../ui/src/web/hover-card.md) · [`input`](../../ui/src/web/input.md) · [`input-group`](../../ui/src/web/input-group.md)  
[`input-otp`](../../ui/src/web/input-otp.md) · [`item`](../../ui/src/web/item.md) · [`kbd`](../../ui/src/web/kbd.md) · [`label`](../../ui/src/web/label.md) · [`marker`](../../ui/src/web/marker.md) · [`menubar`](../../ui/src/web/menubar.md)  
[`message`](../../ui/src/web/message.md) · [`message-scroller`](../../ui/src/web/message-scroller.md) · [`native-select`](../../ui/src/web/native-select.md) · [`navigation-menu`](../../ui/src/web/navigation-menu.md) · [`pagination`](../../ui/src/web/pagination.md) · [`popover`](../../ui/src/web/popover.md)  
[`progress`](../../ui/src/web/progress.md) · [`radio-group`](../../ui/src/web/radio-group.md) · [`resizable`](../../ui/src/web/resizable.md) · [`scroll-area`](../../ui/src/web/scroll-area.md) · [`select`](../../ui/src/web/select.md) · [`separator`](../../ui/src/web/separator.md)  
[`sheet`](../../ui/src/web/sheet.md) · [`sidebar`](../../ui/src/web/sidebar.md) · [`skeleton`](../../ui/src/web/skeleton.md) · [`slider`](../../ui/src/web/slider.md) · [`sonner`](../../ui/src/web/sonner.md) · [`spinner`](../../ui/src/web/spinner.md)  
[`switch`](../../ui/src/web/switch.md) · [`table`](../../ui/src/web/table.md) · [`tabs`](../../ui/src/web/tabs.md) · [`textarea`](../../ui/src/web/textarea.md) · [`toggle`](../../ui/src/web/toggle.md) · [`toggle-group`](../../ui/src/web/toggle-group.md)  
[`tooltip`](../../ui/src/web/tooltip.md)

## Interaction & States

Every interactive component is its appearance **and** its behavior. Cover, where relevant:

- **hover** — `raised` elevation (`shadow-md`) or a token tint; never a new hue.
- **focus-visible** — `ring-2 ring-ring`, always, keyboard-reachable.
- **active/pressed** — subtle scale or tint, `motion-reduce`-safe.
- **disabled** — reduced opacity (**50%**) + `cursor-not-allowed`; keep the label.
- **loading** — spinner/skeleton; hold layout height (no shift).
- **error** — `destructive` + text/icon; never color alone.
- **destructive confirm** — delete/remove/revoke/archive always: `destructive`
  color, an `AlertDialog` confirmation, and a confirm button that repeats the
  verb (`[Delete workspace]`, not `[Confirm]`). Non-destructive actions (save,
  apply, filter) never confirm — confirmation is scarce, spend it only on the
  irreversible.
- Use the Radix primitive for dialogs/menus/tabs/tooltips (focus trap, Escape,
  return-focus) — don't hand-roll.

The `components` block tokenizes the two button hover deltas so the agent doesn't
re-decide them per screen: `button-primary-hover` = the brand fill at a ~90% tint,
`button-secondary-hover` = a `muted` fill. Disabled is a pure 50%-opacity delta on
either (no distinct color token).

## Required States

Every data view handles three states with real components — never a blank screen.

- **Loading** — `Skeleton` shaped like the eventual content; `Spinner` only for
  inline/button waits, not full-page loads. Hold layout height (no shift).
- **Empty** — the `Empty` primitive: icon + short message + one primary action
  ("No posts yet." + [Write a post]). Absence of data is a screen to design, not
  dead space.
- **Error** — plain-language message + retry; never surface a raw error string.
  Pair `destructive` with text or icon.

## Accessibility

Visual a11y contract (structural code rules → `code/projects/web/surfaces/website/.claude/rules/accessibility.md`):

- **Contrast** — WCAG **AA** on every token pair; `pnpm verify:contrast` gates it.
- **Focus** — visible `focus-visible:ring-2 ring-ring` on every interactive element.
- **Not color alone** — pair status/selection with text, icon, or shape.
- **Targets** — ≥ 40px touch; hover-only affordances `sm:`-gated.
- **Motion** — honor `prefers-reduced-motion` (see Motion).
- Verify at 375 / 768 / 1280 — nothing clips or overflows.

## Motion

Motion explains a change of state — never decoration.

- **Duration** — standard **160ms**; large layout transitions **≤ 240ms**.
- **Easing** — `ease-out` entering, `ease-in` leaving.
- **Reduced motion** — guard every transform with `motion-reduce:`; replace
  movement with a plain opacity fade when reduced motion is on.
- Spend motion once per surface — same restraint as the visual system.

## Iconography

- **Lucide** (UI), **Reicon** outline/filled (range), **Reicon Brands** (logos).
- Default **20px**; **16px** in compact controls; consistent **2px** stroke.
- Don't mix filled + outlined in one nav area; don't substitute Unicode glyphs or
  add a new icon set. `aria-hidden` unless the icon is the sole label.

## Product Content

User-facing copy lives in `messages/<locale>.json` — never inline.

- **Sentence case.** Button labels **start with a verb** ("Save changes", "Delete workspace").
- Avoid bare "Yes / No / OK / Submit" when a descriptive label fits.
- **Errors** explain what happened **and** what to do next.
- Locale-aware punctuation (French NBSP before `: ; ? !`) → `messages.<locale>.typography.*`.

## Rejected Patterns

Tried and deliberately not used. Don't reach for these; flag if a case genuinely
needs one — the point is to stop and ask, not to ban thinking.

- **Carousels for primary content** — anything past slide one reads as hidden.
  Use a grid or an asymmetric featured lead.
- **Modals for flows longer than two fields** — long dialogs trap users with no
  back. Multi-step flows get their own route.
- **Tooltips for essential info** — invisible on touch and to keyboard. Tooltips
  are `sm:`-gated hints only.
- **Infinite scroll on data tables** — breaks pagination and deep-linking.
  Paginate.
- **Hover-only interactions** — invisible on touch. Every affordance has a
  non-hover path.
- **Cards as default grouping** — reach for spacing, a heading, or a divider
  first (see Do's and Don'ts).

## Do's and Don'ts

- **Do** use colors by their role — `brand` earns attention, the two greys carry
  everything else.
- **Do** keep OKLCH authoritative; edit color in `globals.css`, re-sync
  `theme.hexColors.background` only when `--background` changes, and run
  `pnpm verify:contrast` (WCAG **AA**) after.
- **Do** log every brand/token/component change in the app changelog `code/projects/web/surfaces/website/CHANGELOG.md`
  with a plain-language _why_ — the same file dev changes land in.
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

**Refining a screen? Critique it in order, one lens at a time.** Don't ask "what's wrong" once — run
four focused passes in this fixed order, fixing before the next: **1 Accessibility → 2 Visual hierarchy
→ 3 Content → 4 Interaction-states**. Accessibility is first because it is the foundation — a later fix
must never regress it (fix hierarchy without breaking a11y, refine copy without breaking hierarchy).
Each pass critiques against its section here (§Accessibility, §Typography/§Layout, §Product Content,
§Interaction & States) and re-screenshots at 375 / 768 / 1280 before the next. The `design-critique`
skill runs this loop, sequencing the reviewer agents; the parallel review batch stays the fast PR read.

## Maintenance & Validation

- **Single source of truth:** OKLCH in `globals.css`. Change the background →
  re-sync `theme.hexColors.background` (the only hex mirror, for the PWA manifest)
  → run `pnpm verify:contrast` (WCAG AA).
- **Log it:** every token/component/design change → app changelog `code/projects/web/surfaces/website/CHANGELOG.md`
  with a plain-language _why_; deeper rationale → `code/docs/apps/web/design/decisions.md`.
- **Keep current:** delete anything that no longer matches production — a stale
  rule an agent follows confidently is worse than a missing one.
- **Loaded?** the app `CLAUDE.md` imports this via `@../../packages/ui-tokens/DESIGN.md`; confirm with `/context`.
- **Structure lint (optional):** `npx @google/design.md lint DESIGN.md` catches
  broken refs + orphaned tokens. This file extends the spec (OKLCH mirrors, extra
  sections), so treat lint as advisory, not authoritative.
