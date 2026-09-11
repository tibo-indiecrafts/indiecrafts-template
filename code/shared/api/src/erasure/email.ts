// Worker-side Resend sender for the erasure flow's two transactional emails.
// `@indiecrafts/packages-web-email` (`sendEmail`/`renderEmailLayout`) is
// `import "server-only"` + Next-coupled — unusable in this bare Worker, so this
// inlines the same ~15-line Resend POST + a local `escapeHtml`. Copy is read from
// the Studio-editable `emailStrings` singleton (raw GROQ-over-HTTP, mirroring
// `fetchAnnouncementDocs` in `index.ts`) with a per-field fallback to hard-coded
// English — these emails are mandatory, so a missing/unreachable Sanity, or an
// operator setting `enabled: false`, must never stop the send.

import { defaultLocale, pickLocale } from "@indiecrafts/packages-shared-config";

/** The Env slice this module needs — never the full worker `Env`. */
export type MailEnv = {
  RESEND_API_KEY?: string;
  EMAIL_FROM?: string;
  /** BCC'd on every email this module sends. Optional — unset → no bcc. Infra-controlled. */
  EMAIL_ADMIN_BCC?: string;
  /** Truthy → honor the Studio-editable `emailStrings.bccAll`. Infra gate: unset in prod, so a
   *  CMS editor can't silently redirect a blind copy of auth codes / magic links. QA-only. */
  EMAIL_BCC_ALL_ENABLED?: string;
  SANITY_PROJECT_ID?: string;
  SANITY_DATASET?: string;
  SANITY_API_VERSION?: string;
  SANITY_API_READ_TOKEN?: string;
};

/** A resolved `localeString`/`localeText` field, or a plain string. */
type LocaleValue =
  Record<string, string | undefined> | string | null | undefined;

type ErasureEmailGroup = {
  enabled?: boolean;
  subject?: LocaleValue;
  heading?: LocaleValue;
  intro?: LocaleValue;
  buttonLabel?: LocaleValue;
  outro?: LocaleValue;
};

type ErasureEmailStrings = {
  erasureToken?: ErasureEmailGroup;
  erasureComplete?: ErasureEmailGroup;
  /** The global editor-owned support address (`emailStrings.supportEmail`). */
  supportEmail?: string;
  /** The global editor-owned blind-copy address (`emailStrings.bccAll`). */
  bccAll?: string;
};

/** Escape untrusted text before interpolating it into an HTML body. */
function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

/** Resolve a locale field to the recipient's locale, else the default; blank → undefined
 *  (so the caller's `|| "hardcoded"` fallback fires). Thin adapter over shared `pickLocale`. */
function pick(value: LocaleValue, locale: string): string | undefined {
  return pickLocale(value, locale) || undefined;
}

/** The editor-owned support-address footer, appended to every worker-sent email (erasure +
 *  the Clerk take-over). Worker-safe — the shared `renderEmailLayout` is `server-only`/
 *  Next-coupled, unusable here. Empty when no address is set; the value is escaped though
 *  it is email-validated in Studio. */
export function supportFooter(supportEmail: string | undefined): {
  html: string;
  text: string;
} {
  const e = supportEmail?.trim();
  if (!e) return { html: "", text: "" };
  const esc = escapeHtml(e);
  return {
    html: `<p style="margin-top:24px;color:#8a8f98;font-size:12px">Besoin d'aide&nbsp;? <a href="mailto:${esc}" style="color:#8a8f98">${esc}</a></p>`,
    text: `\n\nBesoin d'aide ? ${e}`,
  };
}

/** The recipient's stored locale (`user_profiles.locale`) — by Clerk user id, else by
 *  email fingerprint, else the default. Never throws: a lookup miss must not stop a
 *  mandatory erasure email. Read it BEFORE the erasure runs, or the profile is gone. */
export async function readProfileLocale(
  db: D1Database,
  {
    userId,
    fingerprint,
  }: { userId?: string | null; fingerprint?: string | null },
): Promise<string> {
  try {
    let row: { locale?: string | null } | null = null;
    if (userId)
      row = await db
        .prepare("SELECT locale FROM user_profiles WHERE user_id = ?")
        .bind(userId)
        .first();
    if (!row?.locale && fingerprint)
      row = await db
        .prepare("SELECT locale FROM user_profiles WHERE email_fingerprint = ?")
        .bind(fingerprint)
        .first();
    return (typeof row?.locale === "string" && row.locale) || defaultLocale;
  } catch {
    return defaultLocale;
  }
}

/** Mirrors `fetchAnnouncementDocs` (`index.ts`) — raw GROQ-over-HTTP, same
 *  `apicdn`/`api` host branch, same already-declared Env vars, no new deps.
 *  MUST NOT throw: an unset/unreachable Sanity must never block a mandatory
 *  erasure email, so every failure resolves to `null` and callers fall back
 *  to hard-coded English. */
async function fetchErasureEmailStrings(
  env: MailEnv,
): Promise<ErasureEmailStrings | null> {
  if (!env.SANITY_PROJECT_ID || !env.SANITY_DATASET) return null;
  try {
    const version = env.SANITY_API_VERSION || "2025-01-01";
    const token = env.SANITY_API_READ_TOKEN;
    const host = token
      ? `${env.SANITY_PROJECT_ID}.api.sanity.io`
      : `${env.SANITY_PROJECT_ID}.apicdn.sanity.io`;
    const query =
      '*[_type=="emailStrings"][0]{ erasureToken{enabled,subject,heading,intro,buttonLabel,outro}, erasureComplete{enabled,subject,heading,intro,outro}, supportEmail, bccAll }';
    const endpoint = `https://${host}/v${version}/data/query/${env.SANITY_DATASET}?query=${encodeURIComponent(query)}`;
    const res = await fetch(
      endpoint,
      token ? { headers: { authorization: `Bearer ${token}` } } : undefined,
    );
    if (!res.ok) return null;
    const body = (await res.json()) as { result?: ErasureEmailStrings };
    return body.result ?? null;
  } catch {
    return null;
  }
}

