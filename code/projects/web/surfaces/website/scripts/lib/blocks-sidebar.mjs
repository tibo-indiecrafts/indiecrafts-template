/**
 * The documents the block sidebar needs: the home's featured block and the sidebar settings.
 * Shared by the seed (new datasets) and `sidebar-migrate.mjs` (existing ones).
 */

/** The home page's "Articles à la une" copy, per locale. */
export const HOME_FEATURED_COPY = {
  en: {
    eyebrow: "Featured",
    title: "Notes from the studio",
    intro: "Guides, teardowns, and field notes on shipping client sites faster.",
    viewAll: "All articles",
  },
  fr: {
    eyebrow: "À la une",
    title: "Notes de l'atelier",
    intro:
      "Guides, analyses et retours de terrain pour livrer des sites clients plus vite.",
    viewAll: "Tous les articles",
  },
};

/** The home's featured block: the posts marked « Mis en avant », editorial layout. */
export const homeFeaturedBlock = (lang, _key) => ({
  _type: "module.blog-featured",
  _key,
  anchor: "home-featured",
  layout: "editorial",
  source: "flag",
  limit: 4,
  ...HOME_FEATURED_COPY[lang],
});

/**
 * `sidebarSettings-<lang>`: articles show the post's table of contents and its related
 * posts; every other page type inherits the empty default (no sidebar).
 */
export const sidebarSettingsDoc = (lang, key) => ({
  _id: `sidebarSettings-${lang}`,
  _type: "sidebarSettings",
  byType: {
    post: {
      mode: "custom",
      blocks: [
        { _type: "module.blog-toc", _key: key() },
        { _type: "module.blog-related", _key: key(), limit: 4 },
      ],
    },
  },
});
