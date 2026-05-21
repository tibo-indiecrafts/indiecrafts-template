/**
 * Per-page messages aggregator — statically imports each route's JSON files
 * (co-located in `src/app/[locale]/<segment>/messages/`) and exposes
 * `loadPageMessages(locale)` for i18n/request.ts.
 *
 * Static imports are required because Turbopack/Webpack need to see the paths
 * at build time for SSG.
 *
 * Adding a page (step 5 of the flow described in ./index.ts):
 *   1. Import both locale JSONs from the route's messages/ folder
 *   2. Add a row to PAGE_MESSAGES keyed by the page id
 */

import type { Locale } from "@/config/locales.config";

// ---- home ---------------------------------------------------------------
import homeEn from "@/app/[locale]/messages/en.json";
import homeFr from "@/app/[locale]/messages/fr.json";

// --------------------------------------------------------------------------
type PageBundle = Record<Locale, Record<string, unknown>>;

const PAGE_MESSAGES: Record<string, PageBundle> = {
  home: { en: homeEn, fr: homeFr },
};

/**
 * Merge every registered page's locale-specific messages into
 * `{ <id>: {…}, <id>: {…} }`. The result is spread under `pages.*` in
 * the active next-intl message tree.
 */
export function loadPageMessages(locale: Locale): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const id of Object.keys(PAGE_MESSAGES)) {
    out[id] = PAGE_MESSAGES[id][locale];
  }
  return out;
}
