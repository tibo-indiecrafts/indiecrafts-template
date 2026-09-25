---
title: "Grammar helpers"
description: "Locale-aware casing, adjective position, and article / gender agreement for generated content."
status: stable
---

# Grammar helpers

> Casing, order, and agreement for generated content — not full morphology.

## Purpose

Provides grammar for generated content: locale-aware casing, adjective position, and data-driven article / gender agreement. The caller supplies gender, number, and the actual words; this applies the locale's rules. It is not full morphology (no conjugation lexicon) — casing, order, and agreement only.

## Exports

- `Gender`, `GrammaticalNumber` — `"m"` / `"f"` and `"singular"` / `"plural"`.
- `titleCase(text)`, `sentenceCase(text)` — Title Case and Sentence case.
- `capitalize(text, locale?)` — Title Case (EN / DE) or sentence case (FR) per the locale's `capitalizeInlineNouns`.
- `inlineNoun(name, locale?)` — lowercase a common noun for mid-sentence use (FR only).
- `placeAdjective(noun, adjective, locale?)` — place an adjective per the locale's `adjBeforeNoun`.
- `adjective(forms, gender?)` — pick the gender-agreeing adjective form.
- `article(noun, options?)` — prefix a noun with its article / preposition, agreeing per locale.
- `ArticleKind`, `ArticleOptions` — the article kind and the options bag.

## Usage

```ts
import {
  capitalize,
  article,
} from "@indiecrafts/packages-shared-format/grammar";

capitalize("custom product", "fr"); // "Custom product"
article("archer", { locale: "fr", kind: "definite" }); // "l'archer"
```

## Source

`code/packages/shared/format/src/grammar.ts`
