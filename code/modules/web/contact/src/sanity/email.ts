import {
  confirmationGroup,
  ownerAlertGroup,
} from "@indiecrafts/packages-web-email/sanity";

/**
 * The contact form's transactional-email groups on the shared `emailStrings`
 * singleton — the "we got your message" confirmation to the sender (translated)
 * and the new-message alert to the team (carries the message body). Contributed
 * via `contactSanity.emailGroups`; read as `getEmailStrings()?.contactConfirm` /
 * `?.contactOwner`.
 */
export const emailGroups = [
  confirmationGroup({
    name: "contactConfirm",
    title: "Contact — accusé de réception (« message bien reçu »)",
    description:
      "E-mail envoyé à la personne qui a rempli le formulaire de contact. Textes traduits par langue.",
    enabledHint: "Vide/décoché = aucun accusé de réception envoyé.",
    subjectHint: "Vide = objet par défaut.",
    introHint: "Le corps du message. Une ligne vide sépare deux paragraphes.",
    outroHint: "Petit texte de bas de message. Vide = masqué.",
  }),
  ownerAlertGroup({
    name: "contactOwner",
    title: "Contact — nouveau message (alerte à l'équipe)",
    description:
      "E-mail à chaque message reçu — contient le message. Interne — objet non traduit.",
    enabledHint: "Vide/décoché = aucune alerte envoyée.",
    toHint: "Une ou plusieurs adresses.",
    subjectHint:
      "Modèles disponibles : {{email}}, {{name}}, {{subject}}. Vide = objet par défaut.",
  }),
];
