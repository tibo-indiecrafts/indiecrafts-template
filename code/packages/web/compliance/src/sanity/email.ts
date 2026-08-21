import { ownerAlertGroup } from "@indiecrafts/packages-web-email/sanity";

/**
 * The compliance surface's transactional-email group on the shared `emailStrings`
 * singleton — the alert to the team when a visitor sends a GDPR data-subject
 * request. Contributed via `complianceSanity.emailGroups`; read as
 * `getEmailStrings()?.dataRequestOwner`. Set the DPO / controller inbox as the
 * "To" here (Studio → E-mails).
 */
export const emailGroups = [
  ownerAlertGroup({
    name: "dataRequestOwner",
    title: "RGPD — nouvelle demande (alerte à l'équipe)",
    description:
      "E-mail à chaque demande d'exercice de droits (accès, effacement…). Interne — objet non traduit. Mettez l'adresse du responsable / DPO en destinataire.",
    enabledHint:
      "Vide/décoché = aucun e-mail envoyé (la demande reste visible dans le Studio).",
    toHint:
      "Adresse du responsable de traitement / DPO. Une ou plusieurs adresses.",
    subjectHint:
      "Modèles disponibles : {{type}}, {{email}}. Vide = objet par défaut.",
  }),
];
