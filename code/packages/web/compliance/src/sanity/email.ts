import {
  confirmationGroup,
  ownerAlertGroup,
} from "@indiecrafts/packages-web-email/sanity";

/**
 * The compliance surface's transactional-email groups on the shared
 * `emailStrings` singleton:
 *
 * - `dataRequestOwner` — the alert to the team when a visitor sends a GDPR
 *   data-subject request. Read as `getEmailStrings()?.dataRequestOwner`.
 * - `erasureToken` / `erasureComplete` — the api worker's two erasure emails
 *   (token-confirmation + completion). The worker has no locale signal for
 *   this flow, so only the default-locale copy is used; empty fields fall
 *   back to the worker's built-in English copy.
 *
 * Contributed via `complianceSanity.emailGroups`. Set the DPO / controller
 * inbox as the "To" on `dataRequestOwner` here (Studio → E-mails).
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
  confirmationGroup({
    name: "erasureToken",
    title: "RGPD — lien de confirmation d'effacement",
    description:
      "E-mail envoyé par le worker API pour confirmer une demande d'effacement de compte. Seule la version dans la langue par défaut est utilisée aujourd'hui (le parcours n'a pas de signal de langue). Champs vides = texte anglais intégré au worker.",
    enabledHint:
      "Informatif — l'envoi est obligatoire pour confirmer la demande d'effacement, indépendamment de cette case.",
    subjectHint: "Vide = objet par défaut (anglais).",
    introHint:
      "Le message au-dessus du bouton de confirmation. Vide = texte anglais intégré.",
    outroHint:
      "Petit texte sous le bouton (ex. délai d'expiration du lien). Vide = texte anglais intégré.",
    button: true,
  }),
  confirmationGroup({
    name: "erasureComplete",
    title: "RGPD — effacement terminé",
    description:
      "E-mail envoyé par le worker API une fois l'effacement terminé. Seule la version dans la langue par défaut est utilisée aujourd'hui (le parcours n'a pas de signal de langue). Champs vides = texte anglais intégré au worker.",
    enabledHint:
      "Informatif — l'envoi est obligatoire pour clore la demande d'effacement, indépendamment de cette case.",
    subjectHint: "Vide = objet par défaut (anglais).",
    introHint:
      "Le message confirmant l'effacement. Vide = texte anglais intégré.",
    outroHint:
      "Texte de fin optionnel (ex. détail des données conservées). Vide = texte anglais intégré.",
  }),
];
