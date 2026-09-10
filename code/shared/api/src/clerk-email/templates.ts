import { defaultLocale } from "@indiecrafts/packages-shared-config";

/** One string per locale; resolved to the active locale (else the default, else any). */
type L = Record<string, string>;
export function pickLocale(v: L, locale: string): string {
  return v[locale] ?? v[defaultLocale] ?? Object.values(v)[0] ?? "";
}

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
};

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
    str(vars.browser),
  ]
    .filter(Boolean)
    .join(" · ");
  const where = [str(vars.city), str(vars.country)].filter(Boolean).join(", ");
  const ip = str(vars.ip_address) || str(vars.ip);
  const revoke =
    str(vars.revoke_session_url) || str(vars.sign_out_url) || str(vars.link);

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
  const cta = revoke
    ? `<p><a href="${escapeHtml(revoke)}">${escapeHtml(revokeLabel)}</a></p>`
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
    text: `${intro}\n${details.join("\n")}\n\n${revoke ? `${revokeLabel}: ${revoke}` : noRevoke}`,
  };
}
