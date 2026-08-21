import { NextResponse } from "next/server";
import { buildInfo } from "@/lib/build-info";

/**
 * The live deploy's build id — polled by `@indiecrafts/packages-web-version`'s
 * `UpdatePrompt` to notice when a new version shipped while a tab was open. `no-store`
 * so a CDN can't serve a stale id (each deploy bakes its own `buildInfo`).
 */
export function GET() {
  return NextResponse.json(
    { version: buildInfo.version, commit: buildInfo.commit },
    { headers: { "cache-control": "no-store, max-age=0" } },
  );
}
