# @indiecrafts/packages-shared-format — locale formatting & grammar

**Stack:** TypeScript. Pure, framework-agnostic (no React) `Intl`-based helpers. Foundation · agnostic.

Auto-loads under `code/packages/shared/format/**`. Consumed as source via `transpilePackages`. Subpath-only
(explicit-extension `exports` → no tsconfig `paths` entry). Dep: `@indiecrafts/packages-shared-config` only.

- **`/money`** — `formatMoney` (memoized `Intl.NumberFormat` currency, `cents` support) · `parseMoney`
  · `toMajor`/`toCents` · `convert` (rates from `formatDefaults`, throws on a missing pair) ·
  `withVat`/`netFromGross` (TTC↔HT).
- **`/number`** — `formatNumber` · `formatPercent` · `formatCompact` · `formatUnit` · `formatOrdinal`
  (1st/1er) · `formatBytes` · `formatRange` · `clamp`/`roundTo`.
- **`/relative`** — `formatRelativeTime` (`Intl.RelativeTimeFormat`) · `formatDuration` (minutes →
  "5 min") · `formatClock` · `formatDateRange`.
- **`/list`** — `formatList` (`Intl.ListFormat`) · `joinTruncated`.
- **`/plural`** — `plural(count, forms, locale)` (`Intl.PluralRules`; `#` → localized count).
- **`/grammar`** — generated-content: `capitalize` (Title vs sentence per `capitalizeInlineNouns`) ·
  `inlineNoun` (FR) · `placeAdjective` (`adjBeforeNoun`) · `article` (FR le/la/l'/du/au agreement) ·
  `adjective` · `titleCase`/`sentenceCase`. Casing · order · agreement — **not** conjugation.
- **`/text`** — `truncate` · `initials` · `wordCount` · `readingTime` · `excerpt` · `maskEmail` ·
  `nameFormat` · `prettyUrl` · `fileExtension`.
- **`/validate`** — `isEmail` · `isPhone`/`formatPhone` · `isPostalCode` · `isIban`/`formatIban`
  (mod-97) · `isVatNumber`.

**Config:** per-locale rules live on the `i18n.locales` rows in `@indiecrafts/packages-shared-config`
(`numberLocale`, `currency`, `capitalizeInlineNouns`, `adjBeforeNoun`) + site-wide `formatDefaults`
(`currency`, `vatRate`, `rates`); `localeFormat(locale)` resolves them. **Not Sanity, not `messages/`.**
Formatting **numbers** here; **words** (labels, "read", "more") stay in `messages/`.

Full reference → [`code/docs/packages/format.md`](../../../../docs/packages/format.md).
