import { defineField, defineType } from "sanity";

/**
 * Polymorphic link used inside blog modules — points to an internal
 * post or an external URL. Renderers normalize the resolved href via
 * the LINK_FRAGMENT in `src/sanity/queries.ts`.
 *
 * Scoped to the blog: internal target is a `post` document only.
 * Use the external URL field for marketing pages / other sites.
 */
export default defineType({
  name: "link",
  title: "Link",
  type: "object",
  fields: [
    defineField({
      name: "type",
      title: "Type",
      type: "string",
      options: {
        list: [
          { title: "Internal post", value: "internal" },
          { title: "External URL", value: "external" },
        ],
        layout: "radio",
      },
      initialValue: "internal",
    }),
    defineField({
      name: "label",
      title: "Label",
      type: "string",
    }),
    defineField({
      name: "internal",
      title: "Internal post",
      type: "reference",
      to: [{ type: "post" }],
      hidden: ({ parent }) => parent?.type !== "internal",
    }),
    defineField({
      name: "external",
      title: "External URL",
      type: "url",
      hidden: ({ parent }) => parent?.type !== "external",
      validation: (Rule) => Rule.uri({ scheme: ["http", "https", "mailto", "tel"] }),
    }),
    defineField({
      name: "newTab",
      title: "Open in new tab",
      type: "boolean",
      initialValue: false,
    }),
  ],
});
