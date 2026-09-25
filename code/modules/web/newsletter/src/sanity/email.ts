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
 * the new-subscriber alert to the team. Contributed via
 * `newsletterSanity.emailGroups`; read as `getEmailStrings()?.newsletterConfirm`
 * / `?.newsletterOwner`.
 */
export const emailGroups = [
  confirmationGroup({
    name: "newsletterConfirm",
    title: "Infolettre — confirmation (double opt-in)",
    description:
      "E-mail envoyé à chaque nouvel abonné avec un lien de confirmation. Le clic valide l'inscription. Textes traduits par langue.",
    enabledHint: "Vide/décoché = aucun e-mail ; l'abonné reste « En attente ».",
    subjectHint: "Modèle disponible : {{email}}. Vide = objet par défaut.",
    introHint:
      "Le message au-dessus du bouton. Une ligne vide sépare deux paragraphes.",
    outroHint:
      "Petit texte sous le bouton (ex. « Vous n'avez pas demandé ceci ? Ignorez cet e-mail. »). Vide = masqué.",
    button: true,
  }),
  ownerAlertGroup({
    name: "newsletterOwner",
    title: "Infolettre — nouvel abonné (alerte à l'équipe)",
    description:
      "E-mail à chaque nouvelle inscription. Interne — traductions facultatives (envoyé dans la langue par défaut).",
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
      "Informatif — la livraison dépend du document + de LEAD_MAGNET_SECRET, pas de cette case. Vide sur les textes = valeurs par défaut.",
    subjectHint: "Vide = objet par défaut.",
    introHint:
      "Message au-dessus du bouton. Modèle {{title}} = le titre du document. Vide = texte par défaut.",
    outroHint: "Petit texte sous le bouton. Vide = masqué.",
    button: true,
  }),
];
