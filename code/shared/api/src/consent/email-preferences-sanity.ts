// Raw GROQ-over-HTTP read of the Studio `emailPreferences` singleton — mirrors
// `clerk-email/sanity.ts` `fetchAuthEmailStrings` (same host branch, Bearer, no new
// deps). This is the api's SINGLE runtime reader of the category definitions; both
// web and mobile consume the api rather than reading Sanity themselves. MUST NOT
// throw: an unset/unreachable/empty Studio must never break the preference centre,
// so every failure resolves to a seeded `news`-only default.

import { pickLocale } from "@indiecrafts/packages-shared-config";
import type { MailEnv } from "../erasure/email";

/** A `localeString`/`localeText` field as stored in Sanity — `{ en, fr }` (or a plain string). */
type LocaleValue =
  Record<string, string | undefined> | string | null | undefined;

type RawCategory = {
  key: string;
  name: LocaleValue;
  description: LocaleValue;
  includeAtSignup: boolean;
  resendTopicId?: string;
};

type RawNotice = { name: LocaleValue; description: LocaleValue };

type RawEmailPreferences = {
  categories?: RawCategory[];
  notices?: RawNotice[];
};

/** One toggleable marketing preference category, resolved to a locale. */
export type PrefCategory = {
  key: string;
  name: string;
  description: string;
  includeAtSignup: boolean;
  resendTopicId?: string;
};

/** One display-only notice in the preference centre, resolved to a locale. */
export type PrefNotice = { name: string; description: string };

/** The seeded `news`-only default used when the Studio singleton is unset, unreachable,
 *  or empty — the preference centre must never be blank. */
const NEWS_DEFAULT: { categories: PrefCategory[]; notices: PrefNotice[] } = {
  categories: [
    {
      key: "news",
      name: "News",
      description: "Product updates and company news.",
      includeAtSignup: true,
    },
  ],
  notices: [],
};

const NEWS_DEFAULT_FR: PrefCategory = {
  key: "news",
  name: "Actualités",
  description: "Nouveautés produit et actualités de l'entreprise.",
  includeAtSignup: true,
};

/** The `news` default localized to `locale` — English unless `locale` is French. */
function newsDefault(locale: string): {
  categories: PrefCategory[];
  notices: PrefNotice[];
} {
  return {
    categories: [
      locale === "fr" ? NEWS_DEFAULT_FR : NEWS_DEFAULT.categories[0],
    ],
    notices: [],
  };
}

/**
 * Fetch + locale-resolve the `emailPreferences` singleton's categories and notices.
 * MUST NOT throw: an unset/unreachable/empty Studio resolves to the `news`-only
 * default. `doFetch` is injectable for tests.
 */
export async function fetchEmailPreferences(
  env: MailEnv,
  locale: string,
  doFetch: typeof fetch = fetch,
): Promise<{ categories: PrefCategory[]; notices: PrefNotice[] }> {
  if (!env.SANITY_PROJECT_ID || !env.SANITY_DATASET) return newsDefault(locale);
  try {
    const version = env.SANITY_API_VERSION || "2025-01-01";
    const token = env.SANITY_API_READ_TOKEN;
    const host = token
      ? `${env.SANITY_PROJECT_ID}.api.sanity.io`
      : `${env.SANITY_PROJECT_ID}.apicdn.sanity.io`;
    const query =
      '*[_type=="emailPreferences"][0]{ categories[]{ key, name, description, includeAtSignup, resendTopicId }, notices[]{ name, description } }';
    const endpoint = `https://${host}/v${version}/data/query/${env.SANITY_DATASET}?query=${encodeURIComponent(query)}`;
    const res = await doFetch(
      endpoint,
      token ? { headers: { authorization: `Bearer ${token}` } } : undefined,
    );
    if (!res.ok) return newsDefault(locale);
    const body = (await res.json()) as { result?: RawEmailPreferences | null };
    const result = body.result;
    if (!result?.categories?.length) return newsDefault(locale);
    return {
      categories: result.categories.map((c) => ({
        key: c.key,
        name: pickLocale(c.name, locale),
        description: pickLocale(c.description, locale),
        includeAtSignup: c.includeAtSignup,
        ...(c.resendTopicId ? { resendTopicId: c.resendTopicId } : {}),
      })),
      notices: (result.notices ?? []).map((n) => ({
        name: pickLocale(n.name, locale),
        description: pickLocale(n.description, locale),
      })),
    };
  } catch {
    return newsDefault(locale);
  }
}
