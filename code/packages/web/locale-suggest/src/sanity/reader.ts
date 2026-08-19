/**
 * Sanity-only language-suggestion copy reader. The `localeSuggest` singleton is the
 * SOLE runtime source — no `messages` fallback (the content-in-Sanity rule). Empty
 * on any error. React-`cache`d.
 */

import { cache } from "react";
import { defaultLocale, type Locale } from "@indiecrafts/config";
import { client } from "@indiecrafts/sanity/client";
import { localeSuggestQuery } from "./queries";

export type LocaleSuggestCopy = {
  message?: string;
  switchLabel?: string;
  dismissLabel?: string;
};

type RawLocaleString = Record<string, string | null> | null;

const EMPTY: LocaleSuggestCopy = {};

function localized(value: RawLocaleString, locale: Locale): string {
  return value?.[locale] ?? value?.[defaultLocale] ?? "";
}

export const getLocaleSuggest = cache(
  async (locale: Locale): Promise<LocaleSuggestCopy> => {
    try {
      const data = await client.fetch(localeSuggestQuery);
      if (!data) return EMPTY;
      return {
        message: localized(data.message ?? null, locale) || undefined,
        switchLabel: localized(data.switchLabel ?? null, locale) || undefined,
        dismissLabel: localized(data.dismissLabel ?? null, locale) || undefined,
      };
    } catch {
      return EMPTY;
    }
  },
);
