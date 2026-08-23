// Worker-side Resend sender for the erasure flow's two transactional emails.
// `@indiecrafts/packages-web-email` (`sendEmail`/`renderEmailLayout`) is
// `import "server-only"` + Next-coupled — unusable in this bare Worker, so this
// inlines the same ~15-line Resend POST + a local `escapeHtml`. English-only
// copy for now (i18n/Sanity-editable erasure emails are a deferred slice).

/** The Env slice this module needs — never the full worker `Env`. */
type MailEnv = { RESEND_API_KEY?: string; EMAIL_FROM?: string };

/** Escape untrusted text before interpolating it into an HTML body. */
function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

async function resend(
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
    }),
  });
  if (!res.ok) throw new Error(`resend ${res.status}`);
}

/** The erasure request's token-confirmation email — sent when a request is filed. */
export async function sendErasureTokenEmail(
  env: MailEnv,
  { to, confirmUrl }: { to: string; confirmUrl: string },
): Promise<void> {
  const url = escapeHtml(confirmUrl);
  const html = `<p>Hello ${escapeHtml(to)},</p><p>We received a request to erase your account data.</p><p><a href="${url}">Confirm erasure</a></p><p>This link expires in 24 hours. If you did not request this, ignore this email.</p>`;
  const text = `Hello ${to},\n\nWe received a request to erase your account data. Confirm it here:\n${confirmUrl}\n\nThis link expires in 24 hours. If you did not request this, ignore this email.`;
  await resend(env, {
    to,
    subject: "Confirm your data erasure request",
    html,
    text,
  });
}

/** The erasure completion email — sent once the erasure run finishes. */
export async function sendErasureCompleteEmail(
  env: MailEnv,
  { to, retained }: { to: string; retained: string },
): Promise<void> {
  const html = `<p>Hello ${escapeHtml(to)},</p><p>We erased your account data.</p><p>${escapeHtml(retained)}</p>`;
  const text = `Hello ${to},\n\nWe erased your account data.\n\n${retained}`;
  await resend(env, {
    to,
    subject: "Your data erasure is complete",
    html,
    text,
  });
}
