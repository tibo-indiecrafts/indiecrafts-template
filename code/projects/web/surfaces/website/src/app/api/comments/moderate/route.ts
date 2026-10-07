/**
 * Handle one-click comment moderation from the notification email.
 *
 * @see docs/reference/projects/web/website/src/app/api/comments/moderate/route.md
 */
import { NextResponse } from "next/server";
import { createTranslator } from "next-intl";
import { defaultLocale, security, site } from "@/config";
import { escapeHtml } from "@indiecrafts/packages-web-email";
import { clientIp } from "@indiecrafts/packages-shared-security/guard";
import { rateLimit } from "@indiecrafts/packages-shared-security/rate-limit";
import { isCommentsEnabled } from "@indiecrafts/modules-web-blog/lib/route-gate";
import {
  getModerationComment,
  isModerationAction,
  moderateComment,
  type ModerationAction,
} from "@indiecrafts/modules-web-blog/lib/moderate";

/**
 * One-click comment moderation from the notification email. **GET renders a
 * confirm page** (read-only) — the mutation happens only on the confirm **POST**,
 * so a link-scanner / prefetcher (Outlook SafeLinks, etc.) can't auto-moderate.
 * Authorized by the one-time `moderationToken` (secret, single-use). Owner tool →
 * a self-contained HTML handler, not a localized page: its copy is the bundled
 * `messages.moderation` in the default locale, like the email that links here. No
 * Sanity overlay: a rate-limited or junk request must not cost an API call.
 */

const copy = async () =>
  createTranslator({
    locale: defaultLocale,
    messages: (await import(`../../../../../messages/${defaultLocale}.json`)).default,
    namespace: "moderation",
  });

const ACTION_COLOR: Record<ModerationAction, string> = {
  approve: "#16a34a",
  spam: "#6b7280",
  delete: "#dc2626",
};

const brand = (() => {
  try {
    return new URL(site.url).host;
  } catch {
    return site.url;
  }
})();

function page(title: string, inner: string, status = 200): Response {
  const html = `<!doctype html>
<html lang="${defaultLocale}"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex"><title>${escapeHtml(title)} · ${escapeHtml(brand)}</title>
</head>
<body style="margin:0;background:#f4f5f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#374151">
<div style="max-width:520px;margin:0 auto;padding:48px 20px">
<p style="margin:0 0 16px;color:#6b7280;font-size:13px;font-weight:600;letter-spacing:.04em;text-transform:uppercase">${escapeHtml(brand)}</p>
<div style="background:#ffffff;border:1px solid #e6e8eb;border-radius:12px;padding:32px">${inner}</div>
</div>
</body></html>`;
  return new Response(html, {
    status,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

const studioLink = (label: string) =>
  `<a href="${escapeHtml(site.url)}/studio" style="color:#4f46e5;font-size:14px">${escapeHtml(label)}</a>`;

const expired = async () => {
  const t = await copy();
  return page(
    t("expiredTitle"),
    `<h1 style="margin:0 0 12px;font-size:20px;color:#111827">${escapeHtml(t("expiredTitle"))}</h1><p style="margin:0 0 20px;font-size:15px;line-height:1.6">${escapeHtml(t("expiredBody"))}</p>${studioLink(t("openStudio"))}`,
    410,
  );
};

const unknownAction = async () => {
  const t = await copy();
  return page(
    t("unknownAction"),
    `<p style="margin:0">${escapeHtml(t("unknownAction"))}</p>`,
    400,
  );
};

export async function GET(request: Request) {
  if (!isCommentsEnabled())
    return NextResponse.json({ error: "not_found" }, { status: 404 });

  const params = new URL(request.url).searchParams;
  const token = params.get("token") ?? "";
  const action = params.get("action");
  if (!isModerationAction(action)) return unknownAction();

  const comment = await getModerationComment(token);
  if (!comment) return expired();

  const t = await copy();
  const verb = t(action);
  const excerpt = (comment.body ?? "").slice(0, 400);
  const inner = `
<h1 style="margin:0 0 20px;font-size:20px;color:#111827">${escapeHtml(t("confirmTitle", { action: verb }))}</h1>
<p style="margin:0 0 4px;color:#6b7280;font-size:12px;text-transform:uppercase;letter-spacing:.04em">${escapeHtml(comment.authorName ?? "?")}${comment.post ? ` — ${escapeHtml(comment.post)}` : ""}</p>
<blockquote style="margin:8px 0 24px;padding:14px 18px;background:#f4f5f7;border-left:3px solid #e6e8eb;border-radius:6px;font-size:15px;line-height:1.6">${escapeHtml(excerpt).replaceAll("\n", "<br>")}</blockquote>
${action === "delete" ? `<p style="margin:0 0 20px;font-size:14px;color:#dc2626">${escapeHtml(t("deleteWarning"))}</p>` : ""}
<form method="post" action="/api/comments/moderate">
<input type="hidden" name="token" value="${escapeHtml(token)}">
<input type="hidden" name="action" value="${action}">
<button type="submit" style="border:0;cursor:pointer;display:inline-block;padding:12px 22px;background:${ACTION_COLOR[action]};color:#ffffff;border-radius:8px;font-weight:600;font-size:15px">${escapeHtml(verb)}</button>
</form>`;
  return page(verb, inner);
}

export async function POST(request: Request) {
  if (!isCommentsEnabled())
    return NextResponse.json({ error: "not_found" }, { status: 404 });

  // This is a cross-site form POST from the email client, so it can't adopt
  // `withGuard` (JSON body + same-origin). The token is the auth; this rate limit
  // is defence-in-depth against token brute-force (no-ops until RATE_LIMIT_KV is bound).
  const { ok } = await rateLimit(
    `${clientIp(request)}:/api/comments/moderate`,
    security.moderate.rateLimit.limit,
    security.moderate.rateLimit.windowSec,
  );
  if (!ok) {
    const t = await copy();
    return page(
      t("tooManyTitle"),
      `<p style="margin:0">${escapeHtml(t("tooManyBody"))}</p>`,
      429,
    );
  }

  const form = await request.formData().catch(() => null);
  const token = String(form?.get("token") ?? "");
  const action = form?.get("action");
  if (!isModerationAction(action)) return unknownAction();

  const result = await moderateComment(token, action);
  if (result === "invalid") return expired();

  const t = await copy();
  return page(
    t("doneTitle"),
    `<h1 style="margin:0 0 12px;font-size:20px;color:#111827">✓ ${escapeHtml(t("doneTitle"))}</h1><p style="margin:0 0 20px;font-size:15px;line-height:1.6">${escapeHtml(t(`${action}Done`))}</p>${studioLink(t("openStudio"))}`,
  );
}
