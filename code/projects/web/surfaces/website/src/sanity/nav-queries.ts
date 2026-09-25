/**
 * Query the navigation singleton — header menu and footer columns.
 *
 * @see docs/reference/projects/web/website/src/sanity/nav-queries.md
 */

import { defineQuery } from "next-sanity";

/**
 * Navigation GROQ — the language-independent `navigation` singleton (header menu
 * + footer columns). Labels/column titles are `localeString` objects (one field
 * per locale), resolved per-request in `getNavigation` (`src/lib/navigation.ts`).
 * `defineQuery` flags it for `sanity typegen`. Null when the doc is absent.
 */
export const navigationQuery = defineQuery(`
  *[_id == "navigation"][0]{
    header[]{
      label, linkType, route, external, newTab, icon, description,
      "children": children[]{ label, linkType, route, external, newTab, icon, description }
    },
    footerColumns[]{
      title,
      "links": links[]{ label, linkType, route, external, newTab }
    }
  }
`);
