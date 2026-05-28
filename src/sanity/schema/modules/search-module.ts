import { defineField } from "sanity";
import { defineModule } from "../objects/define-module";

export default defineModule({
  name: "module.search",
  title: "Recherche",
  fields: [
    defineField({
      name: "title",
      title: "Titre",
      type: "string",
      initialValue: "Rechercher des articles",
    }),
    defineField({
      name: "placeholder",
      title: "Placeholder",
      type: "string",
      initialValue: "Rechercher…",
    }),
    defineField({
      name: "scope",
      title: "Portée",
      type: "string",
      options: {
        list: [{ title: "Articles de blog", value: "post" }],
        layout: "radio",
      },
      initialValue: "post",
      // Masqué tant qu'une deuxième portée n'est pas livrée — un radio à
      // une seule option n'apporte que du bruit visuel. Passez en
      // `hidden: false` une fois le renderer étendu.
      hidden: true,
      description:
        "Articles uniquement pour l'instant. Étendez le renderer SearchModule pour ajouter d'autres portées.",
    }),
  ],
  preview: { prepare: () => ({ title: "Recherche" }) },
});
