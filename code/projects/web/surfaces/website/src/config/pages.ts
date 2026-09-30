/**
 * **This app's** route table — the `pages` map + the `StaticAppPathname` union it
 * derives. App-owned instance config (a second app has its own routes), so it lives
 * here, not in the shared `@indiecrafts/packages-shared-config` package; it conforms to that
 * package's generic `PageConfig` contract.
 *
 * SEO CONTENT (title, description, keywords, OG) is edited in Sanity on the doc
 * each route renders — its `.seo` (`seoMeta`), resolved by `getPageSeo(page.id)`
 * — the sole source. This map carries only STRUCTURAL routing: `key` / `id` /
 * `slug` (route identity) + `enabled` (feature-gate a route on/off).
 */

import type { PageConfig } from "@indiecrafts/packages-shared-config";
import { LEGAL_PAGES } from "@indiecrafts/packages-shared-compliance/shared";
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
  // Waitlist landing — the `module.waitlist` form on a full page. Content +
  // SEO in Sanity (`waitlistSettings` + its `.seo`). Gated by the flag.
  waitlist: {
    key: "/waitlist",
    id: "waitlist",
    slug: "/waitlist",
    enabled: features.waitlist,
  },
  // Contact page — the `module.contact` form on a full page. Content + SEO in
  // Sanity (`contactSettings` + its `.seo`). Gated by the flag.
  contact: {
    key: "/contact",
    id: "contact",
    slug: "/contact",
    enabled: features.contact,
  },
  // Legal pages — content + SEO in Sanity (`legalPage` docs + their `.seo`). The route
  // identity (key/id + per-locale slug, French primary) is the ONE source of truth in
  // `LEGAL_PAGES` (`@indiecrafts/packages-shared-compliance`), so the shells' `legalUrl`
  // link-out and these routes never drift. Each gated by its `features.legal.*` flag.
  legalNotice: { ...LEGAL_PAGES.legalNotice, enabled: features.legal.notice },
  privacy: { ...LEGAL_PAGES.privacy, enabled: features.legal.privacy },
  cookies: { ...LEGAL_PAGES.cookies, enabled: features.legal.cookies },
  terms: { ...LEGAL_PAGES.terms, enabled: features.legal.terms },
  termsOfSale: { ...LEGAL_PAGES.termsOfSale, enabled: features.legal.sales },
  // GDPR data-subject request form — the form is a `@indiecrafts/packages-web-ui-components`
  // component; logic + record + email in `@indiecrafts/packages-web-compliance`. Owns no
  // Sanity doc → uses the layout default SEO. Gated by `features.legal.dataRequest`.
  dataRequest: { ...LEGAL_PAGES.dataRequest, enabled: features.legal.dataRequest },
  // Anonymous branded erasure request — posts straight to the shared api's public
  // `POST /v1/erasure/request` (no auth). Owns no Sanity doc → layout default SEO.
  // Gated by `features.legal.erasure`.
  erasure: {
    key: "/erasure",
    id: "erasure",
    slug: "/erasure",
    enabled: features.legal.erasure,
  },
  // Self-service "Delete my account" — Clerk-authenticated, calls the shared api's
  // `/v1/erasure/self`. Owns no Sanity doc → layout default SEO. Gated by
  // `features.account.delete`; the route itself also 404s with no Clerk key.
  account: {
    key: "/account",
    id: "account",
    slug: "/account",
    enabled: features.account.delete,
    // Signed-in and per-user: out of search, the sitemap and the LLM endpoints.
    seo: { noindex: true },
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
