/**
 * List the page types whose sidebar Site web → Barre latérale configures.
 *
 * @see docs/reference/projects/web/website/src/sanity/sidebar-pages.md
 */

/**
 * The page types of this site, each a field of `sidebarSettings.byType`. `title` is the
 * Studio label. Read by the Studio config (the schema) and by `getSidebar` (the routes).
 */
export const SIDEBAR_PAGES = [
  { name: "home", title: "Accueil" },
  { name: "page", title: "Pages" },
  { name: "blogIndex", title: "Accueil du blog (/blog)" },
  { name: "post", title: "Articles" },
  {
    name: "blogListing",
    title: "Listes du blog (catégories, tags, séries, auteur·rice·s, recherche)",
  },
] as const;

export type SidebarPage = (typeof SIDEBAR_PAGES)[number]["name"];
