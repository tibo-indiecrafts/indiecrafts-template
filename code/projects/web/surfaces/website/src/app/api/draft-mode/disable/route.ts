/**
 * Exit Sanity draft preview and redirect the visitor to the home page.
 *
 * @see docs/reference/projects/web/website/src/app/api/draft-mode/disable/route.md
 */
import { draftMode } from "next/headers";
import { NextResponse } from "next/server";
import { features } from "@/config";

/**
 * Exit draft preview — sends the visitor back to the home page.
 * Gated by `features.studio` for parity with /enable.
 */
export async function GET(request: Request) {
  if (!features.studio) {
    return new Response("Not found", { status: 404 });
  }
  (await draftMode()).disable();
  return NextResponse.redirect(new URL("/", request.url));
}
