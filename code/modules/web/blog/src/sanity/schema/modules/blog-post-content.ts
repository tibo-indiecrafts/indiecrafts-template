import { DocumentTextIcon } from "@sanity/icons";
import { defineModule } from "@indiecrafts/page-builder/sanity/schema/objects/define-module";

/**
 * Rendu de l'en-tête (titre, auteur, date, couverture) + corps
 * (`blockContent`) de l'article actif. À placer une seule fois dans
 * `blog.postModules` — le renderer récupère l'article courant via le
 * contexte de route.
 */
export default defineModule({
  name: "module.blog-post-content",
  title: "Contenu d'article",
  icon: DocumentTextIcon,
  fields: [],
  preview: { prepare: () => ({ title: "Contenu d'article (article actif)" }) },
});
