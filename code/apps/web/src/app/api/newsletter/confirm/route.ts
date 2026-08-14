import { NextResponse } from "next/server";
import { features, site } from "@/config";
import { confirmSubscriber } from "@indiecrafts/newsletter/lib/confirm";

/**
 * Double opt-in landing. The confirmation email links here with a one-time
 * `token`; a match flips the subscriber `pending → confirmed`. Redirects home
 * with `?newsletter=confirmed|invalid` (the token is an opaque nonce, not PII).
 */
export async function GET(request: Request) {
  if (!features.newsletter) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  const token = new URL(request.url).searchParams.get("token") ?? "";
  const result = await confirmSubscriber(token);
  return NextResponse.redirect(`${site.url}/?newsletter=${result}`);
}
