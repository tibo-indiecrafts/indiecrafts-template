import "server-only";

/**
 * Minimal Resend sender — no SDK, one `fetch` to the REST API (mirrors the
 * newsletter buttondown adapter). `RESEND_API_KEY` is read from the environment
 * (server-only, never `NEXT_PUBLIC_`). Throws on a missing key or a non-2xx
 * response; callers treat sending as best-effort.
 */
export type SendEmailInput = {
  from: string;
  to: string[];
  cc?: string[];
  bcc?: string[];
  replyTo?: string;
  subject: string;
  text: string;
  html?: string;
};

export async function sendEmail(input: SendEmailInput): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY is not set");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      from: input.from,
      to: input.to,
      ...(input.cc?.length ? { cc: input.cc } : {}),
      ...(input.bcc?.length ? { bcc: input.bcc } : {}),
      ...(input.replyTo ? { reply_to: input.replyTo } : {}),
      subject: input.subject,
      text: input.text,
      ...(input.html ? { html: input.html } : {}),
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`resend responded ${res.status}: ${detail.slice(0, 200)}`);
  }
}
