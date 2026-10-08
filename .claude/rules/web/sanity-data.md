---
paths:
  - "code/**/sanity/**/*.ts"
  - "code/packages/web/sanity/src/*.ts"
  - "code/modules/web/**/src/lib/*.ts"
  - "code/projects/web/surfaces/website/scripts/**/*.mjs"
description: Sanity data safety — private ids on a public dataset, and the seed's baseline/demo split.
---

# Sanity data — public datasets, private ids, the seed

Load when you write a Sanity schema, a runtime write, or the seed. Sanity's free plan has **2 datasets,
public only**: anyone can read a document without a token, **unless its `_id` contains a dot**.
Server reads use a token, so a dotted id changes nothing for the site.

## Rules

- **Personal or operator data gets a `private.` id.** Emails, names, messages, IP-derived data,
  moderation tokens, alert recipients. A runtime write uses `privateId(type)`
  (`@indiecrafts/packages-web-sanity/private-id`) — never a bare `writeClient.create()`, whose random
  id is public. A singleton that holds such data uses a fixed `private.<type>` id (`private.emailStrings`).
- **A new personal type:** add it to `personalTypes` in the website's `sanity.config.ts`. The Studio
  then cannot create or duplicate one: a Studio copy would get a public id.
- **Public content stays undotted only if a token-less reader needs it** — the app surface and the
  mobile build read `siteSettings` / `appContent` over the public CDN.
- **Assets are always public.** A file in Sanity is downloadable by anyone with its URL, and asset
  documents are listable on a public dataset. Never store a file that must stay gated.
- **Moving an existing id** is a data migration: extend `scripts/sanity-privatize.mjs` (dry run by
  default, `--apply` to write), never a hand edit.

## The seed (`scripts/seed.mjs`)

- **Baseline** = what a new site needs to work and to be legal (settings, SEO, legal pages, consent,
  navigation, emails). **Demo** (`--demo`) = sample content. Required copy for a new singleton →
  baseline; anything a client would delete → demo.
- **Baseline never references a demo document** (a missing strong reference fails the whole
  transaction). `seed.test.mjs` checks it.
- **Ids are stable.** Never rename a seeded `_id`: the old document stays orphaned in every dataset.
- **Never seed a live dataset.** The guard refuses a dataset with a `siteSettings` document; only the
  throwaway `tests-e2e` dataset (any `tests-…` name) is re-seeded with `--force` (`pnpm seed:e2e`, and `pnpm e2e` locally).
- **CI never writes to Sanity.** A token works on every dataset of the project (one-dataset tokens are
  Enterprise only), so CI holds none: the journeys stub every form POST and read the seeded `tests-e2e`
  dataset. After a seed change, run `pnpm seed:e2e` before you push.

## Why

A public dataset is a public API. One `client.create()` without an id would publish every visitor's email
on the free plan; the fix is a naming convention, so it has to be a reflex.
