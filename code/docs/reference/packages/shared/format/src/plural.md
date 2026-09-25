---
title: "Plural selection"
description: "Pick the correct plural message form for a count via Intl.PluralRules."
status: stable
---

# Plural selection

> Choose the right plural wording, then fill in the localized count.

## Purpose

Selects the plural form for a count in a given locale using a memoized `Intl.PluralRules`. In the chosen form, `#` is replaced with the localized count.

## Exports

- `PluralForms` — partial map from a plural category to its message string.
- `plural(count, forms, locale?)` — pick the form for `count` and substitute `#`.

## Usage

```ts
import { plural } from "@indiecrafts/packages-shared-format/plural";

plural(2, { one: "# commentaire", other: "# commentaires" }, "fr"); // "2 commentaires"
```

## Source

`code/packages/shared/format/src/plural.ts`
