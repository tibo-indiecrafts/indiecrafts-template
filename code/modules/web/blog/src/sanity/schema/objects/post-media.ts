import { defineField, defineType } from "sanity";

/**
 * A post's content-side essentials that are NOT SEO: the canonical `slug` and
 * the cover **image or video** (hero + card + social poster). SEO/LLMs fields
 * live on the shared `.seo` (`seoMeta`) instead — this object holds only what
 * the post itself needs to route + illustrate.
 *
 * The cover `image` doubles as the Open Graph / social card by default; set
 * `seo.image` to override it with a distinct share image.
 */
export default defineType({
  name: "postMedia",
  title: "Contenu de l'article (adresse + visuel)",
  type: "object",
  fields: [
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "Chemin d'URL. Minuscules, tirets uniquement.",
      options: {
        source: (doc) => (doc as { title?: string }).title ?? "",
        maxLength: 96,
        // `exclude` : une traduction d'article démarre avec un slug vide,
        // pas une copie du slug source — chaque locale a sa propre URL.
        documentInternationalization: { exclude: true },
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "image",
      title: "Image à la une",
      type: "image",
      description:
        "1200×630 recommandé. Couverture affichée dans le héros et les listings, et image de partage par défaut (sauf si une image de partage propre est renseignée dans « SEO & visibilité »).",
      options: { hotspot: true, metadata: ["lqip"] },
      fields: [
        defineField({ name: "alt", type: "string", title: "Texte alternatif" }),
      ],
    }),
    defineField({
      name: "videoUrl",
      title: "Vidéo à la une (lien)",
      type: "url",
      description:
        "Lien YouTube, Vimeo ou Dailymotion. Si renseigné, le héros de l'article lit cette vidéo à la place de l'image — l'« Image à la une » ci-dessus sert alors d'aperçu (poster). Collez le lien, pas un code d'intégration. Pour votre propre fichier, utilisez le champ ci-dessous. Vide = pas de vidéo.",
      validation: (Rule) =>
        Rule.uri({ scheme: ["http", "https"] }).warning(
          "Utilisez un lien http(s) YouTube, Vimeo ou Dailymotion.",
        ),
    }),
    defineField({
      name: "videoFile",
      title: "Vidéo à la une (votre fichier)",
      type: "file",
      options: { accept: "video/mp4,video/webm" },
      description:
        "Téléversez votre propre vidéo (.mp4 ou .webm). Elle a priorité sur le lien ci-dessus et joue le même rôle : elle remplace l'image dans le héros, avec l'« Image à la une » en aperçu. Vide = utilise le lien, sinon l'image.",
    }),
    defineField({
      name: "videoAutoplay",
      title: "Lecture automatique",
      type: "boolean",
      initialValue: false,
      description:
        "La vidéo démarre seule, sans son et en boucle, comme une ambiance de fond (le son ne peut pas démarrer tout seul dans un navigateur). Désactivé = un bouton « lecture » s'affiche sur l'aperçu.",
    }),
    defineField({
      name: "videoControls",
      title: "Afficher les commandes du lecteur",
      type: "boolean",
      initialValue: true,
      description:
        "Affiche les boutons de lecture, de son et de plein écran. Désactivez-le pour une vidéo d'ambiance nette, sans commandes.",
    }),
  ],
});
