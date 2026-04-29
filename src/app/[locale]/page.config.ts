/**
 * Home page route metadata — slugs, key, layout name, and per-page SEO
 * overrides. Template-level SEO defaults live in
 * `pages-marketing/landing-1/config.ts`; anything declared in `seo:` here
 * wins over those defaults via the merge inside `buildMetadata`.
 *
 * Expanding SEO is one field: add e.g. `noindex: true` or
 * `keywords: [...]` and it propagates to `<head>` automatically.
 */

import { definePage } from "@/config/pages/types";

export default definePage({
  key: "/",
  id: "home",
  slugs: "/",
  layout: "default",
  // Example route-level override — adds two keywords on top of the
  // template defaults. Remove this block to fall back to the template.
  seo: {
    keywords: ["next.js template", "indiecrafts"],
  },
});
