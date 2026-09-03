import { defaultLocale, localeFormat, type Locale } from "@indiecrafts/packages-shared-config/shared";

/** Locale plural selection via `Intl.PluralRules` — pick the right message form. */

const cache = new Map<string, Intl.PluralRules>();
function pr(locale: Locale): Intl.PluralRules {
  const bcp47 = localeFormat(locale).numberLocale;
  let rules = cache.get(bcp47);
  if (!rules) {
    rules = new Intl.PluralRules(bcp47);
    cache.set(bcp47, rules);
  }
  return rules;
}

export type PluralForms = Partial<Record<Intl.LDMLPluralRule, string>>;

/**
 * Pick the plural form for `count` in `locale`; `#` in the chosen form is replaced
 * with the localized count.
 *
 * @example plural(2, { one: "# commentaire", other: "# commentaires" }, "fr") // "2 commentaires"
 */
export function plural(
  count: number,
  forms: PluralForms,
  locale: Locale = defaultLocale,
): string {
  const form = forms[pr(locale).select(count)] ?? forms.other ?? "";
  const localizedCount = new Intl.NumberFormat(
    localeFormat(locale).numberLocale,
  ).format(count);
  return form.replace(/#/g, localizedCount);
}
