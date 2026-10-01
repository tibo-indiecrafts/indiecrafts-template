/**
 * Define the compliance surface's transactional-email groups.
 *
 * @see docs/reference/packages/web/compliance/src/sanity/email.md
 */

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
 * - `dataRequestReceipt` / `dataRequestClosed` — the api worker's two emails to the
 *   requester (receipt on submit; the operator's closing note), in the request's locale.
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
    addressFields: false,
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
    addressFields: false,
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
  confirmationGroup({
    name: "dataRequestReceipt",
    addressFields: false,
    title: "RGPD — accusé de réception (au demandeur)",
    description:
      "E-mail envoyé par le worker API au demandeur dès que sa demande est enregistrée, dans sa langue. Modèles : {{id}} (référence), {{right}} (le droit), {{due}} (date limite de réponse). Champs vides = texte intégré (anglais / français).",
    enabledHint: "Décoché = aucun accusé de réception envoyé.",
    subjectHint: "Vide = « Nous avons bien reçu votre demande (n° {{id}}) ».",
    introHint:
      "Vide = rappel du droit, de la référence et de la date limite de réponse.",
    outroHint:
      "Vide = « Si vous n'êtes pas à l'origine de cette demande, ignorez cet e-mail. »",
  }),
  confirmationGroup({
    name: "dataRequestClosed",
    addressFields: false,
    title: "RGPD — demande clôturée (au demandeur)",
    description:
      "E-mail envoyé quand l'équipe marque une demande traitée ou refusée depuis l'admin, dans la langue du demandeur. Le corps est la réponse de l'opérateur. Modèles : {{id}}, {{outcome}} (« est traitée » / « a été refusée »). Champs vides = texte intégré.",
    enabledHint:
      "Décoché = aucun e-mail de clôture, même si l'opérateur coche « envoyer ».",
    subjectHint: "Vide = « Votre demande n° {{id}} {{outcome}} ».",
    introHint: "Texte optionnel placé avant la réponse de l'opérateur.",
    outroHint: "Vide = « Référence n° {{id}}. »",
  }),
];
