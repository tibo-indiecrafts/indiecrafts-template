/**
 * About page route metadata — slugs, key, layout name. SEO + sections live
 * inside the page-template (`pages-marketing/about-1/`); see ../page.config.ts
 * for the rationale.
 */

import { definePage } from "@/config/pages/types";

export default definePage({
  key: "/about",
  id: "about",
  slugs: {
    en: "/about",
    fr: "/a-propos",
  },
  layout: "default",
});
