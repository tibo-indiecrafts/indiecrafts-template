import type { FieldDefinition } from "sanity";
import { confirmationGroup } from "./groups";

/**
 * The Clerk **auth emails'** editable copy — the `emailStrings` groups the API worker's
 * `emails.created` take-over reads (`code/shared/api/src/clerk-email`): the verification
 * code, the password-reset code, the magic-link sign-in, and the new-device security
 * email. Contributed to the singleton via
 * `emailSanity([...modules, { emailGroups: authEmailGroups }])`.
 *
 * Empty fields fall back, per field, to the English/French copy hardcoded in the worker
 * (`clerk-email/templates.ts`), so the emails never break if Sanity is unset. Unlike the
 * erasure emails, these DO have a locale signal — the RECIPIENT's stored locale
 * (`user_profiles.locale`) picks the language. The OTP code / magic-link URL / device
 * details are inserted by the worker; only the surrounding copy is editable here.
 */
export const authEmailGroups: FieldDefinition[] = [
  confirmationGroup({
    name: "authVerification",
    heading: false,
    addressFields: false,
    title: "Authentification — code de vérification",
    description:
      "E-mail contenant le code de connexion à usage unique. Le code est inséré automatiquement. Envoyé dans la langue du destinataire ; champs vides = texte intégré au worker.",
    enabledHint:
      "Informatif — l'envoi est déclenché par Clerk ; cette case ne bloque pas l'e-mail. Décochée = on ignore la copie personnalisée ci-dessous (texte intégré).",
    subjectHint:
      "Objet de l'e-mail. Vide = « Your verification code » / « Votre code de vérification ».",
    introHint:
      "La phrase affichée au-dessus du code. Vide = « Your verification code is: » / « Votre code de vérification est : ».",
    outroHint: "Petit texte optionnel sous le code. Vide = aucun.",
  }),
  confirmationGroup({
    name: "authResetPassword",
    heading: false,
    addressFields: false,
    title: "Authentification — réinitialisation du mot de passe",
    description:
      "E-mail contenant le code de réinitialisation du mot de passe. Le code est inséré automatiquement. Champs vides = texte intégré au worker.",
    enabledHint:
      "Informatif — décochée = on ignore la copie personnalisée (texte intégré).",
    subjectHint:
      "Vide = « Reset your password » / « Réinitialiser votre mot de passe ».",
    introHint:
      "La phrase au-dessus du code. Vide = « Your password reset code is: » / « Votre code de réinitialisation est : ».",
    outroHint: "Petit texte optionnel sous le code. Vide = aucun.",
  }),
  confirmationGroup({
    name: "authMagicLink",
    heading: false,
    addressFields: false,
    title: "Authentification — lien magique de connexion",
    description:
      "E-mail avec le bouton de connexion (lien magique). Le lien est inséré automatiquement dans le bouton. Champs vides = texte intégré au worker.",
    enabledHint:
      "Informatif — décochée = on ignore la copie personnalisée (texte intégré).",
    subjectHint:
      "Vide = « Sign in to your account » / « Connectez-vous à votre compte ».",
    introHint:
      "La phrase au-dessus du bouton. Vide = « Click the button to sign in: » / « Cliquez sur le bouton pour vous connecter : ».",
    outroHint: "Texte de fin optionnel sous le bouton. Vide = aucun.",
    button: true,
  }),
  confirmationGroup({
    name: "authNewDevice",
    heading: false,
    addressFields: false,
    title: "Authentification — nouvelle connexion (appareil inconnu)",
    description:
      "E-mail de sécurité envoyé lors d'une connexion depuis un nouvel appareil (l'appareil et le lieu sont insérés automatiquement). Le bouton « déconnecter » n'apparaît que si Clerk fournit le lien de révocation. Champs vides = texte intégré au worker.",
    enabledHint:
      "Informatif — décochée = on ignore la copie personnalisée (texte intégré).",
    subjectHint:
      "Vide = « New sign-in to your account » / « Nouvelle connexion à votre compte ».",
    introHint:
      "La phrase d'introduction, au-dessus des détails de connexion. Vide = « We noticed a new sign-in… » / « Nous avons détecté une nouvelle connexion… ».",
    outroHint:
      "Le message affiché quand le lien de déconnexion est ABSENT (ex. « changez votre mot de passe »). Vide = texte intégré. Sert aussi de libellé de repli.",
    button: true,
  }),
];
