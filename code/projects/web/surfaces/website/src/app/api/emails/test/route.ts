/**
 * Send a sample of every enabled email, one group and the chosen languages, to a chosen address.
 *
 * @see docs/reference/projects/web/website/src/app/api/emails/test/route.md
 */
import { NextResponse } from "next/server";
import { features, isLocale, localeCodes, type Locale } from "@/config";
import { projectId } from "@indiecrafts/packages-web-sanity/env";
import { logger } from "@indiecrafts/packages-shared-logger";
import { apiFetch } from "@indiecrafts/packages-shared-utils/api-fetch";
import { sendEmail } from "@indiecrafts/packages-web-email";
import { buildSamples } from "./samples";

const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const SEND_SPACING_MS = 550; // under Resend's default 2 requests/s

/** `site` — built here · `service` (erasure, data request) and `account` (Clerk, welcome) —
 *  built by the api worker, which sends them itself. */
const SCOPES = ["site", "service", "account"] as const;
type Scope = (typeof SCOPES)[number];
type Result = { label: string; ok: boolean };

/**
 * Studio "Send test" endpoint — sends a sample of every **enabled** email of one group, in the
 * chosen languages, to a chosen address, so an editor can verify deliverability (does mail
 * leave the server, does it land, does the branded layout render). One group at a time, so a
 * test never floods the inbox.
 *
 * **Not public.** Gated by `features.studio`, then the caller's Sanity session
 * token is verified against the project's `users/me` — only a signed-in editor
 * of THIS project can trigger a send, so it can't be abused as a spam relay. The
 * `RESEND_API_KEY` secret stays server-side; test sends go **only** to the given
 * address, never copied (real copies are exercised by real sends, not test clicks).
 */
export async function POST(request: Request) {
  if (!features.studio) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const auth = request.headers.get("authorization") ?? "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7).trim() : "";
  if (!(await isProjectUser(token))) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  // Body is `{ to, scope?, locales? }` — cap it so this authenticated route can't be fed
  // an oversized payload (the public routes get this from `withGuard`).
  if (Number(request.headers.get("content-length") ?? 0) > 2000) {
    return NextResponse.json({ error: "too_large" }, { status: 413 });
  }
  let body: { to?: unknown; scope?: unknown; locales?: unknown };
  try {
    // Re-check actual bytes — the content-length header alone can be missing or lying.
    const text = await request.text();
    if (new TextEncoder().encode(text).length > 2000)
      return NextResponse.json({ error: "too_large" }, { status: 413 });
    body = JSON.parse(text) as typeof body;
  } catch {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
  const to = String(body.to ?? "").trim();
  if (!EMAIL.test(to)) {
    return NextResponse.json({ error: "Adresse e-mail invalide." }, { status: 400 });
  }
  // Defaults keep an older Studio (`{ to }` only) working: the site emails, every language.
  const scope = (body.scope ?? "site") as Scope;
  const locales = (body.locales ?? localeCodes) as unknown[];
  if (
    !SCOPES.includes(scope) ||
    !Array.isArray(locales) ||
    locales.length === 0 ||
    !locales.every((l) => typeof l === "string" && isLocale(l, localeCodes))
  ) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
  const chosen = [...new Set(locales as Locale[])];

  if (scope !== "site") return fromApi(to, scope, chosen);

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json(
      { error: "RESEND_API_KEY manquant côté serveur." },
      { status: 503 },
    );
  }
  const samples = await buildSamples(to, chosen);
  // One at a time, spaced: Resend's default team limit is 2 requests/s — sent at once, the
  // extra ones failed with a 429.
  // ponytail: fixed spacing; switch to Resend's batch endpoint if the sample count grows.
  const results: Result[] = [];
  for (const [i, { label, from, message }] of samples.entries()) {
    if (i > 0) await new Promise((resolve) => setTimeout(resolve, SEND_SPACING_MS));
    try {
      await sendEmail({ from, to: [to], ...message });
      results.push({ label, ok: true });
    } catch (error) {
      logger.error("email test send failed", { label, error });
      results.push({ label, ok: false });
    }
  }

  return NextResponse.json({ results });
}

/** The service and account emails: the api worker builds and sends them (`POST /v1/emails/test`). */
async function fromApi(to: string, scope: Scope, locales: Locale[]) {
  const url = process.env.API_URL;
  const token = process.env.APP_API_TOKEN;
  if (!url || !token) {
    return NextResponse.json(
      { error: "API_URL ou APP_API_TOKEN manquant côté serveur." },
      { status: 503 },
    );
  }
  try {
    const res = await apiFetch(`${url}/v1/emails/test`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({ to, scope, locales }),
      // Up to 26 spaced sends (13 account emails × 2 languages).
      timeoutMs: 60_000,
    });
    const data = (await res.json().catch(() => ({}))) as {
      results?: Result[];
      error?: string;
    };
    if (!res.ok) {
      return NextResponse.json(
        { error: `API : ${data.error ?? `HTTP ${res.status}`}` },
        { status: 502 },
      );
    }
    return NextResponse.json({ results: data.results ?? [] });
  } catch (error) {
    logger.error("email test api call failed", { scope, error });
    return NextResponse.json({ error: "API injoignable." }, { status: 502 });
  }
}

/** True only if `token` belongs to a member of THIS Sanity project (auth + authz in one call). */
async function isProjectUser(token: string): Promise<boolean> {
  if (!token) return false;
  try {
    const res = await fetch(`https://${projectId}.api.sanity.io/v1/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return false;
    const user = (await res.json()) as { id?: string };
    return Boolean(user?.id);
  } catch (error) {
    logger.error("email test auth check failed", { error });
    return false;
  }
}
