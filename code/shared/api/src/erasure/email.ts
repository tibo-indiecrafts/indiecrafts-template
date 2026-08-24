// Worker-side Resend sender for the erasure flow's two transactional emails.
// `@indiecrafts/packages-web-email` (`sendEmail`/`renderEmailLayout`) is
// `import "server-only"` + Next-coupled — unusable in this bare Worker, so this
// inlines the same ~15-line Resend POST + a local `escapeHtml`. Copy is read from
// the Studio-editable `emailStrings` singleton (raw GROQ-over-HTTP, mirroring
// `fetchAnnouncementDocs` in `index.ts`) with a per-field fallback to hard-coded
// English — these emails are mandatory, so a missing/unreachable Sanity, or an
// operator setting `enabled: false`, must never stop the send.

import { defaultLocale } from "@indiecrafts/packages-shared-config";

/** The Env slice this module needs — never the full worker `Env`. */
export type MailEnv = {
  RESEND_API_KEY?: string;
  EMAIL_FROM?: string;
  /** BCC'd on every email this module sends. Optional — unset → no bcc. */
  EMAIL_ADMIN_BCC?: string;
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

/** The erasure flow has no locale signal — always resolve the default-locale copy. */
function pick(value: LocaleValue): string | undefined {
  if (typeof value === "string") return value;
  if (!value) return undefined;
  return value[defaultLocale] ?? Object.values(value)[0] ?? undefined;
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
      '*[_type=="emailStrings"][0]{ erasureToken{enabled,subject,heading,intro,buttonLabel,outro}, erasureComplete{enabled,subject,heading,intro,outro} }';
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
  }: { to: string; subject: string; html: string; text: string },
): Promise<void> {
  const key = env.RESEND_API_KEY;
  const from = env.EMAIL_FROM;
  // Silent no-op: an unconfigured mailer must never break the erasure flow.
  if (!key || !from) return;

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
      ...(env.EMAIL_ADMIN_BCC ? { bcc: [env.EMAIL_ADMIN_BCC] } : {}),
    }),
  });
  if (!res.ok) throw new Error(`resend ${res.status}`);
}

/** The erasure request's token-confirmation email — sent when a request is filed. */
export async function sendErasureTokenEmail(
  env: MailEnv,
  { to, confirmUrl }: { to: string; confirmUrl: string },
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

  const subject = pick(group?.subject) || "Confirm your data erasure request";
  const heading =
    pick(group?.heading) || "We received a request to erase your account data.";
  const intro = pick(group?.intro) || "";
  const buttonLabel = pick(group?.buttonLabel) || "Confirm erasure";
  const outro =
    pick(group?.outro) ||
    "This link expires in 24 hours. If you did not request this, ignore this email.";

  const url = escapeHtml(confirmUrl);
  const line = intro
    ? `${escapeHtml(heading)} ${escapeHtml(intro)}`
    : escapeHtml(heading);
  const html = `<p>Hello ${escapeHtml(to)},</p><p>${line}</p><p><a href="${url}">${escapeHtml(buttonLabel)}</a></p><p>${escapeHtml(outro)}</p>`;
  const textLine = intro ? `${heading} ${intro}` : heading;
  const text = `Hello ${to},\n\n${textLine} Confirm it here:\n${confirmUrl}\n\n${outro}`;
  await resend(env, { to, subject, html, text });
}

/** The erasure completion email — sent once the erasure run finishes. */
export async function sendErasureCompleteEmail(
  env: MailEnv,
  { to, retained }: { to: string; retained: string },
  fetchStrings: typeof fetchErasureEmailStrings = fetchErasureEmailStrings,
): Promise<void> {
  // No mailer configured → skip everything, including the Sanity copy fetch.
  if (!env.RESEND_API_KEY || !env.EMAIL_FROM) return;
  const copy = await fetchStrings(env).catch(() => null);
  const group =
    copy?.erasureComplete?.enabled === false ? null : copy?.erasureComplete;

  const subject = pick(group?.subject) || "Your data erasure is complete";
  const heading = pick(group?.heading) || "We erased your account data.";
  const intro = pick(group?.intro) || "";
  const outro = pick(group?.outro) || "";

  const line = intro
    ? `${escapeHtml(heading)} ${escapeHtml(intro)}`
    : escapeHtml(heading);
  const html = `<p>Hello ${escapeHtml(to)},</p><p>${line}</p><p>${escapeHtml(retained)}</p>${outro ? `<p>${escapeHtml(outro)}</p>` : ""}`;
  const textLine = intro ? `${heading} ${intro}` : heading;
  const text = `Hello ${to},\n\n${textLine}\n\n${retained}${outro ? `\n\n${outro}` : ""}`;
  await resend(env, { to, subject, html, text });
}
