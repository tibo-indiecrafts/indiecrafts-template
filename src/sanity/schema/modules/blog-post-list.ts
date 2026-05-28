import { BlockContentIcon } from "@sanity/icons";
import { defineField } from "sanity";
import { defineModule } from "../objects/define-module";

export default defineModule({
  name: "module.blog-post-list",
  title: "Liste d'articles",
  icon: BlockContentIcon,
  fields: [
    defineField({ name: "title", title: "Titre", type: "string" }),
    defineField({ name: "intro", title: "Intro", type: "text", rows: 2 }),
    defineField({
      name: "limit",
      title: "Limite",
      type: "number",
      description: "Nombre maximum d'articles. Laissez vide pour tous les afficher.",
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
          // Filter category picker by parent post's language (when the
          // module sits inside `post.modules`). The blog singleton's
          // module arrays have no language, so any-locale is allowed
          // there — fine because the GROQ list query filters by locale
          // at render time anyway.
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
      description: "N'affiche que les articles d'une de ces catégories. Vide = toutes.",
    }),
    defineField({
      name: "featuredOnly",
      title: "Articles mis en avant uniquement",
      type: "boolean",
      description: "Restreint aux articles marqués `featured` dans le document article.",
      initialValue: false,
    }),
  ],
});
