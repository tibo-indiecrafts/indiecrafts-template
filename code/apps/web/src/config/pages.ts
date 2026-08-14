/**
 * **This app's** route table — the `pages` map + the `StaticAppPathname` union it
 * derives. App-owned instance config (a second app has its own routes), so it lives
 * here, not in the shared `@indiecrafts/config` package; it conforms to that
 * package's generic `PageConfig` contract.
 *
 * SEO CONTENT (title, description, keywords, OG) is edited per locale in Sanity
 * (`siteMeta.<locale>.pageSeo[pageId]`) — the sole source. This map carries only
 * STRUCTURAL routing: `key` / `id` / `slug` (route identity) + `enabled`
 * (feature-gate a route on/off).
 */

import type { PageConfig } from "@indiecrafts/config";
import { features } from "./features";

// ── Route types (derived from the `pages` map below) ─────────

/**
 * Every static pathname the app routes to — the union of the `pages` map's `key`
 * values, so the map is the single source of truth (add a `pages` entry → the type
 * follows). Dynamic routes (`/blog/[slug]`, …) live in
 * `src/app/routes.ts:DYNAMIC_PATHNAMES`.
 */
export type StaticAppPathname = (typeof pages)[keyof typeof pages]["key"];

/**
 * This app's route entry — the generic `PageConfig` contract re-tightened so `key`
 * is the app's `StaticAppPathname` (the shared contract widens it to `string` so
 * modules stay app-agnostic). Used where the app feeds a route key into its typed
 * routing (`ROUTES`, nav, sitemap).
 */
export type AppRoute = PageConfig & { key: StaticAppPathname };

// ── The pages map ────────────────────────────────────────────

export const pages = {
  home: {
    key: "/",
    id: "home",
    slug: "/",
  },
  // Waitlist landing — the `module.waitlist` form on a full page. Content in
  // Sanity (`waitlistSettings`), SEO in `siteMeta.pageSeo`. Gated by the flag.
  waitlist: {
    key: "/waitlist",
    id: "waitlist",
    slug: "/waitlist",
    enabled: features.waitlist,
  },
  // Legal pages — content in Sanity (`legalPage` docs), SEO in `pageSeo`.
  // Per-locale slugs (French primary). Each gated by its `features.legal.*` flag.
  legalNotice: {
    key: "/legal-notice",
    id: "legal-notice",
    slug: { en: "/legal-notice", fr: "/mentions-legales" },
    enabled: features.legal.notice,
  },
  privacy: {
    key: "/privacy-policy",
    id: "privacy",
    slug: { en: "/privacy-policy", fr: "/politique-de-confidentialite" },
    enabled: features.legal.privacy,
  },
  cookies: {
    key: "/cookie-policy",
    id: "cookies",
    slug: { en: "/cookie-policy", fr: "/politique-de-cookies" },
    enabled: features.legal.cookies,
  },
  terms: {
    key: "/terms",
    id: "terms",
    slug: { en: "/terms", fr: "/conditions-generales-utilisation" },
    enabled: features.legal.terms,
  },
  termsOfSale: {
    key: "/terms-of-sale",
    id: "terms-of-sale",
    slug: { en: "/terms-of-sale", fr: "/conditions-generales-de-vente" },
    enabled: features.legal.sales,
  },
  blog: {
    key: "/blog",
    id: "blog",
    slug: "/blog",
    // Mirrors `features.blog` — sitemap + llms.txt + routing all gate off this.
    enabled: features.blog,
  },
  author: {
    key: "/author",
    id: "author",
    slug: "/author",
    enabled: features.blog && features.blogTaxonomy.authors,
  },
  category: {
    key: "/blog/category",
    id: "category",
    slug: "/blog/category",
    enabled: features.blog && features.blogTaxonomy.categories,
  },
  tag: {
    key: "/blog/tag",
    id: "tag",
    slug: "/blog/tag",
    enabled: features.blog && features.blogTaxonomy.tags,
  },
} as const satisfies Record<string, PageConfig>;
