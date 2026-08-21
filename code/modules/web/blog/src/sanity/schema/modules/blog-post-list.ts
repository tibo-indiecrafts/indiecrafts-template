import { BlockContentIcon } from "@sanity/icons";
import { defineField } from "sanity";
import { defineModule } from "@indiecrafts/packages-web-page-builder/sanity/schema/objects/define-module";

export default defineModule({
  name: "module.blog-post-list",
  title: "Articles",
  icon: BlockContentIcon,
  fields: [
    defineField({ name: "title", title: "Titre", type: "string" }),
    defineField({ name: "intro", title: "Intro", type: "text", rows: 2 }),
    defineField({
      name: "limit",
      title: "Limite",
      type: "number",
      description:
        "Nombre maximum d'articles. Laissez vide pour tous les afficher.",
      validation: (Rule) => Rule.min(1).max(100),
    }),
    defineField({
      name: "categories",
      title: "Filtrer par catégories",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "category" }],
          // The blog singleton's module arrays have no language, so any
          // locale is allowed in the picker here — fine because the
          // GROQ list query filters posts by `$locale` at render time.
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
      description:
        "N'affiche que les articles d'une de ces catégories. Vide = toutes.",
    }),
    defineField({
      name: "featuredOnly",
      title: "Articles mis en avant uniquement",
      type: "boolean",
      description:
        "Restreint aux articles marqués `featured` dans le document article.",
      initialValue: false,
    }),
  ],
});
