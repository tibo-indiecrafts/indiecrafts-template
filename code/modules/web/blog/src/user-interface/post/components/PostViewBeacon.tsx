"use client";

/**
 * Count one view of the post on screen.
 *
 * @see docs/reference/modules/web/blog/src/user-interface/post/components/PostViewBeacon.md
 */
import { useEffect } from "react";
import { logger } from "@indiecrafts/packages-shared-logger";

/**
 * Sends one anonymous view to `/api/views` when the post renders in a browser — the
 * Trending block's signal. It runs after hydration, so link prefetches and crawlers that
 * don't run JavaScript don't count. No cookie and nothing stored on the device: a reload
 * counts again, and the route's per-IP rate limit bounds the inflation. `sendBeacon`
 * survives the visitor leaving at once; `fetch` with `keepalive` is the fallback.
 */
export function PostViewBeacon({
  postId,
  locale,
}: {
  postId: string;
  locale: string;
}) {
  useEffect(() => {
    const body = JSON.stringify({ postId, locale });
    const sent = navigator.sendBeacon?.(
      "/api/views",
      new Blob([body], { type: "application/json" }),
    );
    if (sent) return;
    fetch("/api/views", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body,
      keepalive: true,
    }).catch((error: unknown) =>
      logger.error("post view beacon failed", { postId, error }),
    );
  }, [postId, locale]);
  return null;
}
