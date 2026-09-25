---
title: "Lead-magnet schema"
description: "Sanity document type for a downloadable file offered in exchange for an email."
status: stable
---

# Lead-magnet schema

> A named file plus an enabled toggle — the doc a capture block references.

## Purpose

Defines the `leadMagnet` Sanity document — a downloadable file (guide, checklist, template) offered in exchange for an email. A `module.lead-magnet` capture block references one; after the visitor confirms their email, the file is delivered as a signed, expiring link. Editors create and manage these in the "Aimants à prospects" desk. Fields: `title` (shown in the delivery email), `asset` (the file), and `enabled` (suspend delivery without deleting).

## Exports

- default — the `leadMagnet` Sanity document type (`defineType`).

## Source

`code/modules/web/newsletter/src/sanity/schema/lead-magnet.ts`
