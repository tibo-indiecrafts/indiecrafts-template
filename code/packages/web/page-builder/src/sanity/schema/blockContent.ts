/**
 * Defines the reusable blockContent rich-text field with inline-embeddable modules.
 *
 * @see docs/reference/packages/web/page-builder/src/sanity/schema/blockContent.md
 */
import { defineArrayMember, defineType } from "sanity";

/**
 * Reusable rich-text field. Referenced as `type: "blockContent"` from
 * post bodies, author bios, accordion items, callout content, etc.
 *
 * Editors can drop any of the 13 INLINE-EMBEDDABLE modules (`INLINE_MODULES`) into a block
 * content array directly from the Studio "+" picker, mixed with normal
 * paragraphs and headings. The runtime PortableText renderer
 * (`@indiecrafts/packages-web-ui-components/web/portable-text-components`, `INLINE_TYPES`) maps
 * each module `_type` to its React component; a test keeps the two lists equal.
 *
 * Not insertable inline (section-only): `hero`, `feature-grid`, `pricing` (page chrome),
 * `prose` (the body is already prose) and every `blog-*` block (`blog-post-content` would
 * render the post body inside itself).
 */
export const INLINE_MODULES = [
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
  "module.contact",
];

type Block = { _type?: string; style?: string; children?: { text?: string }[] };

/**
 * The first heading that skips a level (H2 → H4), or `null`. Screen readers and
 * search engines read headings as an outline, so a gap reads as a missing
 * section. The first heading may start at any level.
 */
export function headingSkip(blocks: Block[] = []): string | null {
  let previous = 0;
  for (const block of blocks) {
    const level =
      block._type === "block"
        ? /^h([1-6])$/.exec(block.style ?? "")?.[1]
        : undefined;
    if (!level) continue;
    if (previous && Number(level) > previous + 1) {
      const text = (block.children ?? [])
        .map((c) => c.text ?? "")
        .join("")
        .trim();
      return `« ${text || "Titre"} » passe de H${previous} à H${level}. Utilisez H${previous + 1}, sinon le plan de la page saute un niveau.`;
    }
    previous = Number(level);
  }
  return null;
}

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
            title: "Lien",
            name: "link",
            type: "object",
            fields: [{ title: "Adresse du lien", name: "href", type: "url" }],
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
          description:
            "Ex. « ts », « tsx », « js », « bash », « json », « css », « html ».",
        },
        {
          name: "filename",
          title: "Nom de fichier",
          type: "string",
          description:
            "Optionnel, affiché en haut du bloc. Ex. « app/page.tsx ».",
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
          subtitle: [language, (code ?? "").split("\n")[0]]
            .filter(Boolean)
            .join(" · "),
        }),
      },
    }),
    // Inline content modules — editors pick from the "+" menu in the
    // body editor. Each refers to the same `defineType` registered via
    // `src/sanity/schema/modules/`.
    ...INLINE_MODULES.map((type) => ({ type })),
  ],
  // A warning, not an error: it flags the gap without blocking a publish.
  validation: (Rule) =>
    Rule.custom((blocks?: Block[]) => headingSkip(blocks) ?? true).warning(),
});
