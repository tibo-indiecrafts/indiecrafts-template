"use client";

import { Button } from "@indiecrafts/ui/web/button";

export type ErrorContentProps = {
  title: string;
  description: string;
  retryLabel: string;
  onRetry?: () => void;
};

/**
 * Presentational error (500) content — the centered card only. The app's client
 * `error.tsx` boundary resolves the copy (from bundled messages, never Sanity —
 * the error page must render even when Sanity is what's down) and wraps this in
 * its own site chrome.
 */
export function ErrorContent({ title, description, retryLabel, onRetry = () => undefined }: ErrorContentProps) {
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
