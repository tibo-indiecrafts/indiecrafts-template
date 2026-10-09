/**
 * Define the waitlist's confirmation and owner-alert email groups on the shared emailStrings singleton.
 *
 * @see docs/reference/modules/web/waitlist/src/sanity/email.md
 */
import {
  confirmationGroup,
  ownerAlertGroup,
} from "@indiecrafts/packages-web-email/sanity";

/**
 * The waitlist's transactional-email groups on the shared `emailStrings`
 * singleton — the "you're on the list" confirmation to the joiner (translated)
 * and the new-entry alert to the team. Contributed via
 * `waitlistSanity.emailGroups`; read as `getEmailStrings()?.waitlistConfirm` /
 * `?.waitlistOwner`.
 */
export const emailGroups = [
  confirmationGroup({
    name: "waitlistConfirm",
    copySupport: true,
    title: "Liste d'attente — confirmation (« vous êtes sur la liste »)",
    description:
      "E-mail de bienvenue envoyé à chaque nouvelle inscription sur la liste d'attente. Textes traduits par langue.",
    enabledHint: "Vide/décoché = aucun e-mail envoyé.",
    subjectHint: "Vide = objet par défaut.",
    introHint: "Le corps du message. Une ligne vide sépare deux paragraphes.",
    outroHint: "Petit texte de bas de message. Vide = masqué.",
  }),
  ownerAlertGroup({
    name: "waitlistOwner",
    title: "Liste d'attente — nouvelle inscription (alerte à l'équipe)",
    description:
      "E-mail à chaque nouvelle inscription. Interne — objet non traduit.",
    enabledHint: "Vide/décoché = aucun e-mail envoyé.",
    toHint: "Une ou plusieurs adresses.",
    subjectHint:
      "Modèles disponibles : {{email}}, {{name}}. Vide = objet par défaut.",
  }),
];
