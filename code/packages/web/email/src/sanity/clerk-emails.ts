/**
 * Define the Clerk authentication-email copy singleton.
 *
 * @see docs/reference/packages/web/email/src/sanity/clerk-emails.md
 */

import { defineType } from "sanity";
import type { ListItemBuilder, StructureBuilder } from "sanity/structure";
import { LockIcon } from "@sanity/icons/Lock";
import { confirmationGroup } from "./groups";

/**
 * E-mails Clerk (singleton) — the editable copy for EVERY Clerk authentication +
 * security email our API worker takes over (`email.created` → `code/shared/api/src/
 * clerk-email`). A **separate** document from the "E-mails" singleton so the auth/security
 * set lives on its own. Each group's copy is translated per language
 * (`localeString`/`localeText`), resolved to the RECIPIENT's stored locale; every field is
 * optional and falls back, per field, to the English/French copy hardcoded in the worker
 * (`clerk-email/templates.ts`), so an email never breaks when Sanity is unset. The sender
 * is the worker's `EMAIL_FROM`; the support address is the global `emailStrings.supportEmail`
 * shown in every footer — neither is set here. The OTP code / magic-link URL / device
 * details are inserted by the worker; only the surrounding copy is editable.
 */

/** A code/OTP email group (no button): verification + reset. */
const codeGroup = (
  name: string,
  title: string,
  description: string,
  subjectHint: string,
  introHint: string,
) =>
  confirmationGroup({
    name,
    heading: false,
    addressFields: false,
    title,
    description,
    enabledHint:
      "Informatif — l'envoi est déclenché par Clerk ; décochée = on ignore la copie personnalisée ci-dessous (texte intégré au worker).",
    subjectHint,
    introHint,
    outroHint: "Petit texte optionnel sous le code. Vide = aucun.",
  });

/** A notification/security email group (no code, no button): password/passkey/mfa/etc. */
const noticeGroup = (
  name: string,
  title: string,
  description: string,
  subjectHint: string,
  introHint: string,
) =>
  confirmationGroup({
    name,
    heading: false,
    addressFields: false,
    title,
    description,
    enabledHint:
      "Informatif — décochée = on ignore la copie personnalisée (texte intégré au worker).",
    subjectHint,
    introHint,
    outroHint: "Texte de fin optionnel. Vide = aucun.",
  });

