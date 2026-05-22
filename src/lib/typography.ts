/**
 * Typography helpers — per-locale text polishing.
 *
 * Rules live in `messages/<locale>.json#typography`. Call `getTypography(locale)`
 * in a server component or `useTypography()` in a client component, then run
 * the helpers below on any user-visible string.
 *
 * The shape intentionally matches what translators + content teams need:
 *   titleCase, headingCase .......... "title" | "sentence" | "lower" | "upper"
 *   adjectivePlacement .............. "before" | "after"
 *   quoteStyle.primary / secondary .. ["opener", "closer"]
 *   apostrophe, ellipsis ............ preferred replacement chars
 *   thousandsSeparator, decimalSeparator
 *   dateFormat, timeFormat .......... format tokens for a future formatter
 *   firstDayOfWeek .................. 0=Sunday, 1=Monday
 *   listStyle, oxfordComma
 *   nonBreakingSpaceBeforePunctuation  array of chars that need a narrow NBSP
 *   currencyPosition ................ "before" | "after"
 *   numberSpacing ................... inserted between integer groups
 */

import { getTranslations } from "next-intl/server";
import { useMessages } from "next-intl";
import type { Locale } from "@/config";

export type TypographyRules = {
  titleCase: "title" | "sentence" | "lower" | "upper";
  headingCase: "title" | "sentence" | "lower" | "upper";
  adjectivePlacement: "before" | "after";
  quoteStyle: {
    primary: [string, string];
    secondary: [string, string];
  };
  apostrophe: string;
  ellipsis: string;
  thousandsSeparator: string;
  decimalSeparator: string;
  dateFormat: string;
  timeFormat: string;
  firstDayOfWeek: 0 | 1;
  listStyle: "comma" | "dot" | "dash";
  oxfordComma: boolean;
  hyphenationChar: string;
  nonBreakingSpaceBeforePunctuation: string[];
  currencyPosition: "before" | "after";
  numberSpacing: string;
};

/** Server-side accessor — call inside server components. */
export async function getTypography(locale: Locale): Promise<TypographyRules> {
  const t = await getTranslations({ locale, namespace: "typography" });
  return {
    titleCase: t.raw("titleCase") as TypographyRules["titleCase"],
    headingCase: t.raw("headingCase") as TypographyRules["headingCase"],
    adjectivePlacement: t.raw(
      "adjectivePlacement",
    ) as TypographyRules["adjectivePlacement"],
    quoteStyle: t.raw("quoteStyle") as TypographyRules["quoteStyle"],
    apostrophe: t.raw("apostrophe") as string,
    ellipsis: t.raw("ellipsis") as string,
    thousandsSeparator: t.raw("thousandsSeparator") as string,
    decimalSeparator: t.raw("decimalSeparator") as string,
    dateFormat: t.raw("dateFormat") as string,
    timeFormat: t.raw("timeFormat") as string,
    firstDayOfWeek: t.raw("firstDayOfWeek") as TypographyRules["firstDayOfWeek"],
    listStyle: t.raw("listStyle") as TypographyRules["listStyle"],
    oxfordComma: t.raw("oxfordComma") as boolean,
    hyphenationChar: t.raw("hyphenationChar") as string,
    nonBreakingSpaceBeforePunctuation: t.raw(
      "nonBreakingSpaceBeforePunctuation",
    ) as string[],
    currencyPosition: t.raw("currencyPosition") as TypographyRules["currencyPosition"],
    numberSpacing: t.raw("numberSpacing") as string,
  };
}

/** Client-side accessor — call inside client components. */
export function useTypography(): TypographyRules {
  const messages = useMessages() as unknown as { typography: TypographyRules };
  return messages.typography;
}

// ---------------------------------------------------------------------------
// Transformers
// ---------------------------------------------------------------------------

const MINOR_WORDS = new Set([
  "a",
  "an",
  "and",
  "as",
  "at",
  "but",
  "by",
  "for",
  "in",
  "nor",
  "of",
  "on",
  "or",
  "so",
  "the",
  "to",
  "up",
  "yet",
]);

export function applyCase(input: string, mode: TypographyRules["titleCase"]): string {
  switch (mode) {
    case "upper":
      return input.toLocaleUpperCase();
    case "lower":
      return input.toLocaleLowerCase();
    case "sentence": {
      const lower = input.toLocaleLowerCase();
      return lower.charAt(0).toLocaleUpperCase() + lower.slice(1);
    }
    case "title":
      return input
        .split(/\s+/)
        .map((word, i) => {
          const w = word.toLocaleLowerCase();
          if (i !== 0 && MINOR_WORDS.has(w)) return w;
          return w.charAt(0).toLocaleUpperCase() + w.slice(1);
        })
        .join(" ");
  }
}

/** Wrap text in locale-correct primary quotes. */
export function quote(text: string, rules: TypographyRules): string {
  const [open, close] = rules.quoteStyle.primary;
  return `${open}${text}${close}`;
}

/** Insert non-breaking narrow spaces before punctuation (French typography). */
export function applyNbsp(text: string, rules: TypographyRules): string {
  if (rules.nonBreakingSpaceBeforePunctuation.length === 0) return text;
  const NNBSP = " ";
  const punct = rules.nonBreakingSpaceBeforePunctuation
    .map((c) => c.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("");
  return text.replace(new RegExp(`\\s*([${punct}])`, "g"), `${NNBSP}$1`);
}

/** Format a number using locale separators. */
export function formatNumber(value: number, rules: TypographyRules): string {
  const [int, dec] = value.toString().split(".");
  const withThousands = int.replace(/\B(?=(\d{3})+(?!\d))/g, rules.thousandsSeparator);
  return dec ? `${withThousands}${rules.decimalSeparator}${dec}` : withThousands;
}

/** Place an adjective relative to a noun per locale rules. */
export function placeAdjective(
  noun: string,
  adjective: string,
  rules: TypographyRules,
): string {
  return rules.adjectivePlacement === "before"
    ? `${adjective} ${noun}`
    : `${noun} ${adjective}`;
}
