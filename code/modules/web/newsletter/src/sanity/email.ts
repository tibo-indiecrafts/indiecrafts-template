/**
 * Defines the newsletter transactional-email groups on the shared emailStrings singleton.
 *
 * @see docs/reference/modules/web/newsletter/src/sanity/email.md
 */
import {
  confirmationGroup,
  ownerAlertGroup,
} from "@indiecrafts/packages-web-email/sanity";

/**
 * The newsletter's transactional-email groups on the shared `emailStrings`
 * singleton — the double opt-in confirmation to the subscriber (translated) and
 * the confirmed-subscriber alert to the team. Contributed via
 * `newsletterSanity.emailGroups`; read as `getEmailStrings()?.newsletterConfirm`
 * / `?.newsletterOwner`.
 */
export const emailGroups = [
  confirmationGroup({
    name: "newsletterConfirm",
    title: "Infolettre — confirmation (double opt-in)",
    description:
      "E-mail envoyé à chaque inscription avec un lien de confirmation. Le clic inscrit la personne dans Resend (la liste). Textes traduits par langue.",
    enabledHint:
      "Obligatoire : décoché ou sans expéditeur, le formulaire d'inscription répond par une erreur (personne ne peut s'inscrire).",
    subjectHint: "Modèle disponible : {{email}}. Vide = objet par défaut.",
    introHint:
      "Le message au-dessus du bouton. Une ligne vide sépare deux paragraphes.",
    outroHint:
      "Petit texte sous le bouton (ex. « Vous n'avez pas demandé ceci ? Ignorez cet e-mail. »). Vide = masqué.",
    button: true,
  }),
  confirmationGroup({
    name: "leadMagnetConfirm",
    title: "Infolettre — confirmation d'une demande de document",
    description:
      "E-mail envoyé quand quelqu'un demande un document (aimant à prospects) : le lien de confirmation envoie le document, sans inscrire à l'infolettre. Expéditeur et activation : ceux de la confirmation de l'infolettre.",
    enabledHint:
      "Informatif — l'envoi suit la case de la confirmation de l'infolettre. Vide sur les textes = valeurs par défaut.",
    subjectHint: "Vide = « Confirmez votre demande ».",
    introHint:
      "Le message au-dessus du bouton. Dites que la personne recevra le document, sans être inscrite à l'infolettre.",
    outroHint:
      "Petit texte sous le bouton. Vide = celui de la confirmation de l'infolettre.",
    button: true,
    addressFields: false,
  }),
  ownerAlertGroup({
    name: "newsletterOwner",
    title: "Infolettre — nouvel abonné (alerte à l'équipe)",
    description:
      "E-mail à chaque inscription confirmée. Interne — traductions facultatives (envoyé dans la langue par défaut).",
    enabledHint: "Vide/décoché = aucun e-mail envoyé.",
    toHint: "Une ou plusieurs adresses.",
    subjectHint: "Modèle disponible : {{email}}. Vide = objet par défaut.",
  }),
  confirmationGroup({
    name: "leadMagnet",
    title: "Infolettre — livraison du document (lead magnet)",
    description:
      "E-mail envoyé après confirmation, avec le lien de téléchargement du document promis. Textes traduits par langue.",
    enabledHint:
      "Informatif — la livraison dépend du document + de NEWSLETTER_SECRET, pas de cette case. Vide sur les textes = valeurs par défaut.",
    subjectHint: "Vide = objet par défaut.",
    introHint:
      "Message au-dessus du bouton. Modèle {{title}} = le titre du document. Vide = texte par défaut.",
    outroHint: "Petit texte sous le bouton. Vide = masqué.",
    button: true,
  }),
];
