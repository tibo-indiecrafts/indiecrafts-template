---
title: "EmbedScripts"
description: "Runs a Custom HTML block's scripts in order, with the request nonce, on every mount."
status: stable
---

# EmbedScripts

> Editor scripts that pass the strict nonce CSP.

## Purpose

A client component. On mount it inserts each script from `splitScripts` with the page's nonce (`documentNonce()`, read from a server-rendered script — a per-request value would go stale after an RSC refresh), in order: an external script is awaited (load or error) before the next, so "load the library, then call it" snippets work; one that never loads (`nomodule`, a non-JS `type`) is not awaited. An unmount mid-load aborts the run before the next insert. It re-runs on every mount — first load and each client navigation back — like a full page load, so a widget finds its markup; on unmount it removes what it inserted. `next/script` was not used: it runs an id or src once per session. Inline `on*` handler attributes are dropped; they cannot take a nonce. `'strict-dynamic'` trusts what the scripts load.

## Exports

- `EmbedScripts({ scripts })` — the component.
- `runScripts(scripts, nonce, parent, signal?)` — inserts the scripts; resolves to a cleanup.
- `documentNonce()` — the nonce the page's CSP enforces, or `undefined`.

## Source

`code/packages/web/ui-components/src/web/content/EmbedScripts.tsx`
