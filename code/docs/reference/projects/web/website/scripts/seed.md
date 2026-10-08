---
title: "Sanity seeder"
description: "Seeds a Sanity dataset with the baseline every site needs, plus optional translated demo content."
status: stable
---

# Sanity seeder

> Fills an empty Sanity dataset with the baseline content; `--demo` adds a translated demo site.

## Purpose

Seeds a Sanity dataset in one transaction. Every content document has an EN and an FR version, linked by a `translation.metadata` doc.

- **Baseline** (always): the per-locale `siteMeta` SEO singletons, `siteSettings`, the home `page`, the `uiMessages` dictionaries, the five legal pages, navigation, consent, language suggestion, contact/newsletter/waitlist settings, the `blog` singleton, and the E-mails singleton (`private.emailStrings`, every email off).
- **Demo** (`--demo`): authors, categories, tags, a series, posts, quotes, and people with Unsplash images, the home testimonials, the `/blog` frontpage pins, the announcement bar and pop-up, and sample comments and waitlist entries.

**Guard:** the script refuses a dataset that already has a `siteSettings` document. A re-seed replaces every seeded document by `_id` (`createOrReplace`), so on a live site it erases the editors' work. `--force` skips the guard; `pnpm seed:e2e` and the e2e setup use it on the throwaway `tests-e2e` dataset.

Ids are stable, so a re-run with `--force` updates documents in place. A document that holds personal or operator data (comments, waitlist entries, `emailStrings`) gets a dotted `private.` id, which a public dataset hides from anonymous reads.

`--dry-run` prints the documents as JSON. It needs no network and no env, and it uploads no images. `seed.test.mjs` reads this output.

## Exports

No public exports (CLI script).

## Usage

```bash
pnpm seed                          # baseline, into an EMPTY dataset
pnpm seed -- --demo                # baseline + demo content
pnpm seed -- --force               # re-seed a dataset that has content (overwrites!)
pnpm seed -- --dry-run [--demo]    # print the documents as JSON
```

It needs `NEXT_PUBLIC_SANITY_PROJECT_ID` and an Editor-role `SANITY_API_WRITE_TOKEN` in `.env.local`. The target dataset is `NEXT_PUBLIC_SANITY_DATASET` (default `production`).

## Source

`code/projects/web/surfaces/website/scripts/seed.mjs`
