---
title: "Sanity privatize move"
description: "One-time move of personal-data documents and the E-mails singleton to dotted private ids."
status: stable
---

# Sanity privatize move

> Gives every document that holds personal or operator data a private (dotted) id.

## Purpose

Sanity's free plan has public datasets only: anyone can read a document without a token, unless its id contains a dot. The forms now write `private.<type>.<uuid>` ids, and the E-mails singleton lives at `private.emailStrings`. This script moves the documents written before that change:

- `comment`, `contactMessage`, `waitlistEntry` → `private.<type>.<old id>`. A leading `<type>.` is dropped: `comment.demo-approved` becomes `private.comment.demo-approved`, the id the seed writes.
- `emailStrings` → `private.emailStrings`.

Drafts move with their document. A reference to a moved id (a reply's `parent`) is rewritten. The move runs in one transaction: all or nothing. A `private.` id never moves again, so a re-run is safe. The default run is a dry run that prints the plan; `--apply` writes it.

## Exports

- `PERSONAL_TYPES` — the moved document types: `comment`, `contactMessage`, `waitlistEntry`.
- `privateIdFor({ _id, _type })` — the private id for an existing document, or `null` when it is private already. Keeps the `drafts.` prefix. Pure.
- `rewriteRefs(value, ids)` — a deep copy of `value` with every `_ref` found in the `ids` map (old → new) rewritten. Pure.
- `planMoves(docs, referrers?)` — returns `{ creates, patches, deletes }`: the documents to create on new ids, the referencing documents to replace, and the old ids to delete. Pure.

## Usage

```bash
pnpm sanity:privatize                           # dry run: prints the plan
pnpm sanity:privatize -- --apply                # writes it
pnpm sanity:privatize -- --dataset tests-e2e --apply  # another dataset
```

It needs `NEXT_PUBLIC_SANITY_PROJECT_ID` and an Editor-role `SANITY_API_WRITE_TOKEN` in `.env.local`. Without `--dataset`, it targets `NEXT_PUBLIC_SANITY_DATASET` (default `production`).

## Source

`code/projects/web/surfaces/website/scripts/sanity-privatize.mjs`
