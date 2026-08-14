import { ownerAlertGroup } from "@indiecrafts/email/sanity";

/**
 * The blog's transactional-email group on the shared `emailStrings` singleton —
 * the new-comment alert to the site team (with optional in-email moderation
 * buttons). Contributed via `blogSanity.emailGroups`; read as
 * `getEmailStrings()?.commentNotification`.
 */
export const emailGroups = [
  ownerAlertGroup({
    name: "commentNotification",
    title: "Nouveau commentaire (alerte à l'équipe)",
    description: "E-mail à chaque commentaire à modérer. Interne — objet non traduit.",
    enabledHint: "Vide/décoché = aucun e-mail envoyé.",
    toHint: "Une ou plusieurs adresses — appuie sur Entrée pour en ajouter.",
    subjectHint: "Modèles disponibles : {{author}}, {{post}}. Vide = objet par défaut.",
    replyToHint: "Vide = l'e-mail de l'auteur du commentaire, s'il l'a fourni.",
    moderationButtons: true,
  }),
];
