import { defineField, defineType } from "sanity";

/**
 * Définition de formulaire utilisée par le module Formulaire. Le schéma
 * décrit la forme ; le rendu est géré par Netlify Forms (voir
 * `public/__forms.html`). Pour chaque formulaire créé ici, ajoutez une
 * déclaration `<form>` correspondante dans `public/__forms.html` afin
 * que le scanner de Netlify la détecte au moment du build.
 */
export default defineType({
  name: "form",
  title: "Formulaire",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Nom du formulaire",
      type: "string",
      description:
        "Doit correspondre à l'attribut `name` dans public/__forms.html (ex. 'contact', 'newsletter').",
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "title", title: "Titre affiché", type: "string" }),
    defineField({ name: "intro", title: "Intro", type: "text", rows: 2 }),
    defineField({
      name: "submitLabel",
      title: "Libellé du bouton d'envoi",
      type: "string",
      initialValue: "Envoyer",
    }),
    defineField({
      name: "fields",
      title: "Champs",
      type: "array",
      of: [
        {
          type: "object",
          name: "field",
          fields: [
            defineField({ name: "name", title: "Nom", type: "string" }),
            defineField({ name: "label", title: "Libellé", type: "string" }),
            defineField({
              name: "type",
              title: "Type",
              type: "string",
              options: {
                list: [
                  { title: "Texte", value: "text" },
                  { title: "Email", value: "email" },
                  { title: "Zone de texte", value: "textarea" },
                  { title: "Téléphone", value: "tel" },
                  { title: "URL", value: "url" },
                ],
              },
              initialValue: "text",
            }),
            defineField({ name: "required", title: "Obligatoire", type: "boolean" }),
          ],
          preview: { select: { title: "label", subtitle: "type" } },
        },
      ],
    }),
  ],
  preview: { select: { title: "title", subtitle: "name" } },
});