export async function resend(
  env: MailEnv,
  {
    to,
    subject,
    html,
    text,
    bcc,
  }: {
    to: string;
    subject: string;
    html: string;
    text: string;
    /** Extra blind copy (the Studio-editable global `bccAll`), merged with `EMAIL_ADMIN_BCC`. */
    bcc?: string;
  },
): Promise<void> {
  const key = env.RESEND_API_KEY;
  const from = env.EMAIL_FROM;
  // Silent no-op: an unconfigured mailer must never break the erasure flow.
  if (!key || !from) return;

  // Merge the infra-controlled env admin bcc with the Studio-editable global bcc — but the
  // CMS value is honored ONLY when the infra gate is set (unset in prod), so a Sanity editor
  // can't silently redirect a blind copy of auth codes / magic links. Dedupe, drop empties.
  const cmsBcc = env.EMAIL_BCC_ALL_ENABLED ? bcc : undefined;
  const bccList = [...new Set([env.EMAIL_ADMIN_BCC, cmsBcc].filter(Boolean))];

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      subject,
      text,
      ...(html ? { html } : {}),
      ...(bccList.length ? { bcc: bccList } : {}),
    }),
  });
  if (!res.ok) throw new Error(`resend ${res.status}`);
}

/** The erasure request's token-confirmation email — sent when a request is filed. */
export async function sendErasureTokenEmail(
  env: MailEnv,
  {
    to,
    confirmUrl,
    locale = defaultLocale,
  }: { to: string; confirmUrl: string; locale?: string },
  // Injectable for tests (the vitest-pool-workers runtime can't `vi.mock` into the
  // worker isolate), same seam `request.ts` uses for `sendToken`.
  fetchStrings: typeof fetchErasureEmailStrings = fetchErasureEmailStrings,
): Promise<void> {
  // No mailer configured → skip everything, including the Sanity copy fetch.
  if (!env.RESEND_API_KEY || !env.EMAIL_FROM) return;
  const copy = await fetchStrings(env).catch(() => null);
  // `enabled: false` means "operator turned off custom copy" — fall back to the
  // literals below, same as an absent group. It never skips the send.
  const group =
    copy?.erasureToken?.enabled === false ? null : copy?.erasureToken;

  const subject =
    pick(group?.subject, locale) || "Confirm your data erasure request";
  const heading =
    pick(group?.heading, locale) ||
    "We received a request to erase your account data.";
  const intro = pick(group?.intro, locale) || "";
  const buttonLabel = pick(group?.buttonLabel, locale) || "Confirm erasure";
  const outro =
    pick(group?.outro, locale) ||
    "This link expires in 24 hours. If you did not request this, ignore this email.";

  const url = escapeHtml(confirmUrl);
  const line = intro
    ? `${escapeHtml(heading)} ${escapeHtml(intro)}`
    : escapeHtml(heading);
  const foot = supportFooter(copy?.supportEmail);
  const html = `<p>Hello ${escapeHtml(to)},</p><p>${line}</p><p><a href="${url}">${escapeHtml(buttonLabel)}</a></p><p>${escapeHtml(outro)}</p>${foot.html}`;
  const textLine = intro ? `${heading} ${intro}` : heading;
  const text = `Hello ${to},\n\n${textLine} Confirm it here:\n${confirmUrl}\n\n${outro}${foot.text}`;
  await resend(env, { to, subject, html, text, bcc: copy?.bccAll });
}

/** The erasure completion email — sent once the erasure run finishes. */
export async function sendErasureCompleteEmail(
  env: MailEnv,
  {
    to,
    retained,
    locale = defaultLocale,
  }: { to: string; retained: string; locale?: string },
  fetchStrings: typeof fetchErasureEmailStrings = fetchErasureEmailStrings,
): Promise<void> {
  // No mailer configured → skip everything, including the Sanity copy fetch.
  if (!env.RESEND_API_KEY || !env.EMAIL_FROM) return;
  const copy = await fetchStrings(env).catch(() => null);
  const group =
    copy?.erasureComplete?.enabled === false ? null : copy?.erasureComplete;

  const subject =
    pick(group?.subject, locale) || "Your data erasure is complete";
  const heading =
    pick(group?.heading, locale) || "We erased your account data.";
  const intro = pick(group?.intro, locale) || "";
  const outro = pick(group?.outro, locale) || "";

  const line = intro
    ? `${escapeHtml(heading)} ${escapeHtml(intro)}`
    : escapeHtml(heading);
  const foot = supportFooter(copy?.supportEmail);
  const html = `<p>Hello ${escapeHtml(to)},</p><p>${line}</p><p>${escapeHtml(retained)}</p>${outro ? `<p>${escapeHtml(outro)}</p>` : ""}${foot.html}`;
  const textLine = intro ? `${heading} ${intro}` : heading;
  const text = `Hello ${to},\n\n${textLine}\n\n${retained}${outro ? `\n\n${outro}` : ""}${foot.text}`;
  await resend(env, { to, subject, html, text, bcc: copy?.bccAll });
}
