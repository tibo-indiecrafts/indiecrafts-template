---
title: "Person document"
description: "Sanity document schema for a team member, referenced by the Person List module."
status: stable
---

# Person document

> A reusable person record for team and contributor lists.

## Purpose

Defines the `person` Sanity document: a team member or contributor with a name, role, photo, bio, and social links. It is distinct from `author`, which is the author of a blog post. The `person-list` module references it.

## Exports

- `default` — the `person` document schema built with `defineType`.

## Source

`code/packages/web/page-builder/src/sanity/schema/documents/person.ts`
