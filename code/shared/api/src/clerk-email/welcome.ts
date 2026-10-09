/**
 * Send the best-effort post-signup welcome email in the recipient's locale.
 *
 * @see docs/reference/shared/api/src/clerk-email/welcome.md
 */
import { logger } from "@indiecrafts/packages-shared-logger";
import {
  inLanguage,
  resend,
  supportCopyOf,
  supportFooter,
  type MailEnv,
} from "../erasure/email";
import { fetchAuthEmailStrings, resolveWelcomeCopy } from "./sanity";
import { renderWelcome } from "./templates";

/**
 * Send the post-signup welcome email — fired from the `user.created` webhook (index.ts),
 * NOT the Clerk `email.created` take-over (Clerk has no welcome template). Best-effort: a
 * welcome is not a mandatory auth email, so a missing recipient or unconfigured mailer is a
 * silent no-op and this NEVER throws — the webhook's profile sync must not be affected.
 * Copy is the Studio `clerkEmails.welcome` override in the recipient's locale, else the
 * template's hardcoded en/fr. The support-address footer + global bcc apply as they do to
 * the take-over emails (the bcc is gated inside `resend`). Keyed by `userId` so a webhook
 * retry sends it once (Resend keeps the key 24 h). `send`/`fetchStrings` injectable.
 */
export async function sendWelcomeEmail(
  env: MailEnv,
  { to, locale, userId }: { to: string; locale: string; userId: string },
  send: typeof resend = resend,
  fetchStrings: typeof fetchAuthEmailStrings = fetchAuthEmailStrings,
): Promise<void> {
  if (!to) return;
  if (!env.RESEND_API_KEY || !env.EMAIL_FROM) return;
  try {
    const strings = await fetchStrings(env);
    const copy = resolveWelcomeCopy(strings, locale);
    const { subject, html, text } = renderWelcome(locale, copy);
    const foot = supportFooter(strings?.supportEmail, locale);
    await send(env, {
      to,
      subject,
      html: inLanguage(html + foot.html, locale),
      text: text + foot.text,
      bcc: strings?.bccAll,
      supportCopy: supportCopyOf(strings?.welcome, strings?.supportEmail),
      idempotencyKey: `welcome/${userId}`,
    });
  } catch (error) {
    // `resend` throws on a non-2xx or a timeout; log it (no address) instead of leaving
    // an unhandled rejection in the webhook's `waitUntil`.
    logger.error("welcome email failed", { name: (error as Error)?.name });
  }
}
