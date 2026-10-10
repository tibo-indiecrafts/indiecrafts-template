/**
 * Define the featured-posts page-builder module schema.
 *
 * @see docs/reference/modules/web/blog/src/sanity/schema/modules/blog-featured.md
 */
import { StarIcon } from "@sanity/icons/Star";
import { defineField } from "sanity";
import { defineModule } from "@indiecrafts/packages-web-page-builder/sanity/schema/objects/define-module";

export default defineModule({
  name: "module.blog-featured",
  title: "Articles à la une",
  icon: StarIcon,
  description:
    "Un article en grand, suivi d'une sélection. Sur toute page, pour promouvoir le blog.",
  fields: [
    defineField({
      name: "layout",
      title: "Présentation",
      type: "string",
      options: {
        list: [
          { title: "Grande carte + grille", value: "grid" },
          {
            title: "Grande carte + liste (à la une de l'accueil)",
            value: "editorial",
          },
        ],
        layout: "radio",
      },
      initialValue: "grid",
    }),
    defineField({
      name: "eyebrow",
      title: "Surtitre",
      type: "string",
      description: "Petit texte au-dessus du titre. Vide = masqué.",
    }),
    defineField({ name: "title", title: "Titre", type: "string" }),
    defineField({
      name: "intro",
      title: "Introduction",
      type: "text",
      rows: 2,
      description: "Une phrase sous le titre. Vide = masquée.",
    }),
    defineField({
      name: "viewAll",
      title: "Lien « Tous les articles »",
      type: "string",
      description:
        "Texte du lien vers le blog. Ex. « Tous les articles ». Vide = pas de lien.",
    }),
    defineField({
      name: "source",
      title: "Articles affichés",
      type: "string",
      options: {
        list: [
          { title: "Articles marqués « Mis en avant »", value: "flag" },
          { title: "Articles choisis", value: "pinned" },
        ],
        layout: "radio",
      },
      initialValue: "flag",
      description:
        "« Articles marqués » se met à jour automatiquement. « Articles choisis » fige une sélection précise, dans l'ordre choisi ci-dessous.",
    }),
    defineField({
      name: "pinned",
      title: "Articles choisis",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "post" }],
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
      hidden: ({ parent }) => parent?.source !== "pinned",
      description:
        "Les articles affichés quand « Articles choisis » est sélectionné, dans l'ordre d'affichage.",
    }),
    defineField({
      name: "limit",
      title: "Limite",
      type: "number",
      initialValue: 4,
      validation: (Rule) =>
        Rule.min(1)
          .max(20)
          .integer()
          .custom((limit, ctx) =>
            (ctx.parent as { layout?: string } | undefined)?.layout ===
              "editorial" &&
            typeof limit === "number" &&
            limit > 4
              ? "La présentation « liste » affiche 4 articles au plus."
              : true,
          ),
      description: "Nombre maximum d'articles affichés.",
    }),
    defineField({
      name: "leadCard",
      title: "Premier article en grand",
      type: "boolean",
      initialValue: true,
      description:
        "Affiche le premier article en grand format ; les autres dans une grille.",
      hidden: ({ parent }) => parent?.layout === "editorial",
    }),
  ],
});
