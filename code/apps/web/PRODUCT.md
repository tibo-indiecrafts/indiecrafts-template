# Product

<!-- impeccable:product-schema 1 -->

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
- **Constraints:** Next 16 / React 19 / pnpm 10 / Turborepo; read from `@/config` (never
  hard-code brand/URL/color/nav); user-facing strings in `messages/<locale>.json`; route via
  `@/i18n/routing`; never expose a server token under `NEXT_PUBLIC_`; `pnpm verify` gates
  tsc + lint + format + contrast.

## Brand Commitments

- **Name:** Indiecrafts. **Voice/identity:** "restraint is the brand" — quiet, editorial,
  crafted; one deliberate signature moment per surface. The visual contract is normative in
  `code/packages/ui-tokens/DESIGN.md` (a single indigo accent on near-neutral greys).

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

WCAG **AA** is a shipping gate: `pnpm verify:contrast` enforces token-pair contrast; every
interactive element carries a visible focus ring; status is never communicated by color alone;
touch targets ≥ 40px. Verified at 375 / 768 / 1280.
