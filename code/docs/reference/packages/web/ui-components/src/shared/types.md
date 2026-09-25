---
title: "Page-builder block types"
description: "Resolved presentational types for the generic page-builder block modules."
status: stable
---

# Page-builder block types

> The platform-agnostic contract for the page-builder blocks.

## Purpose

This module declares the shared presentational types for the generic,
feature-independent page-builder modules rendered by
`@indiecrafts/packages-web-ui-components/web/*`. The types carry **resolved**
data — GROQ has already dereferenced images, links, people, and quotes — so the
renderers stay pure. It is consumed by the renderers here and by
`@indiecrafts/modules-web-blog`, which composes `BlockModule` with its own
blog modules.

## Exports

- `FeatureIcon` — re-export of the shared curated glyph names.
- `ImageRef` — a resolved image asset (url, metadata, alt).
- `ResolvedLink` — a link with the internal/external union collapsed.
- `Cta` — a link plus a button `variant`.
- `ModuleBase` — the fields every module shares (`_key`, `anchor`, `hidden`).
- `PostCardItem` — the resolved post-card shape shared by every featured-posts primitive.
- `GalleryImage` — one resolved gallery image.
- Per-module types — `HeroModule`, `FeatureGridModule`, `PricingModule`, `PricingTier`, `AccordionListModule`, `CalloutModule`, `CardListModule`, `GalleryModule`, `PersonListModule`, `ProseModule`, `StatListModule`, `StepListModule`, `QuoteListModule`, `CustomHtmlModule`, `NewsletterModule`, `WaitlistModule`, `LeadMagnetModule`, `ContactModule`.
- `BlockModule` — the union of all generic block module types, rendered by `BLOCK_RENDERERS`.

## Source

`code/packages/web/ui-components/src/shared/types.ts`
