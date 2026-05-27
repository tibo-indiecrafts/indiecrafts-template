import { defineArrayMember, defineType } from "sanity";

/**
 * Reusable rich-text field. Referenced as `type: "blockContent"` from
 * post bodies, author bios, accordion items, callout content, etc.
 *
 * Editors can drop any of the 11 INLINE-EMBEDDABLE modules into a block
 * content array directly from the Studio "+" picker, mixed with normal
 * paragraphs and headings. The runtime PortableText renderer
 * (`@/components/blog-components/modules/portable-text-components`) maps
 * each module `_type` to its React component.
 *
 * Modules deliberately excluded from inline embedding:
 *   - `breadcrumbs`, `blog-index`, `blog-post-list`, `search` — page
 *     chrome, not content
 *   - `blog-post-content` — would render the post body recursively
 *   - `prose` — body content is already prose, embedding it inside
 *     itself adds nothing
 * Those six are still available via the layout slots `post.modules` and
 * `blog.{front,post}Modules`.
 */
const INLINE_MODULES = [
  "module.callout",
  "module.card-list",
  "module.hero-split",
  "module.logo-list",
  "module.person-list",
  "module.stat-list",
  "module.step-list",
  "module.quote-list",
  "module.accordion-list",
  "module.form",
  "module.custom-html",
];

export default defineType({
  title: "Block Content",
  name: "blockContent",
  type: "array",
  of: [
    defineArrayMember({
      title: "Block",
      type: "block",
      styles: [
        { title: "Normal", value: "normal" },
        { title: "H1", value: "h1" },
        { title: "H2", value: "h2" },
        { title: "H3", value: "h3" },
        { title: "H4", value: "h4" },
        { title: "Quote", value: "blockquote" },
      ],
      lists: [{ title: "Bullet", value: "bullet" }],
      marks: {
        decorators: [
          { title: "Strong", value: "strong" },
          { title: "Emphasis", value: "em" },
        ],
        annotations: [
          {
            title: "URL",
            name: "link",
            type: "object",
            fields: [{ title: "URL", name: "href", type: "url" }],
          },
        ],
      },
    }),
    defineArrayMember({
      type: "image",
      options: { hotspot: true },
    }),
    // Inline content modules — editors pick from the "+" menu in the
    // body editor. Each refers to the same `defineType` registered via
    // `src/sanity/schema/modules/`.
    ...INLINE_MODULES.map((type) => ({ type })),
  ],
});
