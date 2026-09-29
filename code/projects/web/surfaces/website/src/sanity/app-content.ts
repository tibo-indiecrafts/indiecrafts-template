/**
 * Define the app-content singleton holding the signed-in welcome message.
 *
 * @see docs/reference/projects/web/website/src/sanity/app-content.md
 */

import { defineField, defineType } from "sanity";
import type { ListItemBuilder, StructureBuilder } from "sanity/structure";
import { HomeIcon } from "@sanity/icons/Home";

/**
 * Contenu de l'app (singleton) — the editor-owned welcome message shown at the top of
 * the `app` home screen (also inside the Capacitor shell). Two sections: `shared` and
 * `web`. Read live (short-cached), so an edit appears without a redeploy. Each
 * `welcome` is `localeText` (a line per language), like the rest of Sanity copy.
 */

const welcomeSection = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: "object",
    fields: [
      defineField({
        name: "welcome",
        title: "Message de bienvenue",
        type: "localeText",
        description:
          "Le message affiché en haut de l'écran d'accueil. Une ligne par langue. Vide = aucun message affiché.",
      }),
    ],
  });

export const appContentSchema = defineType({
  name: "appContent",
  title: "Contenu de l'app",
  type: "document",
  icon: HomeIcon,
  __experimental_omnisearch_visibility: false,
  fields: [
    welcomeSection("shared", "Commun (toutes les surfaces)"),
    welcomeSection("web", "App web"),
  ],
  initialValue: {
    shared: {
      welcome: {
        en: "Welcome — glad you're here.",
        fr: "Bienvenue — ravis de vous voir.",
      },
    },
    web: {
      welcome: {
        en: "Welcome to your Indiecrafts space.",
        fr: "Bienvenue dans votre espace Indiecrafts.",
      },
    },
  },
  preview: {
    prepare: () => ({
      title: "Contenu de l'app",
      subtitle: "Message de bienvenue — application",
    }),
  },
});

/** "Contenu de l'app" desk item — the editable `appContent` singleton. */
export function appContentStructureItem(S: StructureBuilder): ListItemBuilder {
  return S.listItem()
    .title("Contenu de l'app")
    .icon(HomeIcon)
    .child(S.editor().id("appContent").schemaType("appContent").documentId("appContent"));
}
