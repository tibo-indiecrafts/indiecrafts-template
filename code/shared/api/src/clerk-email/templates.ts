/**
 * Render localized bodies for the taken-over Clerk auth emails and the welcome email.
 *
 * @see docs/reference/shared/api/src/clerk-email/templates.md
 */
import { pickLocale } from "@indiecrafts/packages-shared-config";

/**
 * Studio-editable copy for one auth email, ALREADY resolved to the recipient's locale by
 * the handler (`clerk-email/handle.ts` reads the `emailStrings` singleton and picks the
 * language). Every field is optional — an empty field falls back to the hardcoded copy
 * below, so the email never breaks when Sanity is unset or a field is blank.
 */
export type AuthCopy = {
  subject?: string;
  intro?: string;
  buttonLabel?: string;
  outro?: string;
};

/** Escape untrusted text before interpolating it into an HTML body. */
function escapeHtml(s: string): string {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

const str = (v: unknown): string => (typeof v === "string" ? v : "");

export type EmailVars = Record<string, unknown>;
export type Rendered = { subject: string; html: string; text: string };

function codeBody(line: string, code: string, outro?: string): Rendered {
  const c = escapeHtml(code);
  const outroHtml = outro ? `<p>${escapeHtml(outro)}</p>` : "";
  const outroText = outro ? `\n\n${outro}` : "";
  return {
    subject: "",
    html: `<p>${escapeHtml(line)}</p><p style="font-size:24px;font-weight:700;letter-spacing:4px">${c}</p>${outroHtml}`,
    text: `${line}\n\n${code}${outroText}`,
  };
}

/**
 * Localized templates for the taken-over Clerk auth emails, keyed by Clerk's email
 * template `slug`. Each renders OUR copy from the event's `data` variables (the OTP
 * code / magic-link URL — read defensively, Clerk's names are stable per template but
 * vary a little), so Clerk's own rendered English `body` is ignored for these. Add a
 * slug here to localize another template; unknown slugs are forwarded as-is by the
 * handler (never dropped).
 *
 * The optional `copy` argument is the Studio override (per-field, already localized); a
 * present field wins over the hardcoded en/fr, an absent one falls back — so operators
 * can edit the copy per locale in the Studio without ever breaking the email.
 */
export const AUTH_TEMPLATES: Record<
  string,
  (vars: EmailVars, locale: string, copy?: AuthCopy) => Rendered
> = {
  verification_code: (vars, locale, copy) => ({
    ...codeBody(
      copy?.intro ||
        pickLocale(
          {
            en: "Your verification code is:",
            fr: "Votre code de vérification est :",
          },
          locale,
        ),
      str(vars.otp_code) || str(vars.code),
      copy?.outro,
    ),
    subject:
      copy?.subject ||
      pickLocale(
        { en: "Your verification code", fr: "Votre code de vérification" },
        locale,
      ),
  }),
  reset_password_code: (vars, locale, copy) => ({
    ...codeBody(
      copy?.intro ||
        pickLocale(
          {
            en: "Your password reset code is:",
            fr: "Votre code de réinitialisation est :",
          },
          locale,
        ),
      str(vars.otp_code) || str(vars.code),
      copy?.outro,
    ),
    subject:
      copy?.subject ||
      pickLocale(
        { en: "Reset your password", fr: "Réinitialiser votre mot de passe" },
        locale,
      ),
  }),
  magic_link_sign_in: magicLink,
  magic_link_sign_up: magicLink,
  // "Sign in from new device" — the exact slug is undocumented; register the two most
  // likely names. A wrong guess is safe: the handler forwards an unmatched slug as
  // Clerk's own (English) email and logs the slug so we can lock the real one.
  sign_in_from_new_device: newDevice,
  new_device_sign_in: newDevice,
  // Security notifications (no code/link) — editable copy, hardcoded en/fr fallback.
  password_changed: (_v, l, c) =>
    notice(
      {
        en: "Your password was changed",
        fr: "Votre mot de passe a été modifié",
      },
      {
        en: "Your account password was just changed.",
        fr: "Le mot de passe de votre compte vient d'être modifié.",
      },
      l,
      c,
    ),
  password_removed: (_v, l, c) =>
    notice(
      {
        en: "Your password was removed",
        fr: "Votre mot de passe a été supprimé",
      },
      {
        en: "Your account password was removed.",
        fr: "Le mot de passe de votre compte a été supprimé.",
      },
      l,
      c,
    ),
  passkey_added: (_v, l, c) =>
    notice(
      { en: "A passkey was added", fr: "Une clé d'accès a été ajoutée" },
      {
        en: "A new passkey was added to your account.",
        fr: "Une nouvelle clé d'accès a été ajoutée à votre compte.",
      },
      l,
      c,
    ),
  passkey_removed: (_v, l, c) =>
    notice(
      { en: "A passkey was removed", fr: "Une clé d'accès a été supprimée" },
      {
        en: "A passkey was removed from your account.",
        fr: "Une clé d'accès a été supprimée de votre compte.",
      },
      l,
      c,
    ),
  mfa_enabled: (_v, l, c) =>
    notice(
      {
        en: "Two-step verification enabled",
        fr: "Double authentification activée",
      },
      {
        en: "Two-step verification was enabled on your account.",
        fr: "La double authentification a été activée sur votre compte.",
      },
      l,
      c,
    ),
  primary_email_address_changed: (_v, l, c) =>
    notice(
      {
        en: "Your primary email changed",
        fr: "Votre adresse principale a changé",
      },
      {
        en: "Your account's primary email address was changed.",
        fr: "L'adresse e-mail principale de votre compte a été modifiée.",
      },
      l,
      c,
    ),
  account_locked: (_v, l, c) =>
    notice(
      { en: "Your account is locked", fr: "Votre compte est verrouillé" },
      {
        en: "Your account was locked after too many attempts.",
        fr: "Votre compte a été verrouillé après trop de tentatives.",
      },
      l,
      c,
    ),
  invitation: (_v, l, c) =>
    notice(
      { en: "You've been invited", fr: "Vous avez été invité(e)" },
      {
        en: "You've been invited to join.",
        fr: "Vous avez été invité(e) à nous rejoindre.",
      },
      l,
      c,
    ),
};

/** A security-notification email (no code, no button): editable `subject`/`intro`/`outro`
 *  over a hardcoded en/fr fallback. */
function notice(
  subjectDefault: { en: string; fr: string },
  introDefault: { en: string; fr: string },
  locale: string,
  copy?: AuthCopy,
): Rendered {
  const intro = copy?.intro || pickLocale(introDefault, locale);
  const outro = copy?.outro;
  return {
    subject: copy?.subject || pickLocale(subjectDefault, locale),
    html: `<p>${escapeHtml(intro)}</p>${outro ? `<p>${escapeHtml(outro)}</p>` : ""}`,
    text: `${intro}${outro ? `\n\n${outro}` : ""}`,
  };
}

/**
 * The post-signup welcome email (no code, no button). Unlike the take-over emails it is
 * NOT triggered by a Clerk email template — it fires on the `user.created` webhook — so it
 * is rendered directly rather than via a slug in `AUTH_TEMPLATES`. Editable subject/intro/
 * outro (Studio `clerkEmails.welcome`) over the hardcoded en/fr fallback below.
 */
export function renderWelcome(locale: string, copy?: AuthCopy): Rendered {
  return notice(
    {
      en: "Welcome — your account is ready",
      fr: "Bienvenue — votre compte est prêt",
    },
    {
      en: "Your account is all set. Thanks for joining — we're glad you're here.",
      fr: "Votre compte est prêt. Merci de nous avoir rejoints — ravis de vous compter parmi nous.",
    },
    locale,
    copy,
  );
}

function magicLink(vars: EmailVars, locale: string, copy?: AuthCopy): Rendered {
  const url =
    str(vars.magic_link) || str(vars.magic_link_url) || str(vars.link);
  const line =
    copy?.intro ||
    pickLocale(
      {
        en: "Click the button to sign in:",
        fr: "Cliquez sur le bouton pour vous connecter :",
      },
      locale,
    );
  const label =
    copy?.buttonLabel ||
    pickLocale({ en: "Sign in", fr: "Se connecter" }, locale);
  const outro = copy?.outro;
  const u = escapeHtml(url);
  return {
    subject:
      copy?.subject ||
      pickLocale(
        { en: "Sign in to your account", fr: "Connectez-vous à votre compte" },
        locale,
      ),
    html: `<p>${escapeHtml(line)}</p><p><a href="${u}">${escapeHtml(label)}</a></p>${
      outro ? `<p>${escapeHtml(outro)}</p>` : ""
    }`,
    text: `${line}\n${url}${outro ? `\n\n${outro}` : ""}`,
  };
}

/**
 * The "sign in from a new device" security notification. Reads the device/location
 * details defensively (Clerk's field names for this template are undocumented but
 * stable per template; unknowns are omitted) and renders the "sign out this device"
 * revoke button ONLY when the payload carries the link — otherwise it degrades to the
 * `outro` "change your password" warning (never a broken/empty button).
 */
function newDevice(vars: EmailVars, locale: string, copy?: AuthCopy): Rendered {
  const what = [
    str(vars.device_type) || str(vars.device),
    str(vars.os) || str(vars.operating_system),
    str(vars.browser_name) || str(vars.browser),
  ]
    .filter(Boolean)
    .join(" · ");
  const where =
    str(vars.location) ||
    [str(vars.city), str(vars.country)].filter(Boolean).join(", ");
  const ip = str(vars.ip_address) || str(vars.ip);
  // Clerk's one-click "sign out this session" link — optional in its payload. Without
  // it, the account's device list (Clerk <UserProfile> Security tab: every signed-in
  // device with a Sign out button). https only: the link goes straight into an href.
  const https = (u: string) => (/^https:\/\//i.test(u) ? u : "");
  const revoke = https(
    str(vars.revoke_session_url) || str(vars.sign_out_url) || str(vars.link),
  );
  const review = revoke ? "" : https(str(vars.account_security_url));

  const details = [what, where, ip ? `IP ${ip}` : ""].filter(Boolean);
  const intro =
    copy?.intro ||
    pickLocale(
      {
        en: "We noticed a new sign-in to your account:",
        fr: "Nous avons détecté une nouvelle connexion à votre compte :",
      },
      locale,
    );
  const revokeLabel =
    copy?.buttonLabel ||
    pickLocale(
      {
        en: "This wasn't you? Sign out this device",
        fr: "Ce n'était pas vous ? Déconnecter cet appareil",
      },
      locale,
    );
  const reviewLabel =
    copy?.buttonLabel ||
    pickLocale(
      {
        en: "This wasn't you? Disconnect it from your devices list",
        fr: "Ce n'était pas vous ? Déconnectez-le depuis la liste de vos appareils",
      },
      locale,
    );
  const noRevoke =
    copy?.outro ||
    pickLocale(
      {
        en: "If this wasn't you, change your password immediately.",
        fr: "Si ce n'était pas vous, changez votre mot de passe immédiatement.",
      },
      locale,
    );
  const listHtml = details.length
    ? `<ul>${details.map((d) => `<li>${escapeHtml(d)}</li>`).join("")}</ul>`
    : "";
  const link = revoke
    ? { href: revoke, label: revokeLabel }
    : review
      ? { href: review, label: reviewLabel }
      : null;
  const cta = link
    ? `<p><a href="${escapeHtml(link.href)}">${escapeHtml(link.label)}</a></p>`
    : `<p>${escapeHtml(noRevoke)}</p>`;
  return {
    subject:
      copy?.subject ||
      pickLocale(
        {
          en: "New sign-in to your account",
          fr: "Nouvelle connexion à votre compte",
        },
        locale,
      ),
    html: `<p>${escapeHtml(intro)}</p>${listHtml}${cta}`,
    text: `${intro}\n${details.join("\n")}\n\n${link ? `${link.label}: ${link.href}` : noRevoke}`,
  };
}
