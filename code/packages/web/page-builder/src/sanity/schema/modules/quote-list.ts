/**
 * Define the quote-list module — a titled list of referenced quotes.
 *
 * @see docs/reference/packages/web/page-builder/src/sanity/schema/modules/quote-list.md
 */
import { BlockquoteIcon } from "@sanity/icons/Blockquote";
import { defineField } from "sanity";
import { defineModule } from "../objects/define-module";

export default defineModule({
  name: "module.quote-list",
  title: "Citations",
  icon: BlockquoteIcon,
  description: "Des témoignages choisis.",
  fields: [
    defineField({ name: "title", title: "Titre", type: "string" }),
    defineField({
      name: "quotes",
      title: "Citations",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "quote" }],
          // Filter quotes by the parent document's language when present
          // (post.language). For language-neutral parents (the `blog`
          // singleton) the filter is empty — editors picking quotes from
          // a global layout can choose any locale.
          options: {
            filter: ({ document }) =>
              document.language
                ? {
                    filter: "language == $lang",
                    params: { lang: document.language as string },
                  }
                : { filter: "" },
          },
        },
      ],
      validation: (Rule) => Rule.min(1),
    }),
  ],
});
