import { defaultLocale, localeFormat, type Locale } from "@indiecrafts/packages-shared-config";

/**
 * Grammar for **generated content** — locale-aware casing, adjective position, and
 * (data-driven) article/gender agreement. The caller supplies gender/number + the
 * actual words; this applies the locale's rules. Not full morphology (no
 * conjugation lexicon) — casing · order · agreement.
 */

export type Gender = "m" | "f";
export type GrammaticalNumber = "singular" | "plural";

/** "custom product" → "Custom Product". */
export function titleCase(text: string): string {
  return text
    .split(/\s+/)
    .map((w) => (w ? w.charAt(0).toUpperCase() + w.slice(1) : w))
    .join(" ");
}

/** "custom product" → "Custom product". */
export function sentenceCase(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/** Title-Case (EN/DE) or sentence-case (FR) per the locale's `capitalizeInlineNouns`. */
export function capitalize(
  text: string,
  locale: Locale = defaultLocale,
): string {
  if (!text) return text;
  return localeFormat(locale).capitalizeInlineNouns
    ? titleCase(text)
    : sentenceCase(text);
}

/** Lowercase a common noun for mid-sentence use — FR only ("Tir à l'arc" → "tir à l'arc"). */
export function inlineNoun(
  name: string,
  locale: Locale = defaultLocale,
): string {
  if (locale !== "fr" || !name) return name;
  return name.charAt(0).toLowerCase() + name.slice(1);
}

/** Place an adjective per the locale: EN "custom product", FR "produit personnalisé". */
export function placeAdjective(
  noun: string,
  adjective: string,
  locale: Locale = defaultLocale,
): string {
  return localeFormat(locale).adjBeforeNoun
    ? `${adjective} ${noun}`
    : `${noun} ${adjective}`;
}

/** Pick the gender-agreeing adjective form (FR-style; EN passes `masculine`). */
export function adjective(
  forms: { masculine: string; feminine: string },
  gender: Gender = "m",
): string {
  return gender === "f" ? forms.feminine : forms.masculine;
}

export type ArticleKind = "definite" | "de" | "a";
export type ArticleOptions = {
  locale?: Locale;
  gender?: Gender;
  number?: GrammaticalNumber;
  kind?: ArticleKind;
};

const startsWithVowelSound = (word: string): boolean =>
  /^[aeiouhàâäéèêëïîôöûüy]/i.test(word.trim());

/**
 * Prefix a noun with its article/preposition, agreeing per locale. FR:
 * definite `le/la/l'/les`, `de` → `du/de la/de l'/des`, `a` → `au/à la/à l'/aux`.
 * EN: `the` / `of the` / `to the`. Caller supplies `gender`/`number`.
 *
 * @example article("thème", { locale: "fr", gender: "m", kind: "de" })   // "du thème"
 * @example article("archer", { locale: "fr", kind: "definite" })         // "l'archer"
 */
export function article(
  noun: string,
  {
    locale = defaultLocale,
    gender = "m",
    number = "singular",
    kind = "definite",
  }: ArticleOptions = {},
): string {
  if (locale !== "fr") {
    const prefix = kind === "de" ? "of the" : kind === "a" ? "to the" : "the";
    return `${prefix} ${noun}`;
  }
  if (number === "plural") {
    const w = kind === "de" ? "des" : kind === "a" ? "aux" : "les";
    return `${w} ${noun}`;
  }
  if (startsWithVowelSound(noun)) {
    const w = kind === "de" ? "de l'" : kind === "a" ? "à l'" : "l'";
    return `${w}${noun}`;
  }
  const table = {
    m: { definite: "le", de: "du", a: "au" },
    f: { definite: "la", de: "de la", a: "à la" },
  } as const;
  return `${table[gender][kind]} ${noun}`;
}
