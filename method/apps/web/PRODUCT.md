# Product

<!-- impeccable:product-schema 1 -->

_Design-context triad: **[CLAUDE.md](./CLAUDE.md)** (how to build) · **[DESIGN.md](../../packages/ui-tokens/DESIGN.md)** (how it looks) · this file (who & why). Each owns its facts; the others link, never duplicate._

## Platform

web

## Users

Two audiences, one product:

- **Builders** — the developers and small agencies who clone this template to ship a client's
  marketing/content site fast. They work in a config-first monorepo, want brand/SEO/content to
  live in one place, and value not re-deciding architecture per project.
- **Client editors** — non-technical site owners who edit copy, navigation, legal pages,
  cookie categories, blog posts, and SEO in the Sanity Studio, without a redeploy.

## Product Purpose

A config-first Next.js 16 template ("indiecrafts.dev") for standing up a localized,
SEO-complete, Sanity-backed client site quickly. It exists so a builder starts from a working,
opinionated platform — routing, i18n, theming, SEO/JSON-LD, a gated blog, cookie consent, a
design-token system — instead of assembling them each time. Success = a client site shipped in
days with brand, content, and compliance editable by the client afterward.

## Positioning

**Config-first + Sanity-driven, with nothing hard-coded.** Brand strings, URLs, navigation,
legal pages, cookie/consent, analytics, and per-page SEO are read from `@/config` or edited in
Sanity singletons — a client changes them with no code change or redeploy. Paired with a
**modular monorepo** (shared bricks + product modules extracted only at ≥2 consumers) and a
**portable design-token contract** (`DESIGN.md`), it's a template a neighboring boilerplate
can't copy without also adopting the "one home per fact" discipline.

## Operating Context

- Monorepo of four mirrored roots: `code/` (pnpm + Turborepo workspace), `method/` (the dev
  framework), `work/` (the sprint lab), `docs/` (VitePress product canon).
- Runs from the repo root (`pnpm dev/build/verify`). Content authored in Sanity Studio
  (`/studio`); demo content via `pnpm seed`. Deploys host-agnostic (Netlify manifest shipped).

## Capabilities and Constraints

- **Capabilities:** localized routing (en/fr) via next-intl; Sanity-driven SEO + JSON-LD +
  `llms.txt`/RSS; a feature-flagged blog module with a page-builder block system; a full cookie
  CMP with Google Consent Mode; theme modes (light/dark/system) and a font-pairing registry;
  CDN-sized images via a `next/image` loader.
- **Constraints:** the stack (Next 16 / React 19 / pnpm 10 / Turborepo) plus the build rules
  (config-first, i18n, tokens, the security NEVERs, the `pnpm verify` gate) are owned by
  [`CLAUDE.md`](./CLAUDE.md) — not repeated here.

## Brand Commitments

- **Name:** Indiecrafts. The voice/identity + the normative visual contract are owned by
  [`DESIGN.md`](../../packages/ui-tokens/DESIGN.md) ("restraint is the brand"; one indigo accent
  on near-neutral greys, one signature moment per surface) — see it, not here.

## Evidence on Hand

- The template repository itself; a Sanity demo dataset seeded by `pnpm seed`
  (`code/apps/web/scripts/seed-demo.mjs`). **No real customer testimonials, logos, pricing, or
  case studies** ship with the template — future work must not fabricate them.

## Product Principles

1. **One home per fact** — every brand/content/SEO value has exactly one source (config or
   Sanity); duplication is drift.
2. **Config-first** — behavior flips via flags/config, not code edits, so client sites diverge
   by data, not forks.
3. **Restraint** — spend boldness once per surface; tokens win over ad-hoc values.
4. **Modular, at the right time** — extract a package/module at ≥2 consumers (YAGNI), each in a
   predictable place (code + registry + doc + changelog).

## Accessibility & Inclusion

WCAG **AA** is a shipping gate (`pnpm verify:contrast`). The visual a11y contract is owned by
[`DESIGN.md`](../../packages/ui-tokens/DESIGN.md) (Accessibility) and the structural rules by
[`method/apps/web/rules/accessibility.md`](../../../method/apps/web/rules/accessibility.md) —
referenced here, not duplicated.
