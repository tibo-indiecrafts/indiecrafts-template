/**
 * Render the shared branded HTML email shell.
 *
 * @see docs/reference/packages/web/email/src/layout.md
 */

import {
  site,
  defaultLocale,
  localeCopy,
} from "@indiecrafts/packages-shared-config";
import { EMAIL_COLORS } from "./theme";

/**
 * The shared HTML email chrome — every email in this package renders through it,
 * so all outbound mail looks like one system. Table-based + inline styles: the
 * only layout technique email clients render reliably (Gmail/Outlook strip
 * `<style>`, flexbox, and CSS vars).
 *
 * Palette = the design tokens, resolved to inline hex (mail clients strip
 * `var()`/CSS, so email inlines the generated token hex — the same bridge the PWA
 * manifest uses). Edit the tokens, not here:
 * `code/packages/web/ui-tokens/src/shared/tokens.json` → `pnpm tokens:build`.
 */
const C = EMAIL_COLORS;

const FONT =
  "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";

/** Host of the configured site URL — the brand label in the header/footer. */
function brandLabel(): string {
  try {
    return new URL(site.url).host;
  } catch {
    return site.url;
  }
}

/** Escape untrusted text before interpolating it into `contentHtml`. */
export function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

/** Footer words per language; `footerCopy` falls back like the email's own copy. */
const FOOTER: Record<string, { sentBy: string; help: string }> = {
  en: { sentBy: "Sent by", help: "Need help?" },
  fr: { sentBy: "Envoyé par", help: "Besoin d'aide ?" },
};

/** Footer words in the email's language, else the default locale's, else English. */
const footerCopy = (lang: string) => localeCopy(FOOTER, lang);

export type EmailLayoutInput = {
  /** The `<h1>` shown at the top of the card. */
  title: string;
  /** Hidden inbox-preview text. Optional. */
  preheader?: string;
  /** Trusted HTML for the card body — the caller escapes any user values. */
  contentHtml: string;
  /** `<html lang>` — defaults to the site's default locale. */
  lang?: string;
  /** Editor-owned support address (from Sanity). Empty/omitted → no support line. */
  supportEmail?: string;
};

/**
 * Every email template's return shape — subject line + plain-text + HTML bodies.
 * The render contract shared across features; templates live with their feature
 * and import this from `@indiecrafts/packages-web-email`.
 */
export type RenderedEmail = { subject: string; text: string; html: string };

/** Wrap `contentHtml` in the branded, mail-client-safe shell. Returns a full document. */
export function renderEmailLayout({
  title,
  preheader,
  contentHtml,
  lang = defaultLocale,
  supportEmail,
}: EmailLayoutInput): string {
  const brand = escapeHtml(brandLabel());
  const url = escapeHtml(site.url);
  const words = footerCopy(lang);
  const help = escapeHtml(words.help).replace(" ?", "&nbsp;?");
  const support = supportEmail?.trim();
  return `<!doctype html>
<html lang="${escapeHtml(lang)}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light">
<title>${escapeHtml(title)}</title>
</head>
<body style="margin:0;padding:0;background:${C.page};font-family:${FONT};color:${C.body};-webkit-font-smoothing:antialiased">
${preheader ? `<span style="display:none;max-height:0;overflow:hidden;opacity:0">${escapeHtml(preheader)}</span>` : ""}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.page}">
<tr><td align="center" style="padding:32px 16px">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:100%">
<tr><td style="padding:0 4px 16px">
<a href="${url}" style="color:${C.muted};font-size:13px;font-weight:600;letter-spacing:.04em;text-transform:uppercase;text-decoration:none">${brand}</a>
</td></tr>
<tr><td style="background:${C.card};border:1px solid ${C.border};border-radius:12px;padding:32px">
<h1 style="margin:0 0 20px;font-size:20px;line-height:1.3;color:${C.heading}">${escapeHtml(title)}</h1>
${contentHtml}
</td></tr>
<tr><td style="padding:20px 4px 0;color:${C.muted};font-size:12px;line-height:1.5">
${words.sentBy} <a href="${url}" style="color:${C.muted}">${brand}</a>${support ? `<br>${help} <a href="mailto:${escapeHtml(support)}" style="color:${C.muted}">${escapeHtml(support)}</a>` : ""}
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}

/** The support line for an email's plain-text body: `""` when no address is set. */
function supportText(
  supportEmail: string | undefined,
  lang: string = defaultLocale,
): string {
  const email = supportEmail?.trim();
  return email ? `\n\n${footerCopy(lang).help} ${email}` : "";
}

/**
 * Finish a template: the branded HTML document plus the plain-text body, both with the
 * support line. Every template returns through this, so neither copy can miss it.
 */
export function renderEmail({
  subject,
  text,
  ...layout
}: EmailLayoutInput & { subject: string; text: string }): RenderedEmail {
  return {
    subject,
    text: text + supportText(layout.supportEmail, layout.lang),
    html: renderEmailLayout(layout),
  };
}
