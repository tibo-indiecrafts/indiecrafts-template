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
  fields = [],
  preview,
}: {
  name: string;
  title: string;
  icon?: ObjectDefinition["icon"];
  fields?: FieldDefinition[];
  preview?: ObjectDefinition["preview"];
}) {
  return defineType({
    name,
    title,
    type: "object",
    icon,
    fields: [
      ...fields,
      defineField({
        name: "anchor",
        title: "Anchor",
        type: "string",
        description: "Optional id for in-page links (e.g. 'pricing' → /…/#pricing).",
      }),
      defineField({
        name: "hidden",
        title: "Hidden",
        type: "boolean",
        description: "Hide this module without deleting it.",
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
