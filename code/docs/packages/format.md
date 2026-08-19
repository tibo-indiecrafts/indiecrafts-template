# Format (locale money · number · time · grammar)

Pure, framework-agnostic locale formatting — money, numbers, dates, lists, plurals, **grammar for
generated content**, text helpers, and contact validators. Lives in the **`@indiecrafts/format`**
brick (`code/packages/shared/format`), consumed as source. `Intl`-based (correct per locale, not hardcoded);
dep: `@indiecrafts/config` only.

**The rule:** format **numbers** here; keep **words** (labels, "read", "more") in `messages/`.

## Subpaths

| Import      | What it is                                                                                                                                                                           |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `/money`    | `formatMoney` (currency, `cents`) · `parseMoney` · `toMajor`/`toCents` · `convert` (rates from config) · `withVat`/`netFromGross` (TTC↔HT).                                          |
| `/number`   | `formatNumber` · `formatPercent` · `formatCompact` · `formatUnit` · `formatOrdinal` (1st/1er) · `formatBytes` · `formatRange` · `clamp`/`roundTo`.                                   |
| `/relative` | `formatRelativeTime` (`Intl.RelativeTimeFormat`) · `formatDuration` (min → "5 min") · `formatClock` · `formatDateRange`.                                                             |
| `/list`     | `formatList` (`Intl.ListFormat`) · `joinTruncated`.                                                                                                                                  |
| `/plural`   | `plural(count, forms, locale)` (`Intl.PluralRules`; `#` → localized count).                                                                                                          |
| `/grammar`  | `capitalize` (Title vs sentence) · `inlineNoun` (FR) · `placeAdjective` (adjective position) · `article` (FR `le/la/l'/du/au` agreement) · `adjective` · `titleCase`/`sentenceCase`. |
| `/text`     | `truncate` · `initials` · `wordCount` · `readingTime` · `excerpt` · `maskEmail` · `nameFormat` · `prettyUrl` · `fileExtension`.                                                      |
| `/validate` | `isEmail` · `isPhone`/`formatPhone` · `isPostalCode` · `isIban`/`formatIban` (mod-97) · `isVatNumber`.                                                                               |

## Per-locale config (in `@indiecrafts/config`)

Each `i18n.locales` row carries the rules: `numberLocale` (BCP-47 for `Intl`), `currency`,
`capitalizeInlineNouns` (Title-Case EN/DE vs sentence-case FR), `adjBeforeNoun` (adjective position).
Site-wide `formatDefaults` holds `{ currency, vatRate, rates }` (the conversion table the project
maintains). `localeFormat(locale)` resolves a row over the defaults. **Not Sanity, not `messages/`** —
these are technical i18n rules an editor never touches. If commerce ever lands, an editor-facing
currency can go on `siteSettings` and be passed to `formatMoney` at the call site (the brick is pure).

## Generated content — grammar

```ts
import {
  capitalize,
  placeAdjective,
  article,
} from "@indiecrafts/format/grammar";
placeAdjective("produit", "personnalisé", "fr"); // "produit personnalisé"  (EN: "custom product")
article("thème", { locale: "fr", gender: "m", kind: "de" }); // "du thème"
capitalize("produit personnalisé", "fr"); // "Produit personnalisé" (FR sentence-case)
```

`article`/`adjective` are **data-driven** — the caller supplies gender/number + the words; the brick
applies the locale's rules. Scope is casing · order · agreement — **not** conjugation/full morphology.

## Consumers

- **`@indiecrafts/blog`** — the post byline uses `formatList` (author names).
- Adjacent UI: **`PhoneInput`** ([ui-components](/packages/ui-components)) pairs with `/validate`.
  Address autocomplete + payment cards are deliberately **not** shipped (external API + privacy; PCI).
