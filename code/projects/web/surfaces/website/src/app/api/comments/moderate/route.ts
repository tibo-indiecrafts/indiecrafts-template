import { NextResponse } from "next/server";
import { security, site } from "@/config";
import { escapeHtml } from "@indiecrafts/email";
import { clientIp } from "@indiecrafts/security/guard";
import { rateLimit } from "@indiecrafts/security/rate-limit";
import { isCommentsEnabled } from "@indiecrafts/blog/lib/route-gate";
import {
  getModerationComment,
  isModerationAction,
  moderateComment,
  type ModerationAction,
} from "@indiecrafts/blog/lib/moderate";

/**
 * One-click comment moderation from the notification email. **GET renders a
 * confirm page** (read-only) — the mutation happens only on the confirm **POST**,
 * so a link-scanner / prefetcher (Outlook SafeLinks, etc.) can't auto-moderate.
 * Authorized by the one-time `moderationToken` (secret, single-use). Owner tool →
 * a self-contained HTML handler, not a localized page.
 */

const ACTION_VERB: Record<ModerationAction, string> = {
  approve: "Approuver ce commentaire",
  spam: "Marquer comme spam",
  delete: "Supprimer définitivement",
};
const ACTION_COLOR: Record<ModerationAction, string> = {
  approve: "#16a34a",
  spam: "#6b7280",
  delete: "#dc2626",
};
const DONE_MSG: Record<ModerationAction, string> = {
  approve: "Commentaire approuvé — il est maintenant visible sur le site.",
  spam: "Commentaire marqué comme spam — il reste masqué.",
  delete: "Commentaire supprimé.",
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
<html lang="fr"><head>
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

const expired = () =>
  page(
    "Lien expiré",
    `<h1 style="margin:0 0 12px;font-size:20px;color:#111827">Lien expiré</h1><p style="margin:0;font-size:15px;line-height:1.6">Ce lien de modération n'est plus valide — le commentaire a déjà été traité, ou le lien a expiré. Ouvrez le <a href="${escapeHtml(site.url)}/studio" style="color:#4f46e5">Studio</a> pour modérer.</p>`,
    410,
  );

export async function GET(request: Request) {
  if (!isCommentsEnabled())
    return NextResponse.json({ error: "not_found" }, { status: 404 });

  const params = new URL(request.url).searchParams;
  const token = params.get("token") ?? "";
  const action = params.get("action");
  if (!isModerationAction(action))
    return page("Action inconnue", `<p style="margin:0">Action inconnue.</p>`, 400);

  const comment = await getModerationComment(token);
  if (!comment) return expired();

  const excerpt = (comment.body ?? "").slice(0, 400);
  const inner = `
<h1 style="margin:0 0 20px;font-size:20px;color:#111827">${escapeHtml(ACTION_VERB[action])} ?</h1>
<p style="margin:0 0 4px;color:#6b7280;font-size:12px;text-transform:uppercase;letter-spacing:.04em">${escapeHtml(comment.authorName ?? "?")}${comment.post ? ` — ${escapeHtml(comment.post)}` : ""}</p>
<blockquote style="margin:8px 0 24px;padding:14px 18px;background:#f4f5f7;border-left:3px solid #e6e8eb;border-radius:6px;font-size:15px;line-height:1.6">${escapeHtml(excerpt).replaceAll("\n", "<br>")}</blockquote>
${action === "delete" ? `<p style="margin:0 0 20px;font-size:14px;color:#dc2626">Cette action est définitive.</p>` : ""}
<form method="post" action="/api/comments/moderate">
<input type="hidden" name="token" value="${escapeHtml(token)}">
<input type="hidden" name="action" value="${action}">
<button type="submit" style="border:0;cursor:pointer;display:inline-block;padding:12px 22px;background:${ACTION_COLOR[action]};color:#ffffff;border-radius:8px;font-weight:600;font-size:15px">${escapeHtml(ACTION_VERB[action])}</button>
</form>`;
  return page(ACTION_VERB[action], inner);
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
  if (!ok)
    return page(
      "Trop de requêtes",
      `<p style="margin:0">Trop de requêtes — réessayez dans quelques minutes.</p>`,
      429,
    );

  const form = await request.formData().catch(() => null);
  const token = String(form?.get("token") ?? "");
  const action = form?.get("action");
  if (!isModerationAction(action))
    return page("Action inconnue", `<p style="margin:0">Action inconnue.</p>`, 400);

  const result = await moderateComment(token, action);
  if (result === "invalid") return expired();

  return page(
    "C'est fait",
    `<h1 style="margin:0 0 12px;font-size:20px;color:#111827">✓ C'est fait</h1><p style="margin:0 0 20px;font-size:15px;line-height:1.6">${escapeHtml(DONE_MSG[action])}</p><a href="${escapeHtml(site.url)}/studio" style="color:#4f46e5;font-size:14px">Ouvrir le Studio</a>`,
  );
}
