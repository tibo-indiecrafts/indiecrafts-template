import { draftMode } from "next/headers";
import { NextResponse } from "next/server";
import { features } from "@/config";

/**
 * Exit draft preview — sends the visitor back to the home page.
 * Gated by `features.blog` for parity with /enable.
 */
export async function GET(request: Request) {
  if (!features.blog) {
    return new Response("Not found", { status: 404 });
  }
  (await draftMode()).disable();
  return NextResponse.redirect(new URL("/", request.url));
}
