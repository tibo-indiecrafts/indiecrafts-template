import {
  defineField,
  defineType,
  type FieldDefinition,
  type ObjectDefinition,
} from "sanity";

/**
 * Helper for declaring a page-builder module schema.
 *
 * Every module gets:
 *   - `_type` — Sanity-provided discriminator
 *   - `_key` — Sanity-provided array key
 *   - `anchor` — optional id for in-page links (#features)
 *   - `hidden` — soft-disable from the canvas without deleting
 *
 * Pass `fields` for the module's own data; `preview` overrides the
 * generated default (which reads the module's `title` field).
 *
 * Adapted from sanitypress-with-typegen's `defineModule` pattern.
 */
export function defineModule({
  name,
  title,
  icon,
  description,
  fields = [],
  preview,
}: {
  name: string;
  title: string;
  icon?: ObjectDefinition["icon"];
  /** Shown under the module in the Studio picker — helps editors choose. */
  description?: string;
  fields?: FieldDefinition[];
  preview?: ObjectDefinition["preview"];
}) {
  return defineType({
    name,
    title,
    type: "object",
    icon,
    description,
    fields: [
      ...fields,
      defineField({
        name: "anchor",
        title: "Ancre",
        type: "string",
        description:
          "Identifiant optionnel pour les liens internes à la page (ex. 'pricing' → /…/#pricing).",
      }),
      defineField({
        name: "hidden",
        title: "Masqué",
        type: "boolean",
        description: "Masque ce module sans le supprimer.",
        initialValue: false,
      }),
    ],
    preview: preview ?? {
      select: { title: "title" },
      prepare: ({ title }: { title?: string }) => ({
        title: title ?? `(${name})`,
        subtitle: name,
      }),
    },
  });
}
