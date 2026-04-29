/**
 * Dashboard route metadata. SEO + composition live in
 * `pages-app/dashboard-1/`; this file just registers the route's slug + id
 * with the page registry.
 */

import { definePage } from "@/config/pages/types";

export default definePage({
  key: "/dashboard",
  id: "dashboard",
  slugs: "/dashboard",
  layout: "dashboard",
});
