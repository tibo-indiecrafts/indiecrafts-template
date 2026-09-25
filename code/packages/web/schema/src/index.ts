/**
 * Registers the shared Sanity object primitives (localeString, localeText, seoMeta).
 *
 * @see docs/reference/packages/web/schema/src/index.md
 */
import type { SanityModule } from "@indiecrafts/packages-web-sanity/module";
import localeString from "./locale-string";
import localeText from "./locale-text";
import seoMeta from "./seo-meta";

/**
 * Shared Sanity **object primitives** — the reusable, doc-agnostic field types
 * that more than one owner needs, so a module never reaches into the app or a
 * sibling module for them:
 *
 *   - `localeString` — per-locale short string (nav labels, comment copy, …)
 *   - `localeText`   — per-locale multi-line text (email bodies, …)
 *   - `seoMeta`      — the ONE per-page SEO + LLMs + visibility model (`.seo` on every rendering doc)
 *
 * They're registered once via this contribution; every schema references them by
 * type name. Only genuinely decoupled primitives live here — `link`/`cta` stay
 * in the blog for now because their internal target is a `post` (they graduate
 * when a `page` document broadens that target).
 */
export const sharedSanity: SanityModule = {
  name: "shared",
  schemaTypes: [localeString, localeText, seoMeta],
};

export { localeString, localeText, seoMeta };
