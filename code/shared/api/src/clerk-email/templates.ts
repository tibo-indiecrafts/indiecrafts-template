import { defaultLocale } from "@indiecrafts/packages-shared-config";

/** One string per locale; resolved to the active locale (else the default, else any). */
type L = Record<string, string>;
export function pickLocale(v: L, locale: string): string {
  return v[locale] ?? v[defaultLocale] ?? Object.values(v)[0] ?? "";
}

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

function codeBody(line: string, code: string): Rendered {
  const c = escapeHtml(code);
  return {
    subject: "",
    html: `<p>${escapeHtml(line)}</p><p style="font-size:24px;font-weight:700;letter-spacing:4px">${c}</p>`,
    text: `${line}\n\n${code}`,
  };
}

/**
 * Localized templates for the taken-over Clerk auth emails, keyed by Clerk's email
 * template `slug`. Each renders OUR copy from the event's `data` variables (the OTP
 * code / magic-link URL — read defensively, Clerk's names are stable per template but
 * vary a little), so Clerk's own rendered English `body` is ignored for these. Add a
 * slug here to localize another template; unknown slugs are forwarded as-is by the
 * handler (never dropped). Copy is hardcoded en/fr for now — a Studio `emailStrings`
 * overlay (like the erasure emails) is a follow-up.
 */
export const AUTH_TEMPLATES: Record<
  string,
  (vars: EmailVars, locale: string) => Rendered
> = {
  verification_code: (vars, locale) => ({
    ...codeBody(
      pickLocale(
        {
          en: "Your verification code is:",
          fr: "Votre code de vérification est :",
        },
        locale,
      ),
      str(vars.otp_code) || str(vars.code),
    ),
    subject: pickLocale(
      { en: "Your verification code", fr: "Votre code de vérification" },
      locale,
    ),
  }),
  reset_password_code: (vars, locale) => ({
    ...codeBody(
      pickLocale(
        {
          en: "Your password reset code is:",
          fr: "Votre code de réinitialisation est :",
        },
        locale,
      ),
      str(vars.otp_code) || str(vars.code),
    ),
    subject: pickLocale(
      { en: "Reset your password", fr: "Réinitialiser votre mot de passe" },
      locale,
    ),
  }),
  magic_link_sign_in: magicLink,
  magic_link_sign_up: magicLink,
};

function magicLink(vars: EmailVars, locale: string): Rendered {
  const url =
    str(vars.magic_link) || str(vars.magic_link_url) || str(vars.link);
  const line = pickLocale(
    {
      en: "Click the button to sign in:",
      fr: "Cliquez sur le bouton pour vous connecter :",
    },
    locale,
  );
  const label = pickLocale({ en: "Sign in", fr: "Se connecter" }, locale);
  const u = escapeHtml(url);
  return {
    subject: pickLocale(
      { en: "Sign in to your account", fr: "Connectez-vous à votre compte" },
      locale,
    ),
    html: `<p>${escapeHtml(line)}</p><p><a href="${u}">${escapeHtml(label)}</a></p>`,
    text: `${line}\n${url}`,
  };
}
