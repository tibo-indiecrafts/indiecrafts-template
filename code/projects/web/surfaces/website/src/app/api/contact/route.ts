/**
 * Accept a public contact form submission.
 *
 * @see docs/reference/projects/web/website/src/app/api/contact/route.md
 */
import { NextResponse } from "next/server";
import { features, security } from "@/config";
import { withGuard } from "@indiecrafts/packages-shared-security/guard";
import { submit } from "@indiecrafts/modules-web-contact/lib/contact";
import { getContactSettings } from "@indiecrafts/modules-web-contact/lib/settings";
import { getConsentPolicyVersion } from "@indiecrafts/packages-web-compliance/sanity/policy-version";

/**
 * Public contact submit. `withGuard` hardens the boundary (same-site origin, body
 * cap, rate limit, optional Turnstile) and parses the body once; the module's
 * `submit` validates, whitelists, writes the `contactMessage`, and fires the
 * best-effort emails. A honeypot-flagged submission returns `201` too, so bots
 * can't tell it was dropped.
 */
const handle = withGuard(async (_req, data) => {
  const body = (data ?? {}) as Record<string, unknown>;
  const result = await submit(
    {
      email: String(body.email ?? ""),
      message: String(body.message ?? ""),
      name: body.name ? String(body.name) : undefined,
      subject: body.subject ? String(body.subject) : undefined,
      consent: body.consent === true,
      source: body.source ? String(body.source) : undefined,
      language: body.language ? String(body.language) : undefined,
      honeypot: body.honeypot ? String(body.honeypot) : undefined,
      startedAt: typeof body.startedAt === "number" ? body.startedAt : undefined,
    },
    new Date().toISOString(),
    await getConsentPolicyVersion(),
  );
  if (result.ok) return NextResponse.json({ ok: true }, { status: 201 });
  // A spam-flagged submit answers 201 too — no signal to the bot.
  if (result.error === "spam") return NextResponse.json({ ok: true }, { status: 201 });
  if (result.error === "invalid")
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  return NextResponse.json({ error: "server" }, { status: 500 });
}, security.contact);

export async function POST(request: Request) {
  if (!features.contact) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  // The Studio `enabled` toggle is a live kill switch (no deploy): off → refuse
  // submissions, in lockstep with the `/contact` page 404ing.
  const settings = await getContactSettings();
  if (settings?.enabled === false) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  return handle(request);
}
