"use client";

import { useEffect } from "react";
import { Error01 } from "@/components/pages-error/error-01";
import { logger } from "@/lib/logger";

type Props = { error: Error & { digest?: string }; reset: () => void };

export default function ErrorBoundary({ error, reset }: Readonly<Props>) {
  useEffect(() => {
    logger.error("Route error", error, { digest: error.digest });
  }, [error]);

  return <Error01 onRetry={reset} />;
}
