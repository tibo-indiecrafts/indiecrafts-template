---
title: Architecture decisions (ADRs)
description: How and when to record an architecture decision record.
status: stable
order: 1
---

# Architecture decisions (ADRs)

An ADR records one significant decision: the context, the choice, and its
consequences. Write one when a decision shapes structure, interfaces, or a
config-first trade-off that a future reader would otherwise have to reverse-engineer.

## When to write one

- A structural choice (a new tier, a boundary, a split, a registry).
- A config-first trade-off (a default, a flag, a posture kept on purpose).
- A decision you expect someone to question later.

Do **not** write one for a routine change the diff already explains.

## How

1. Copy [the template](/contributing/adr/0000-template) to
   `contributing/adr/NNNN-short-title.md` (next number, zero-padded).
2. Fill Context / Decision / Consequences. Set Status to `Accepted`.
3. Add the sidebar line and link the ADR from the architecture page it affects.
4. Ship it in the same PR as the change it records.

## Status values

`Proposed` · `Accepted` · `Superseded by NNNN` · `Deprecated`.

## Log

- `0000` — [Template](/contributing/adr/0000-template).
- `0001` — [Capacitor over Expo](/contributing/adr/0001-capacitor-over-expo).

> The web app's visual-system decisions also live as a running log in
> [Design decisions](/projects/web/website/design/decisions).
