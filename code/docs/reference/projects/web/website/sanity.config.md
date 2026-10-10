---
title: "Sanity Studio config (website)"
description: "Composes the embedded Sanity Studio at /studio from each owner's SanityModule into one per-app grouped hub."
status: stable
---

# Sanity Studio config (website)

> Merges every owner's `SanityModule` into one hub Studio whose desk is grouped per app.

## Purpose

Configures the embedded Sanity Studio at `/studio`. This file is a thin composer: each owner (the shared-schema brick, the app core, and each module) exports a `SanityModule` contribution, and `composeStudio` merges them into one hub Studio. The desk is grouped per app — "Site web" (this app's content: page-builder, blog, and the feature modules) versus "Contenu partagé" (site-wide config every app or lens reads: SEO/nav/legal, compliance, announcements, the composed E-mails singleton, email preferences, app content, and Clerk emails). One dataset, one editing surface.

`pageBuilderSanity` takes the blog's `BLOG_SECTION_TYPES` and `BLOG_SIDEBAR_TYPES` and this site's `SIDEBAR_PAGES`. So a page holds the generic blocks and the blog blocks, and Site web → Barre latérale lists one entry per page type. The feature modules are activated per feature flag (for example `newsletterSanity(features.newsletter)`); schema always registers while the desk hides when off. The config also wires the "Envoyer un test" document action for `emailStrings`, document internationalization (derived from the shared `locales` source), and the vision tool. The personal types (`comment`, `contactMessage`, `waitlistEntry`) get no "create" (`newDocumentOptions`) and no "duplicate" action. `sidebarSettings` gets no "create" either: it is one pinned document per locale. Only the site's forms create them, with a dotted `privateId` id that a public dataset hides from anonymous reads; a Studio copy would get a random, public id.

The **Aperçu** tab (Sanity's Presentation tool) shows the site with drafts and click-to-edit, through `/api/draft-mode/enable` and `/disable`; a post links to its page. Embedded at `/studio`, it previews this same site. In the hosted Studio, `SANITY_STUDIO_PREVIEW_ORIGINS` (set by `sanity.cli.ts`) supplies the deployed sites: it opens the first and allows the others.

## Exports

- Default export: the Sanity Studio config (`defineConfig({ … })`).

## Source

`code/projects/web/surfaces/website/sanity.config.ts`
