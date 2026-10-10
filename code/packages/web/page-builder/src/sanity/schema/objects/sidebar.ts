/**
 * Define the sidebar: its card blocks, the per-document override and the per-locale settings.
 *
 * @see docs/reference/packages/web/page-builder/src/sanity/schema/objects/sidebar.md
 */
import {
  defineArrayMember,
  defineField,
  defineType,
  type SchemaTypeDefinition,
} from "sanity";
import { SplitHorizontalIcon } from "@sanity/icons/SplitHorizontal";
import { blockInsertMenu } from "./insert-menu";

/** The generic blocks that fit a sidebar card. The app adds its own (the blog's). */
export const GENERIC_SIDEBAR_TYPES = [
  "module.callout",
  "module.card-list",
  "module.prose",
  "module.quote-list",
  "module.stat-list",
  "module.custom-html",
  "module.newsletter",
  "module.lead-magnet",
  "module.waitlist",
] as const;

/** Most cards one sidebar holds. */
export const SIDEBAR_MAX = 6;

/** A page type the settings configure, e.g. `{ name: "post", title: "Articles" }`. */
export type SidebarPageType = { name: string; title: string };

const MODES = [
  { title: "Hériter du réglage général", value: "inherit" },
  { title: "Cartes personnalisées", value: "custom" },
  { title: "Pas de barre latérale", value: "none" },
];

/**
 * The sidebar schema types:
 * - `sidebarBlocks` — the card list (only `types`, at most `SIDEBAR_MAX`);
 * - `sidebar` — a mode (`inherit` · `custom` · `none`) + its cards, used on a document
 *   (`page`, `post`) and per page type in the settings;
 * - `sidebarSettings` — one document per locale (id `sidebarSettings-<locale>`): the default
 *   cards and one `sidebar` per page type.
 */
export function sidebarSchemas(
  types: readonly string[],
  pageTypes: readonly SidebarPageType[],
): SchemaTypeDefinition[] {
  const sidebarBlocks = defineType({
    name: "sidebarBlocks",
    title: "Cartes",
    type: "array",
    of: types.map((type) => defineArrayMember({ type })),
    options: { insertMenu: blockInsertMenu(types) },
    validation: (Rule) => Rule.max(SIDEBAR_MAX),
  });

  const sidebar = defineType({
    name: "sidebar",
    title: "Barre latérale",
    type: "object",
    icon: SplitHorizontalIcon,
    options: { collapsible: true, collapsed: true },
    fields: [
      defineField({
        name: "mode",
        title: "Barre latérale",
        type: "string",
        options: { list: MODES, layout: "radio" },
        initialValue: "inherit",
      }),
      defineField({
        name: "blocks",
        title: "Cartes",
        type: "sidebarBlocks",
        description: `Dans l'ordre d'affichage, ${SIDEBAR_MAX} au plus. Sur mobile, elles passent sous le contenu.`,
        hidden: ({ parent }) =>
          (parent as { mode?: string } | undefined)?.mode !== "custom",
      }),
    ],
  });

  const sidebarSettings = defineType({
    name: "sidebarSettings",
    title: "Barre latérale",
    type: "document",
    icon: SplitHorizontalIcon,
    fields: [
      defineField({
        name: "default",
        title: "Cartes par défaut",
        type: "sidebarBlocks",
        description:
          "Affichées sur chaque type de page réglé sur « Hériter du réglage général ».",
      }),
      defineField({
        name: "byType",
        title: "Par type de page",
        type: "object",
        fields: pageTypes.map(({ name, title }) =>
          defineField({ name, title, type: "sidebar" }),
        ),
      }),
    ],
    preview: { prepare: () => ({ title: "Barre latérale" }) },
  });

  return [sidebarBlocks, sidebar, sidebarSettings];
}
