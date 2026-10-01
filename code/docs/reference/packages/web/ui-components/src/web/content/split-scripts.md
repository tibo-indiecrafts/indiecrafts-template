---
title: "splitScripts"
description: "Splits editor-authored HTML into its markup and its script tags."
status: stable
---

# splitScripts

> Lifts `<script>` tags out of Custom HTML so they can run with the page nonce.

## Purpose

A script inside `dangerouslySetInnerHTML` never runs after a client navigation, and the strict nonce CSP blocks it on first load. `splitScripts` returns the HTML without its scripts, plus each script's attributes and inline code, for `EmbedScripts` to render. It is a regex, not an HTML parser: a `</script>` inside a JavaScript string literal ends the script early.

## Exports

- `splitScripts(html)` — `{ html, scripts }`; empty script tags are dropped.
- `EmbedScript` — `{ attrs, code }`; a bare attribute is `true`, an external script has `code: ""`.

## Source

`code/packages/web/ui-components/src/web/content/split-scripts.ts`
