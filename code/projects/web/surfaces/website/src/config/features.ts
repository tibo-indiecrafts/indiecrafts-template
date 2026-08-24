/**
 * Global feature flags — on/off switches for whole surfaces. One line each; full
 * behavior (routes gated, dependencies, discovery consequences) →
 * `code/docs/apps/web/config/feature-flags.md`.
 *
 * These are **build-time structural** gates (routes / SSG / sitemap / llms.txt), so
 * they stay in code. An *editor-facing* on/off (e.g. `newsletterSettings.enabled`,
 * `siteSettings.maintenanceMode`) lives in Sanity **on top of** the matching flag —
 * the two-layer pattern.
 */

import { defineFeatures } from "@indiecrafts/packages-shared-config";

export const features = defineFeatures({
  /** LLM endpoints: index `/llms.txt` · full `/llms-full.txt` · pages `/llms/<id>`. */
  llms: {
    index: true,
    full: true,
    pages: true,
  },
  /** RSS + Atom feeds. Requires `blog` (gated via `isRssEnabled`). */
  rss: true,
  /** `/sitemap.xml` + robots advertising it. */
  sitemap: true,
  /** All JSON-LD (Organization/WebSite/WebPage/FAQPage). */
  structuredData: true,
  /** Header locale switcher. */
  localeSwitcher: true,
  /** The five legal pages, each toggled independently (`sales` = CGV, selling only). */
  legal: {
    notice: true,
    privacy: true,
    cookies: true,
    terms: true,
    sales: false,
    /** GDPR data-subject request form (`/data-request` + `/api/data-request`). */
    dataRequest: true,
    /** Anonymous branded erasure request (`/erasure` → `POST /v1/erasure/request`). */
    erasure: true,
  },
  /** Compliance behaviour toggles. logAnonymousConsent: also log consent for
   *  signed-out visitors (keyed by a consent_id cookie). Off = account-scoped only. */
  compliance: {
    logAnonymousConsent: false,
  },
  /** Self-service account actions. delete: the `/account` GDPR erasure page
   *  (authenticated `POST /v1/erasure/self`). Requires Clerk to be configured. */
  account: {
    delete: true,
  },
  /** Per-page FAQ — `<Faq>` + FAQPage JSON-LD + llms block. */
  faq: true,
  /** The public blog surface — all blog routes/feeds/discovery. Gated via `route-gate`. */
  blog: true,
  /** Blog taxonomy routes, each toggled independently. Requires `blog`. */
  blogTaxonomy: {
    authors: true,
    categories: true,
    tags: true,
  },
  /** Moderated public comments on each blog post (form + Studio approval). Requires `blog`. */
  blogComments: true,
  /** Blog search — the `/blog/search` route + its search box. Requires `blog`. */
  blogSearch: true,
  /** Blog series — the `/blog/series/<slug>` landing + on-post "Part N of M" nav. Requires `blog`. */
  blogSeries: true,
  /** Newsletter capture — the `module.newsletter` page-builder block + `/api/newsletter`. */
  newsletter: true,
  /** Waitlist capture — the `module.waitlist` page-builder block + `/api/waitlist`. */
  waitlist: true,
  /** Contact form — the `module.contact` block + the `/contact` page + `/api/contact`. */
  contact: true,
  /** Sanity Studio at `/studio` + draft-mode preview. Independent of `blog`. */
  studio: true,
  /**
   * Maintenance mode — a **build-time hard override**: `true` forces `proxy.ts` to
   * rewrite all traffic to `/maintenance` (503) with no Sanity read. The live,
   * no-deploy toggle is the Sanity `siteSettings.maintenanceMode` boolean; the
   * proxy trips on either. Keep this `false` in normal operation.
   */
  maintenance: false,
} as const);
