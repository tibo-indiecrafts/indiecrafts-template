/**
 * Group the page-builder blocks in the Studio "Add item" picker.
 *
 * @see docs/reference/packages/web/page-builder/src/sanity/schema/objects/insert-menu.md
 */

/** The picker groups of the generic blocks, in menu order. */
const GROUPS = [
  {
    name: "layout",
    title: "Mise en page",
    of: [
      "module.hero",
      "module.feature-grid",
      "module.pricing",
      "module.stat-list",
      "module.step-list",
    ],
  },
  {
    name: "content",
    title: "Contenu",
    of: [
      "module.prose",
      "module.callout",
      "module.card-list",
      "module.accordion-list",
      "module.quote-list",
      "module.person-list",
      "module.custom-html",
    ],
  },
  { name: "media", title: "Médias", of: ["module.gallery"] },
  {
    name: "forms",
    title: "Formulaires",
    of: [
      "module.newsletter",
      "module.waitlist",
      "module.lead-magnet",
      "module.contact",
    ],
  },
];

/**
 * `options.insertMenu` for a block array: the generic groups, then "Blog" for the
 * `module.blog-*` blocks, then "Autres" for anything else. Each group lists only the types
 * the array accepts; an empty group is dropped. A list view (icon + title + description).
 */
export function blockInsertMenu(types: readonly string[]) {
  const accepted = new Set(types);
  const grouped = new Set(GROUPS.flatMap((g) => g.of));
  const blog = types.filter((t) => t.startsWith("module.blog-"));
  const other = types.filter(
    (t) => !grouped.has(t) && !t.startsWith("module.blog-"),
  );
  const groups = [
    ...GROUPS.map((g) => ({ ...g, of: g.of.filter((t) => accepted.has(t)) })),
    { name: "blog", title: "Blog", of: blog },
    { name: "other", title: "Autres", of: other },
  ].filter((g) => g.of.length > 0);
  return {
    groups,
    views: [{ name: "list" as const }],
    filter: types.length > 8,
  };
}
