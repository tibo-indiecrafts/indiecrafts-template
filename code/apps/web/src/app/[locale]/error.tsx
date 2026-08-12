"use client";

// Copy stays in `messages/<locale>.json` (NOT Sanity, unlike maintenance + 404):
// this is a Next client error boundary — it can't await a server fetch, and it
// must render even when Sanity is the failure. Keeping it on bundled messages
// guarantees the 500 page never depends on the thing that may have broken.
import { useEffect } from "react";
import { Error as ErrorPage } from "@/user-interface/error/components/Error";
import { logger } from "@indiecrafts/utils";

type Props = { error: Error & { digest?: string }; reset: () => void };

export default function ErrorBoundary({ error, reset }: Readonly<Props>) {
  useEffect(() => {
    logger.error("Route error", error, { digest: error.digest });
  }, [error]);

  return <ErrorPage onRetry={reset} />;
}
