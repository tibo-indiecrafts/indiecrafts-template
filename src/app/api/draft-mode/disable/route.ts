import { draftMode } from "next/headers";
import { NextResponse } from "next/server";

/** Exit draft preview — sends the visitor back to the home page. */
export async function GET(request: Request) {
  (await draftMode()).disable();
  return NextResponse.redirect(new URL("/", request.url));
}
