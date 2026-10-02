"use client";

/**
 * Render the web 500 error content card.
 *
 * @see docs/reference/packages/web/system-pages/src/web/ErrorContent.md
 */
import type { ReactNode } from "react";
import { Button } from "@indiecrafts/packages-web-ui/web/button";
import type { ErrorContentProps as BaseProps } from "../shared/types";

export type ErrorContentProps = BaseProps & {
  /** Optional brand mark above the copy (the host's configured logo). */
  brand?: ReactNode;
};

/**
 * Presentational error (500) content — the centered card only. The app's client
 * `error.tsx` boundary resolves the copy (from bundled messages, never Sanity —
 * the error page must render even when Sanity is what's down) and wraps this in
 * its own site chrome.
 */
export function ErrorContent({
  title,
  description,
  retryLabel,
  onRetry = () => undefined,
  brand,
}: ErrorContentProps) {
  return (
    <section className="mx-auto flex w-full max-w-xl flex-col items-center justify-center gap-4 px-(--gutter) py-24 text-center md:py-32">
      {brand}
      <h1 className="text-3xl font-semibold">{title}</h1>
      <p className="text-muted-foreground">{description}</p>
      <Button type="button" onClick={onRetry} className="mt-4">
        {retryLabel}
      </Button>
    </section>
  );
}
