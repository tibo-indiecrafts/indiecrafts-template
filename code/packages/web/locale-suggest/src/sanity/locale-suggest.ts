import { defineField, defineType } from "sanity";
import { TranslateIcon } from "@sanity/icons";

/**
 * Language-suggestion copy — a single, language-independent singleton
 * (`_id: localeSuggest`) holding the text for the "this site is available in {your
 * language}" banner. SOLE runtime source (no fallback) — read by `getLocaleSuggest`
 * (`./reader`). `{language}` is replaced with the target language's native name.
 */
export default defineType({
  name: "localeSuggest",
  title: "Suggestion de langue",
  type: "document",
  icon: TranslateIcon,
  __experimental_omnisearch_visibility: false,
  fields: [
    defineField({
      name: "message",
      title: "Message",
      type: "localeString",
      description:
        "La phrase de suggestion. Écrivez {language} là où le nom de la langue doit apparaître. Ex. « Ce site est aussi disponible en {language}. »",
    }),
    defineField({
      name: "switchLabel",
      title: "Bouton « changer de langue »",
      type: "localeString",
      description: "Ex. « Passer en {language} » ou « Changer ».",
    }),
    defineField({
      name: "dismissLabel",
      title: "Bouton « rester »",
      type: "localeString",
      description: "Ex. « Non merci » ou « Rester ».",
    }),
  ],
  preview: { prepare: () => ({ title: "Suggestion de langue" }) },
});
