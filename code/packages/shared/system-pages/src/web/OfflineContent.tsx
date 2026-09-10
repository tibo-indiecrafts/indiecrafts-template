"use client";

import { Button } from "@indiecrafts/packages-web-ui/web/button";
import type { OfflineContentProps } from "../shared/types";

export type { OfflineContentProps };

/**
 * Presentational offline content — the centered card only, for a route that cannot
 * render without the network (the app decides when to show it; a non-blocking banner
 * covers the common case). The app resolves the copy (bundled messages, never Sanity —
 * this must render while offline) and wraps this in its own chrome. Next-agnostic (no
 * `next-intl`) — serves the Next website.
 */
export function OfflineContent({
  title,
  description,
  retryLabel,
  onRetry = () => undefined,
}: OfflineContentProps) {
  return (
    <section className="mx-auto flex w-full max-w-xl flex-col items-center justify-center gap-4 px-(--gutter) py-24 text-center md:py-32">
      <h1 className="text-3xl font-semibold">{title}</h1>
      <p className="text-muted-foreground">{description}</p>
      <Button type="button" onClick={onRetry} className="mt-4">
        {retryLabel}
      </Button>
    </section>
  );
}
