import { defineField, defineType } from "sanity";
import { HomeIcon } from "@sanity/icons";
import { MODULE_TYPES } from "@indiecrafts/blog/sanity/schema/modules/index";

/**
 * Per-locale homepage — fixed-id singletons (`homePage.en` / `homePage.fr`, one
 * per language) holding an ordered `pageModules[]` of page-builder blocks, the
 * same `module.*` types the blog body uses. Rendered by the `(home)` route via
 * the shared `renderBlock` registry; read by `getHomePage` (`src/lib/home.ts`).
 *
 * The three blog-context modules (`blog-index`, `blog-post-*`) are excluded — a
 * homepage composes marketing blocks (hero, feature-grid, pricing, quote-list,
 * accordion-list, newsletter, …), not blog-listing chrome.
 */
const BLOG_ONLY = [
  "module.blog-index",
  "module.blog-post-content",
  "module.blog-post-list",
];

const pageModuleRefs = MODULE_TYPES.filter((t) => !BLOG_ONLY.includes(t)).map((type) => ({
  type,
}));

export default defineType({
  name: "homePage",
  title: "Accueil",
  type: "document",
  icon: HomeIcon,
  __experimental_omnisearch_visibility: false,
  fields: [
    defineField({
      name: "language",
      type: "string",
      readOnly: true,
      hidden: true,
    }),
    defineField({
      name: "pageModules",
      title: "Blocs de la page",
      type: "array",
      of: pageModuleRefs,
      description:
        "Les sections de la page d'accueil, dans l'ordre. Ajoutez, réorganisez ou masquez des blocs.",
    }),
  ],
  preview: {
    select: { language: "language", count: "pageModules.length" },
    prepare: ({ language, count }) => ({
      title: "Accueil",
      subtitle: `${language ? String(language).toUpperCase() : ""}${
        count ? ` · ${count} bloc${count > 1 ? "s" : ""}` : ""
      }`,
    }),
  },
});
