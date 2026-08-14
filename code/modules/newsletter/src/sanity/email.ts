import { confirmationGroup, ownerAlertGroup } from "@indiecrafts/email/sanity";

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
    introHint: "Le message au-dessus du bouton. Une ligne vide sépare deux paragraphes.",
    outroHint:
      "Petit texte sous le bouton (ex. « Vous n'avez pas demandé ceci ? Ignorez cet e-mail. »). Vide = masqué.",
    button: true,
  }),
  ownerAlertGroup({
    name: "newsletterOwner",
    title: "Infolettre — nouvel abonné (alerte à l'équipe)",
    description: "E-mail à chaque nouvelle inscription. Interne — objet non traduit.",
    enabledHint: "Vide/décoché = aucun e-mail envoyé.",
    toHint: "Une ou plusieurs adresses.",
    subjectHint: "Modèle disponible : {{email}}. Vide = objet par défaut.",
  }),
];
