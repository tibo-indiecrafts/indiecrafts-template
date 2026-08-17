import { defineArrayMember, defineType } from "sanity";

/**
 * Reusable rich-text field. Referenced as `type: "blockContent"` from
 * post bodies, author bios, accordion items, callout content, etc.
 *
 * Editors can drop any of the 12 INLINE-EMBEDDABLE modules into a block
 * content array directly from the Studio "+" picker, mixed with normal
 * paragraphs and headings. The runtime PortableText renderer
 * (`@indiecrafts/ui-components/web/portable-text-components`) maps each module
 * `_type` to its React component.
 *
 * Modules deliberately excluded from inline embedding:
 *   - `blog-index`, `blog-post-list`, `prose` — page chrome, not content
 *   - `blog-post-content` — would render the post body recursively
 *   - `prose` — body content is already prose, embedding it inside
 *     itself adds nothing
 * Those six are still available via the blog singleton's `postModules`
 * layout slot.
 */
const INLINE_MODULES = [
  "module.callout",
  "module.card-list",
  "module.gallery",
  "module.person-list",
  "module.stat-list",
  "module.step-list",
  "module.quote-list",
  "module.accordion-list",
  "module.custom-html",
  "module.newsletter",
  "module.waitlist",
  "module.lead-magnet",
];

export default defineType({
  title: "Contenu enrichi",
  name: "blockContent",
  type: "array",
  of: [
    defineArrayMember({
      title: "Bloc",
      type: "block",
      styles: [
        { title: "Normal", value: "normal" },
        { title: "H1", value: "h1" },
        { title: "H2", value: "h2" },
        { title: "H3", value: "h3" },
        { title: "H4", value: "h4" },
        { title: "H5", value: "h5" },
        { title: "H6", value: "h6" },
        { title: "Citation", value: "blockquote" },
      ],
      lists: [
        { title: "Puces", value: "bullet" },
        { title: "Numéros", value: "number" },
      ],
      marks: {
        decorators: [
          { title: "Gras", value: "strong" },
          { title: "Italique", value: "em" },
          { title: "Code", value: "code" },
          { title: "Souligné", value: "underline" },
          { title: "Barré", value: "strike-through" },
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
    defineArrayMember({
      type: "object",
      name: "codeBlock",
      title: "Bloc de code",
      fields: [
        {
          name: "language",
          title: "Langage",
          type: "string",
          description: "Ex. « ts », « tsx », « js », « bash », « json », « css », « html ».",
        },
        {
          name: "filename",
          title: "Nom de fichier",
          type: "string",
          description: "Optionnel, affiché en haut du bloc. Ex. « app/page.tsx ».",
        },
        {
          name: "code",
          title: "Code",
          type: "text",
          rows: 8,
          validation: (Rule) => Rule.required(),
        },
      ],
      preview: {
        select: { language: "language", filename: "filename", code: "code" },
        prepare: ({ language, filename, code }) => ({
          title: filename || "Bloc de code",
          subtitle: [language, (code ?? "").split("\n")[0]].filter(Boolean).join(" · "),
        }),
      },
    }),
    // Inline content modules — editors pick from the "+" menu in the
    // body editor. Each refers to the same `defineType` registered via
    // `src/sanity/schema/modules/`.
    ...INLINE_MODULES.map((type) => ({ type })),
  ],
});