/** The 12 Clerk templates the worker localizes + the post-signup welcome — Studio order. */
const clerkGroups = [
  codeGroup(
    "verification",
    "Code de vérification",
    "E-mail contenant le code de connexion à usage unique (inséré automatiquement). Champs vides = texte intégré au worker.",
    "Vide = « Your verification code » / « Votre code de vérification ».",
    "La phrase au-dessus du code. Vide = « Your verification code is: » / « Votre code de vérification est : ».",
  ),
  codeGroup(
    "resetPassword",
    "Réinitialisation du mot de passe",
    "E-mail contenant le code de réinitialisation du mot de passe (inséré automatiquement). Champs vides = texte intégré.",
    "Vide = « Reset your password » / « Réinitialiser votre mot de passe ».",
    "La phrase au-dessus du code. Vide = « Your password reset code is: » / « Votre code de réinitialisation est : ».",
  ),
  confirmationGroup({
    name: "magicLink",
    heading: false,
    addressFields: false,
    button: true,
    title: "Lien magique de connexion",
    description:
      "E-mail avec le bouton de connexion (lien magique, inséré automatiquement). Champs vides = texte intégré.",
    enabledHint:
      "Informatif — décochée = on ignore la copie personnalisée (texte intégré).",
    subjectHint:
      "Vide = « Sign in to your account » / « Connectez-vous à votre compte ».",
    introHint:
      "La phrase au-dessus du bouton. Vide = « Click the button to sign in: » / « Cliquez pour vous connecter : ».",
    outroHint: "Texte de fin optionnel sous le bouton. Vide = aucun.",
  }),
  confirmationGroup({
    name: "newDevice",
    heading: false,
    addressFields: false,
    button: true,
    title: "Nouvelle connexion (appareil inconnu)",
    description:
      "E-mail de sécurité lors d'une connexion depuis un nouvel appareil (appareil + lieu insérés automatiquement). Le bouton « déconnecter » n'apparaît que si Clerk fournit le lien. Champs vides = texte intégré.",
    enabledHint:
      "Informatif — décochée = on ignore la copie personnalisée (texte intégré).",
    subjectHint:
      "Vide = « New sign-in to your account » / « Nouvelle connexion à votre compte ».",
    introHint:
      "Introduction, au-dessus des détails. Vide = « We noticed a new sign-in… » / « Nous avons détecté une nouvelle connexion… ».",
    outroHint:
      "Message affiché quand le lien de déconnexion est absent (ex. « changez votre mot de passe »). Vide = texte intégré.",
  }),
  noticeGroup(
    "passwordChanged",
    "Mot de passe modifié",
    "Notification de sécurité : le mot de passe du compte a été modifié. Champs vides = texte intégré.",
    "Vide = « Your password was changed » / « Votre mot de passe a été modifié ».",
    "Le message. Vide = « Your account password was just changed. » / « Le mot de passe de votre compte vient d'être modifié. ».",
  ),
  noticeGroup(
    "passwordRemoved",
    "Mot de passe supprimé",
    "Notification de sécurité : le mot de passe du compte a été supprimé. Champs vides = texte intégré.",
    "Vide = « Your password was removed » / « Votre mot de passe a été supprimé ».",
    "Le message. Vide = « Your account password was removed. » / « Le mot de passe de votre compte a été supprimé. ».",
  ),
  noticeGroup(
    "passkeyAdded",
    "Clé d'accès ajoutée",
    "Notification de sécurité : une clé d'accès (passkey) a été ajoutée au compte. Champs vides = texte intégré.",
    "Vide = « A passkey was added » / « Une clé d'accès a été ajoutée ».",
    "Le message. Vide = « A new passkey was added to your account. » / « Une nouvelle clé d'accès a été ajoutée à votre compte. ».",
  ),
  noticeGroup(
    "passkeyRemoved",
    "Clé d'accès supprimée",
    "Notification de sécurité : une clé d'accès (passkey) a été supprimée. Champs vides = texte intégré.",
    "Vide = « A passkey was removed » / « Une clé d'accès a été supprimée ».",
    "Le message. Vide = « A passkey was removed from your account. » / « Une clé d'accès a été supprimée de votre compte. ».",
  ),
  noticeGroup(
    "mfaEnabled",
    "Double authentification activée",
    "Notification de sécurité : la double authentification (2FA) a été activée. Champs vides = texte intégré.",
    "Vide = « Two-step verification enabled » / « Double authentification activée ».",
    "Le message. Vide = « Two-step verification was enabled on your account. » / « La double authentification a été activée sur votre compte. ».",
  ),
  noticeGroup(
    "primaryEmailChanged",
    "Adresse e-mail principale modifiée",
    "Notification de sécurité : l'adresse e-mail principale du compte a changé. Champs vides = texte intégré.",
    "Vide = « Your primary email changed » / « Votre adresse principale a changé ».",
    "Le message. Vide = « Your account's primary email address was changed. » / « L'adresse e-mail principale de votre compte a été modifiée. ».",
  ),
  noticeGroup(
    "accountLocked",
    "Compte verrouillé",
    "Notification de sécurité : le compte a été verrouillé (trop de tentatives). Champs vides = texte intégré.",
    "Vide = « Your account is locked » / « Votre compte est verrouillé ».",
    "Le message. Vide = « Your account was locked after too many attempts. » / « Votre compte a été verrouillé après trop de tentatives. ».",
  ),
  confirmationGroup({
    name: "invitation",
    heading: false,
    addressFields: false,
    button: true,
    title: "Invitation",
    description:
      "E-mail d'invitation à rejoindre (le lien d'acceptation est inséré dans le bouton). Champs vides = texte intégré.",
    enabledHint:
      "Informatif — décochée = on ignore la copie personnalisée (texte intégré).",
    subjectHint:
      "Vide = « You've been invited » / « Vous avez été invité(e) ».",
    introHint:
      "La phrase au-dessus du bouton. Vide = « You've been invited to join. » / « Vous avez été invité(e) à nous rejoindre. ».",
    outroHint: "Texte de fin optionnel sous le bouton. Vide = aucun.",
  }),
  noticeGroup(
    "welcome",
    "Bienvenue (après inscription)",
    "E-mail de bienvenue envoyé après la création d'un compte (déclenché par l'inscription, pas par un modèle Clerk). Champs vides = texte intégré.",
    "Vide = « Welcome — your account is ready » / « Bienvenue — votre compte est prêt ».",
    "Le message d'accueil. Vide = « Your account is all set. Thanks for joining… » / « Votre compte est prêt. Merci de nous avoir rejoints… ».",
  ),
];

export function buildClerkEmails() {
  return defineType({
    name: "clerkEmails",
    title: "E-mails Clerk",
    type: "document",
    icon: LockIcon,
    __experimental_omnisearch_visibility: false,
    fields: clerkGroups,
    preview: {
      prepare: () => ({
        title: "E-mails Clerk",
        subtitle: "Copie des e-mails d'authentification (traduisible)",
      }),
    },
  });
}

/** "E-mails Clerk" desk item — the editable `clerkEmails` singleton. */
export function clerkEmailsStructureItem(S: StructureBuilder): ListItemBuilder {
  return S.listItem()
    .title("E-mails Clerk")
    .icon(LockIcon)
    .child(
      S.editor()
        .id("clerkEmails")
        .schemaType("clerkEmails")
        .documentId("clerkEmails"),
    );
}
