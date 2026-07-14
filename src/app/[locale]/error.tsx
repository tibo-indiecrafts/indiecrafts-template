"use client";

import { useEffect } from "react";
import { Error as ErrorPage } from "@/user-interface/error/components/Error";
import { logger } from "@/lib/logger";

type Props = { error: Error & { digest?: string }; reset: () => void };

export default function ErrorBoundary({ error, reset }: Readonly<Props>) {
  useEffect(() => {
    logger.error("Route error", error, { digest: error.digest });
  }, [error]);

  return <ErrorPage onRetry={reset} />;
}
